// 面板源码规范清单（20261005 拆分定稿）：顺序 = 原 PlayerPanel.tsx 声明顺序。
// 守卫测试的 indexOf 声明名切片依赖此拼接顺序——各模块内声明相对顺序禁变，本清单禁重排。
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))

export const PANEL_SOURCES = [
  'panel/styles/tokens.ts',
  'panel/styles/shell.tsx',
  'panel/styles/ghost.tsx',
  'panel/styles/stage.tsx',
  'panel/styles/dock.tsx',
  'panel/styles/words.tsx',
  'panel/styles/queue.tsx',
  'panel/styles/mobile.tsx',
  'PlayerPanel.tsx',
  'panel/PanelVolume.tsx',
  'panel/PanelQueue.tsx',
  'panel/PanelMobile.tsx'
]

// 拼接读取：锚点切片语义与拆分前单文件等价；逐文件卫生断言由测试侧遍历 PANEL_SOURCES 完成
export const readPanelSource = () => PANEL_SOURCES.map((f) => readFileSync(join(dir, f), 'utf8')).join('\n')
