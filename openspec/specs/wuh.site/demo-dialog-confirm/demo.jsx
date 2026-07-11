// ============================================
// 确认弹窗 — useDialog + Dialog
// import 路径：
//   Dialog    → @wuh.site/components/dialog
//   useDialog → packages/hooks/useDialog
//   Button    → @wuh.site/components/button
// ============================================

'use client'

import Dialog from '@wuh.site/components/dialog'
import { useDialog } from 'packages/hooks/useDialog'
import Button from '@wuh.site/components/button'

export function DeleteConfirmDialog({ onConfirm }) {
  const dialog = useDialog()

  return (
    <>
      <Button variant="filled" color="danger" onClick={dialog.openDialog}>
        删除
      </Button>
      <Dialog {...dialog.bind} title="确认删除">
        <p>删除后不可恢复，确定要继续吗？</p>
        {({ close }) => (
          <>
            <Button variant="outlined" onClick={close}>取消</Button>
            <Button
              variant="filled"
              color="danger"
              onClick={() => { onConfirm?.(); close(); }}
            >
              确认删除
            </Button>
          </>
        )}
      </Dialog>
    </>
  )
}
