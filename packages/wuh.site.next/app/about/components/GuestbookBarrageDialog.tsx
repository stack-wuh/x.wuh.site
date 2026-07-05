'use client'

import { FormEvent, useMemo, useState } from 'react'
import Dialog from '@wuh.site/components/dialog'
import { IconArrowRight, IconBars, IconClose } from '@wuh.site/components/icons'
import {
  BarrageItem,
  BarragePanel,
  Composer,
  ComposerActions,
  ComposerMeta,
  ComposerTextArea,
  ComposerToggle,
  ComposerToggleLabel,
  GuestbookBody,
  GuestbookHeader,
  GuestbookLayout,
  GuestbookList,
  GuestbookListItem,
  GuestbookListMeta,
  GuestbookListText,
  GuestbookListTitle,
  GuestbookPanel,
  GuestbookStage,
  GuestbookSubtitle,
  GuestbookTitle,
  GuestbookTrigger,
  GuestbookTriggerLabel,
  GuestbookWrapper,
  LayoutBadge,
} from './guestbook-barrage.styles'
import {
  clampGuestbookContent,
  flushGuestbookDrafts,
  queueGuestbookDraft,
  resolveGuestbookLayout,
} from './guestbook-barrage.helpers.js'

const MAX_LENGTH = 100

type GuestbookDraft = {
  id: string
  nickname: string
  content: string
  createdAt: string
  status: 'pending'
}

const mockBarrage = [
  { id: 1, text: '这里会显示弹幕内容，像 B 站一样飘过屏幕。', lane: 0, tone: 'soft' },
  { id: 2, text: '弹幕支持更轻快的浏览方式。', lane: 1, tone: 'accent' },
  { id: 3, text: '列表默认隐藏，点击按钮才展开。', lane: 2, tone: 'soft' },
  { id: 4, text: '桌面端左右并列，移动端上下布局。', lane: 3, tone: 'accent' },
]

export default function GuestbookBarrageDialog() {
  const [open, setOpen] = useState(false)
  const [showList, setShowList] = useState(false)
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [draftQueue, setDraftQueue] = useState<GuestbookDraft[]>([])
  const [submitting, setSubmitting] = useState(false)

  const clamped = useMemo(() => clampGuestbookContent(content), [content])
  const canSubmit = nickname.trim().length > 0 && clamped.length > 0
  const layout = resolveGuestbookLayout(false, showList)

  const handleChange = (value: string) => {
    const next = clampGuestbookContent(value)
    setContent(next.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || submitting) return

    const nextQueue = queueGuestbookDraft(draftQueue, {
      nickname,
      content,
    }) as GuestbookDraft[]

    setDraftQueue(nextQueue)
    setNickname('')
    setContent('')
  }

  const handleClose = async () => {
    if (!submitting && draftQueue.length > 0) {
      setSubmitting(true)
      const remaining = await flushGuestbookDrafts(draftQueue, async (draft) => {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: draft.nickname, content: draft.content, page: 'about-guestbook' }),
        })
        if (!res.ok) throw new Error('Failed to submit draft')
      })
      setDraftQueue(remaining as GuestbookDraft[])
      setSubmitting(false)
    }
    setOpen(false)
  }

  return (
    <>
      <GuestbookTrigger type='button' onClick={() => setOpen(true)}>
        <IconBars />
        <GuestbookTriggerLabel>
          <strong>留言板</strong>
          <span>打开弹幕弹窗</span>
        </GuestbookTriggerLabel>
      </GuestbookTrigger>

      <Dialog
        open={open}
        onClose={handleClose}
        title='留言板'
        width='min(1120px, calc(100vw - 32px))'
        height='min(720px, calc(100vh - 80px))'
      >
        <GuestbookWrapper>
          <GuestbookHeader>
            <div>
              <GuestbookTitle>留言板</GuestbookTitle>
              <GuestbookSubtitle>先本地出弹幕，关闭时再统一提交，避免频繁请求。</GuestbookSubtitle>
            </div>
            <LayoutBadge>{showList ? '双栏展示' : '弹幕优先'}</LayoutBadge>
          </GuestbookHeader>

          <GuestbookBody>
            <GuestbookLayout $layout={layout}>
              <GuestbookPanel>
                <GuestbookStage>
                  <BarragePanel>
                    {mockBarrage.map((item) => (
                      <BarrageItem key={item.id} $lane={item.lane} $tone={item.tone}>
                        {item.text}
                      </BarrageItem>
                    ))}
                  </BarragePanel>
                </GuestbookStage>

                <Composer onSubmit={handleSubmit}>
                  <input
                    value={nickname}
                    placeholder='你的昵称'
                    maxLength={20}
                    onChange={(event) => setNickname(event.target.value)}
                  />
                  <ComposerTextArea
                    value={content}
                    maxLength={MAX_LENGTH}
                    rows={1}
                    placeholder='发一条弹幕...'
                    onChange={(event) => handleChange(event.target.value)}
                  />
                  <ComposerMeta $overLimit={clamped.remaining === 0 && clamped.length > 0}>
                    <span>
                      {clamped.length} / {MAX_LENGTH}
                    </span>
                    <span>{clamped.remaining} 字可输入</span>
                  </ComposerMeta>
                  <ComposerActions>
                    <ComposerToggle
                      type='button'
                      aria-pressed={showList}
                      onClick={() => setShowList((prev) => !prev)}
                    >
                      <IconBars />
                      <ComposerToggleLabel>{showList ? '收起列表' : '展开列表'}</ComposerToggleLabel>
                    </ComposerToggle>
                    <button type='submit' disabled={!canSubmit || submitting}>
                      <IconArrowRight />
                      发送
                    </button>
                  </ComposerActions>
                </Composer>
              </GuestbookPanel>

              {showList && (
                <GuestbookList>
                  <GuestbookListTitle>
                    留言列表
                    <button type='button' aria-label='关闭留言列表' onClick={() => setShowList(false)}>
                      <IconClose />
                    </button>
                  </GuestbookListTitle>
                  <GuestbookListItem>
                    {draftQueue.map((item) => (
                      <li key={item.id}>
                        <GuestbookListMeta>
                          <strong>{item.nickname}</strong>
                          <span>待提交</span>
                        </GuestbookListMeta>
                        <GuestbookListText>{item.content}</GuestbookListText>
                      </li>
                    ))}
                    {!draftQueue.length && (
                      <li>
                        <GuestbookListText>还没有待提交的留言，先发一条弹幕吧。</GuestbookListText>
                      </li>
                    )}
                  </GuestbookListItem>
                </GuestbookList>
              )}
            </GuestbookLayout>
          </GuestbookBody>
        </GuestbookWrapper>
      </Dialog>
    </>
  )
}
