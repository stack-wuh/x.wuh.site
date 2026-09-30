#!/usr/bin/env python3
"""CJK 子集并集扩列（20260930-style-player-favorite-ai-seal 落档；源自 i18n 假名扩列配方）。

目标码点集 = 现有 app/fonts/files/*.woff2 的 cmap ∪ 假名/标点区 ∪ 三语词典全量字符 ∪ 品牌印章字形。
从 Noto CJK 官方源字体（SubsetOTF 包）重新子集化，原地替换四款 woff2
（文件名不变 → app/fonts/cjk.css 管线内容哈希自动更新）。

源字体准备（一次性）：从 notofonts/noto-cjk 官方 release 下载 SubsetOTF 包，
把 NotoSansSC-{Regular,Bold}.otf 与 NotoSerifSC-{Regular,Bold}.otf 放入
NOTO_SRC_DIR（默认 /tmp/noto-src）。运行环境需 fontTools + brotli
（python3 -m venv && pip install fonttools brotli）。

品牌印章字形（勿删，删了会退回系统回退字体渲染）：
    樂 U+6A02（面板进度/音量印） · 墨 U+58A8（页头外观钮印）
    愛 U+611B / 念 U+5FF5 / 音 U+97F3 已随词典与历史子集入集
"""
from pathlib import Path
import os

from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

SITE = Path(__file__).resolve().parent.parent
FONTS_OUT = SITE / 'app' / 'fonts' / 'files'
DICT_DIR = SITE.parent.parent / 'packages' / 'components' / 'locales' / 'dictionaries'
SRC = Path(os.environ.get('NOTO_SRC_DIR', '/tmp/noto-src'))

# 品牌印章字形集：面板进度印「樂/愛」、页头印「墨」、主题样张「念」、移动端音印「音」
SEAL_CODES = {0x6A02, 0x58A8, 0x611B, 0x5FF5, 0x97F3}

TARGETS = [
    ('NotoSansSC-Regular.otf', 'NotoSansSC-400.woff2'),
    ('NotoSansSC-Bold.otf', 'NotoSansSC-700.woff2'),
    ('NotoSerifSC-Regular.otf', 'NotoSerifSC-400.woff2'),
    ('NotoSerifSC-Bold.otf', 'NotoSerifSC-700.woff2'),
]


def dict_charset() -> set[int]:
    """三语词典片段与装配文件的全量非 ASCII 码点。"""
    codes: set[int] = set()
    for pattern in ('*.ts', '*/[a-z]*.ts'):
        for f in DICT_DIR.glob(pattern):
            codes.update(ord(c) for c in f.read_text(encoding='utf-8') if ord(c) > 0x7F)
    return codes


def extra_ranges() -> set[int]:
    codes: set[int] = set()
    codes.update(range(0x3041, 0x3100))   # 平假名 + 片假名
    codes.update(range(0x3000, 0x3040))   # CJK 标点（、。「」々〆）
    codes.update(range(0xFF01, 0xFF21))   # 全角标点（！？：；）
    codes.update(range(0xFF66, 0xFFA0))   # 半角片假名
    return codes


def main() -> None:
    codes_from_dict = dict_charset()
    want = extra_ranges() | codes_from_dict | SEAL_CODES
    print(f'词典码点 {len(codes_from_dict)}，附加区间 {len(extra_ranges())}，印章 {len(SEAL_CODES)}')

    for src_name, out_name in TARGETS:
        out_path = FONTS_OUT / out_name
        current = set(TTFont(str(out_path)).getBestCmap().keys())
        unicodes = sorted(current | want)
        font = TTFont(str(SRC / src_name))
        missing = [c for c in (want | current) if c not in font.getBestCmap()]
        opts = Options()
        opts.flavor = 'woff2'
        opts.layout_features = ['ccmp']
        opts.name_IDs = [1, 2]
        opts.notdef_outline = True
        opts.hinting = False
        opts.desubroutinize = True
        opts.drop_tables += ['DSIG', 'vhea', 'vmtx']
        sub = Subsetter(options=opts)
        sub.populate(unicodes=unicodes)
        sub.subset(font)
        font.save(str(out_path))
        new = TTFont(str(out_path))
        cmap = new.getBestCmap()
        seals = {hex(c): (c in cmap) for c in sorted(SEAL_CODES)}
        print(f'{out_name}: {len(current)} -> {len(cmap)} 码点, '
              f'印章 {seals}, 大小 {out_path.stat().st_size // 1024}KB, '
              f'源字体缺字 {len(missing)}')


if __name__ == '__main__':
    main()
