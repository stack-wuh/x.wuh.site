// ============================================
// 可点击筛选的标签 — 标签选择器
// import 路径：
//   Tag    → @wuh.site/components/tag
//   Row    → @wuh.site/components/flex
// ============================================

'use client'

import { useState } from 'react'
import Tag from '@wuh.site/components/tag'
import { Row } from '@wuh.site/components/flex'

const ALL_TAGS = [
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'React', color: '#61DAFB' },
  { name: 'CSS', color: '#1572B6' },
]

export function TagFilter() {
  const [selected, setSelected] = useState(new Set())

  const toggle = (name) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <Row gap={8} wrap>
      {ALL_TAGS.map((t) => (
        <button
          key={t.name}
          onClick={() => toggle(t.name)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Tag label={t.name} color={selected.has(t.name) ? t.color : null} />
        </button>
      ))}
    </Row>
  )
}
