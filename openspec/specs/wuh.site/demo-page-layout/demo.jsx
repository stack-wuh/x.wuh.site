// ============================================
// 页面布局 — Flex/Row/Column/Center
// import 路径：
//   Flex/Row/Column/Center 等 → @wuh.site/components/flex
// ============================================

import { Row, Column, Center, SpaceBetween, Wrap } from '@wuh.site/components/flex'

// 水平导航栏
export function NavBar({ left, right }) {
  return (
    <SpaceBetween alignItems="center" padding={[0, 16]}>
      <Row gap={16} alignItems="center">
        {left}
      </Row>
      <Row gap={8} alignItems="center">
        {right}
      </Row>
    </SpaceBetween>
  )
}

// 垂直卡片布局
export function CardStack({ children }) {
  return (
    <Column gap="lg" padding="md">
      {children}
    </Column>
  )
}

// 居中内容
export function CenteredSection({ children }) {
  return (
    <Center fullWidth style={{ minHeight: 300 }}>
      {children}
    </Center>
  )
}

// 标签列表（换行）
export function TagList({ tags }) {
  return (
    <Wrap gap={[8, 4]} alignItems="center">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </Wrap>
  )
}
