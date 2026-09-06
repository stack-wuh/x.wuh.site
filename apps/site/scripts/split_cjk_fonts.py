#!/usr/bin/env python3
"""CJK 字体 unicode-range 切片管线。

⚠️ 现状结论（20260906-fix-post-fcp-payload change 取证）：站点当前使用的
Noto Sans/Serif SC 为 ~1795 字的子集字体（单字重 245-322KB woff2），
对该体量做切片会丢失 woff2 跨字形压缩优势，切片总量反升至 2.2 倍、
首屏可省字节有限，属负优化——已改用 app/fonts/cjk.css 构建管线接入
（内容哈希 + immutable 缓存）解决回访重复下载问题。

本脚本保留用于未来切换全量字形大字体（数 MB 级，切片收益为正）的场景。
用法：python3 split_cjk_fonts.py [--bucket 300]

将 public/fonts 下的整包 CJK woff2 切成小片（每片 300 码点），产出：
  apps/site/app/fonts/<family>.css      # 每片一个 @font-face + unicode-range
  apps/site/app/fonts/files/*.woff2     # 切片字体

切片顺序 = ASCII/标点 → GB2312 一级字表（3755 常用字，pinyin 频序）→ 其余码点
升序，保证正文高频字形集中在首片，浏览器按页面实际用到的 range 按需拉取。
依赖：pip install fonttools brotli
"""

import argparse
import io
import sys
from pathlib import Path

from fontTools import ttLib
from fontTools.subset import Subsetter, Options

SITE = Path(__file__).resolve().parent.parent
FONTS_IN = SITE / "public" / "fonts"
FONTS_OUT = SITE / "app" / "fonts"
FILES_OUT = FONTS_OUT / "files"

# (源文件, font-family, font-weight, 产物 css 名)
TARGETS = [
    ("NotoSansSC-400.woff2", "Noto Sans SC", 400, "noto-sans-sc"),
    ("NotoSansSC-700.woff2", "Noto Sans SC", 700, "noto-sans-sc"),
    ("NotoSerifSC-400.woff2", "Noto Serif SC", 400, "noto-serif-sc"),
    ("NotoSerifSC-700.woff2", "Noto Serif SC", 700, "noto-serif-sc"),
]


def gb2312_level1() -> list[int]:
    """GB2312 一级常用字（区位 16-55 区，3755 字，按拼音频序）。"""
    chars: list[int] = []
    for hi in range(0xB0, 0xD8):
        for lo in range(0xA1, 0xFF):
            try:
                chars.append(ord(bytes([hi, lo]).decode("gb2312")))
            except UnicodeDecodeError:
                pass
    return chars


def slice_order(cmap: dict[int, int]) -> list[int]:
    """全量码点按「高频优先」排序：ASCII/标点 → GB2312 一级 → 其余升序。"""
    have = set(cmap)
    head: list[int] = []
    head += [c for c in range(0x20, 0x7F) if c in have]  # ASCII 可见区
    for lo, hi in [(0x2013, 0x2027), (0x00B7, 0x00B7), (0x3000, 0x3011),
                   (0x3013, 0x3013), (0xFF01, 0xFF65)]:
        head += [c for c in range(lo, hi + 1) if c in have]
    ordered = [c for c in dict.fromkeys(head + gb2312_level1()) if c in have]
    ordered += sorted(c for c in have if c not in set(ordered))
    return ordered


def fmt_range(codes: list[int]) -> str:
    """[0x4E00,0x4E01,0x4E02,...] → 'U+4E00-4E02'（单点不带 -）。"""
    codes = sorted(codes)
    parts: list[str] = []
    start = prev = codes[0]
    for c in codes[1:]:
        if c == prev + 1:
            prev = c
            continue
        parts.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
        start = prev = c
    parts.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
    return ",".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bucket", type=int, default=300, help="每片码点数")
    args = ap.parse_args()

    FILES_OUT.mkdir(parents=True, exist_ok=True)
    total_src = total_out = 0

    for src_name, family, weight, css_name in TARGETS:
        src = FONTS_IN / src_name
        if not src.exists():
            print(f"skip (missing): {src}")
            continue
        font = ttLib.TTFont(str(src))  # woff2 需 brotli
        cmap = font.getBestCmap()
        order = slice_order(cmap)
        buckets = [order[i:i + args.bucket] for i in range(0, len(order), args.bucket)]

        css_rules: list[str] = []
        for idx, codes in enumerate(buckets):
            # 每片从源字体重新 subset，避免增量破坏
            work = ttLib.TTFont(str(src))
            work.flavor = None
            opts = Options()
            opts.flavor = "woff2"
            opts.layout_features = ["*"]  # 保留 kern/GSUB 闭包
            opts.name_IDs = [1, 2, 3, 4, 6]
            opts.notdef_outline = True
            ss = Subsetter(options=opts)
            ss.populate(unicodes=codes)
            ss.subset(work)

            buf = io.BytesIO()
            work.save(buf)
            data = buf.getvalue()
            total_src += len(data)
            file_name = f"{css_name}-{weight}-{idx:03d}.woff2"
            (FILES_OUT / file_name).write_bytes(data)
            total_out += len(data)

            css_rules.append(
                "@font-face{"
                f"font-family:'{family}';font-style:normal;font-weight:{weight};"
                "font-display:swap;"
                f"src:url('./files/{file_name}') format('woff2');"
                f"unicode-range:{fmt_range(codes)};}}"
            )

        css_path = FONTS_OUT / f"{css_name}-{weight}.css"
        css_path.write_text("\n".join(css_rules), encoding="utf-8")
        print(f"{src_name}: {len(buckets)} 片, css={css_path.name}")

    print(f"切片总量 {total_out // 1024} KB（源 {total_src // 1024} KB 未压缩 TTF 口径）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
