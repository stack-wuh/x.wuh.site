// ============================================
// 全局消息提示 — 操作反馈
// import 路径：
//   message → @wuh.site/components/message
//   Button  → @wuh.site/components/button
//   Row     → @wuh.site/components/flex
// ============================================

'use client'

import message from '@wuh.site/components/message'
import Button from '@wuh.site/components/button'
import { Row } from '@wuh.site/components/flex'

export function MessageDemo() {
  const handleSubmit = async () => {
    try {
      const close = message.loading('提交中...')
      await fakeApi()
      close()
      message.success('提交成功')
    } catch {
      message.error('提交失败，请重试')
    }
  }

  return (
    <Row gap={8}>
      <Button onClick={() => message.success('操作已保存')}>保存成功</Button>
      <Button variant="outlined" color="warning" onClick={() => message.warning('请注意检查')}>
        警告
      </Button>
      <Button variant="outlined" color="danger" onClick={() => message.error('发生错误')}>
        错误
      </Button>
      <Button variant="text" onClick={handleSubmit}>Loading 示例</Button>
    </Row>
  )
}

async function fakeApi() {
  await new Promise((r) => setTimeout(r, 2000))
}
