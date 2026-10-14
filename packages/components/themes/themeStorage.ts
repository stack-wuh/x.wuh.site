/**
 * 主题/配色持久化契约的单一来源。
 * 非 'use client' 模块：app/layout.tsx 的服务端 anti-FOUC 脚本模板需要读取这些常量，
 * 而 'use client' 模块的普通常量在服务端只会拿到客户端引用代理（RSC 边界约束）。
 * ThemeModeProvider（客户端）与 layout 内联脚本（SSR 生成期）必须共享本文件，
 * 字面值由守卫测试钉死一致性。
 */
export const THEME_STORAGE_KEY = 'wuh.site.theme'
export const COLOR_SCHEME_STORAGE_KEY = 'wuh.site.color-scheme-mode'

/** 主题族取值集合（index 0 为默认值）——anti-FOUC 脚本白名单与 parseTheme 共用 */
export const THEME_FAMILY_VALUES = ['wine', 'plain'] as const
/** 配色 mode 取值集合（index 0 为默认值）——anti-FOUC 脚本白名单与 parseColorSchemeMode 共用 */
export const COLOR_SCHEME_MODE_VALUES = ['system', 'light', 'dark'] as const
