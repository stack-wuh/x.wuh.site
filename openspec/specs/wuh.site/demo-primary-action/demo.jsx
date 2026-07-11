// ============================================
// 主操作按钮 — 表单提交 / CTA
// import 路径：
//   Button → @wuh.site/components/button
// ============================================

import Button from '@wuh.site/components/button'
import { ArrowRight, Send, Save } from 'lucide-react'

// 实心主按钮（表单提交）
export function SubmitButton() {
  return <Button type="submit" variant="filled" color="primary" icon={<Send size={16} />}>提交</Button>
}

// 描边次要按钮
export function CancelButton() {
  return <Button variant="outlined" color="secondary">取消</Button>
}

// 文字按钮 + 右图标
export function ReadMore({ href }) {
  return (
    <Button href={href} variant="text" color="primary" iconPosition="right" icon={<ArrowRight size={16} />}>
      阅读更多
    </Button>
  )
}

// 全宽保存按钮
export function SaveButton() {
  return <Button variant="filled" color="primary" fullWidth icon={<Save size={16} />}>保存</Button>
}
