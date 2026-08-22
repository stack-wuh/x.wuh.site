#!/usr/bin/env bash
set -euo pipefail

# 完整发布链：版本提升 → CHANGELOG → tag → push → 创建 GitHub Release（触发 CI 部署）

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

usage() {
  cat <<'USAGE'
Usage: $(basename "$0") [major|minor|patch]
  提升版本并发布：standard-version 提升版本 + 生成 CHANGELOG + 打 tag，
  push 到 main 后创建 GitHub Release（触发 ci-cd.yml 的 release published 部署链）。
  level 默认 patch。
USAGE
}

level="${1:-patch}"
case "$level" in
  major|minor|patch) ;;
  *) echo "未知版本级别: $level（可选 major|minor|patch）" >&2; exit 1 ;;
esac

echo "🔍 校验发布前置条件..."

if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 工作区有未提交改动，先提交或 stash 后再发布" >&2
  exit 1
fi

current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo "❌ 当前分支是 $current_branch，发布必须从 main 分支执行" >&2
  exit 1
fi

git fetch origin main
if ! git merge-base --is-ancestor HEAD "origin/main"; then
  echo "❌ 本地 main 落后于 origin/main，先 pull 后再发布" >&2
  exit 1
fi

echo ""
echo "📦 将执行发布链:"
echo "  1. pnpm version:$level（standard-version：版本 + CHANGELOG + 提交 + tag）"
echo "  2. git push origin main --follow-tags"
echo "  3. gh release create（触发 CI 部署链）"
echo ""
read -r -p "确认发布 $level 版本？(y/N) " answer
if [ "${answer:-N}" != "y" ] && [ "${answer:-N}" != "Y" ]; then
  echo "已取消"
  exit 0
fi

echo ""
echo "🚀 提升版本 ($level)..."
pnpm "version:$level"

echo ""
echo "📤 推送 main 与 tag..."
git push origin main --follow-tags

echo ""
echo "🏷️  创建 GitHub Release..."
tag=$(git describe --tags --abbrev=0)
release_url=$(gh release create "$tag" --generate-notes --title "Release $tag" --latest 2>&1 | tail -1)

echo ""
echo "✅ 发布完成: $release_url"
echo "   CI 已由 release published 事件触发部署链。"
