'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import Dialog from '@wuh.site/components/dialog'
import { IconArrowRight } from '@wuh.site/components/icons'
import {
  ChatAvatar,
  ChatBubble,
  ChatFeed,
  ChatMessageMeta,
  ChatRow,
  ChatStatus,
  Composer,
  ComposerActions,
  ComposerMeta,
  ComposerTextArea,
  GuestbookBody,
  GuestbookHeader,
  GuestbookPanel,
  GuestbookStage,
  GuestbookSubtitle,
  GuestbookTitle,
  GuestbookTrigger,
  GuestbookTriggerAvatar,
  GuestbookTriggerAvatars,
  GuestbookTriggerCopy,
  GuestbookTriggerCta,
  GuestbookTriggerLabel,
  GuestbookTriggerPreview,
  GuestbookTriggerTitle,
  GuestbookWrapper,
  LayoutBadge,
} from './guestbook-barrage.styles'
import {
  clampGuestbookContent,
  createGuestbookMessage,
  normalizeGuestbookComments,
} from './guestbook-barrage.helpers.js'

const MAX_LENGTH = 100
const MIN_NICKNAME_LENGTH = 2
const MIN_CONTENT_LENGTH = 5
const NICKNAME_STORAGE_KEY = 'wuh.site.guestbook.nickname'
const FOOTPRINT_STORAGE_KEY = 'wuh.site.guestbook.footprint'
const GUESTBOOK_ISSUE_NUMBER = 999999

type GuestbookMessage = {
  id: string
  nickname: string
  content: string
  footprint?: string
  createdAt: string
  status: 'sending' | 'sent' | 'failed'
  error?: string
  mine?: boolean
}

type ChatMessage = {
  id: string
  nickname: string
  content: string
  time: string
  mine?: boolean
  status?: GuestbookMessage['status']
  error?: string
}

const sampleMessages = [
  { id: 'sample-1', nickname: '吴尒红', content: '来这里打个招呼，顺便看看最近在折腾什么。', time: '刚刚' },
  { id: 'sample-2', nickname: '吴尒红', content: '欢迎留言，短句也很好。这里会像群聊一样一条条留住。', time: '2 分钟前' },
  { id: 'sample-3', nickname: '远方的朋友', content: '这个聊天式留言板比弹幕更容易回看。', time: '5 分钟前' },
] as const

const getAvatarText = (nickname: string) => nickname.trim().charAt(0).toUpperCase() || '?'
const formatDraftTime = (createdAt: string) =>
  new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(createdAt))
const createFootprint = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `guestbook-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function GuestbookBarrageDialog() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [persistedMessages, setPersistedMessages] = useState<GuestbookMessage[]>([])
  const [footprint, setFootprint] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [localMessages, setLocalMessages] = useState<GuestbookMessage[]>([])
  const [submitting, setSubmitting] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  const clamped = useMemo(() => clampGuestbookContent(content), [content])
  const trimmedNickname = nickname.trim()
  const trimmedContent = clamped.value.trim()
  const failedCount = localMessages.filter((item) => item.status === 'failed').length
  const canSubmit = trimmedNickname.length >= MIN_NICKNAME_LENGTH && trimmedContent.length >= MIN_CONTENT_LENGTH
  const chatMessages = useMemo<ChatMessage[]>(() => {
    const samples = sampleMessages.map((item) => ({ ...item, mine: item.nickname === 'Shadow' }))
    const persistedIds = new Set(persistedMessages.map((item) => item.id))
    const messages = [...persistedMessages, ...localMessages.filter((item) => !persistedIds.has(item.id))].map((item) => {
      const mine = localMessages.some((local) => local.id === item.id)
      return {
        id: item.id,
        content: item.content,
        nickname: item.nickname,
        time: formatDraftTime(item.createdAt),
        mine: mine || Boolean(item.mine),
        status: mine ? item.status : undefined,
        error: item.error,
      }
    })

    return [...samples, ...messages]
  }, [localMessages, persistedMessages])

  useEffect(() => {
    try {
      const cachedNickname = window.localStorage.getItem(NICKNAME_STORAGE_KEY)
      if (cachedNickname) setNickname(cachedNickname)
      const cachedFootprint = window.localStorage.getItem(FOOTPRINT_STORAGE_KEY)
      if (cachedFootprint) {
        setFootprint(cachedFootprint)
      } else {
        const nextFootprint = createFootprint()
        window.localStorage.setItem(FOOTPRINT_STORAGE_KEY, nextFootprint)
        setFootprint(nextFootprint)
      }
    } catch {
      // localStorage can be unavailable in hardened browsing modes.
      setFootprint(createFootprint())
    }
  }, [])

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatMessages.length, open])

  useEffect(() => {
    if (!open) return

    let cancelled = false
    const loadMessages = async () => {
      setLoadingMessages(true)
      setListError(null)

      try {
        const params = new URLSearchParams({
          issueNumber: String(GUESTBOOK_ISSUE_NUMBER),
          page: '1',
          limit: '50',
        })
        const res = await fetch(`/api/comments?${params.toString()}`, { cache: 'no-store' })
        const data = await res.json().catch(() => null)

        if (!res.ok) {
          const message =
            (data && typeof data === 'object' && 'message' in data && String(data.message)) ||
            `留言加载失败 (${res.status})`
          throw new Error(message)
        }

        if (!cancelled) {
          setPersistedMessages(normalizeGuestbookComments(data, footprint) as GuestbookMessage[])
        }
      } catch (error) {
        if (!cancelled) {
          setListError(error instanceof Error ? error.message : '留言加载失败')
        }
      } finally {
        if (!cancelled) setLoadingMessages(false)
      }
    }

    void loadMessages()

    return () => {
      cancelled = true
    }
  }, [footprint, open])

  const handleChange = (value: string) => {
    const next = clampGuestbookContent(value)
    setContent(next.value)
  }

  const handleNicknameChange = (value: string) => {
    const next = value.slice(0, 20)
    setNickname(next)
    const trimmed = next.trim()
    if (trimmed) {
      try {
        window.localStorage.setItem(NICKNAME_STORAGE_KEY, trimmed)
      } catch {
        // Ignore storage failures; the current input still works.
      }
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || submitting) return

    const nextMessages = createGuestbookMessage(localMessages, {
      nickname,
      content,
      footprint,
    }) as GuestbookMessage[]
    const currentMessage = nextMessages[nextMessages.length - 1]
    if (!currentMessage) return

    setLocalMessages(nextMessages)
    handleNicknameChange(nickname)
    setContent('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: currentMessage.nickname,
          content: currentMessage.content,
          footprint: currentMessage.footprint,
          page: 'about-guestbook',
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message =
          (data && typeof data === 'object' && 'message' in data && String(data.message)) ||
          `留言提交失败 (${res.status})`
        throw new Error(message)
      }
      const savedComment =
        data && typeof data === 'object'
          ? data as { externalId?: unknown; _id?: unknown; createdAt?: unknown }
          : null
      const savedId =
        savedComment ? String(savedComment.externalId || savedComment._id || currentMessage.id) : currentMessage.id
      const savedCreatedAt =
        typeof savedComment?.createdAt === 'string'
          ? savedComment.createdAt
          : currentMessage.createdAt
      setLocalMessages((prev) =>
        prev.map((item) =>
          item.id === currentMessage.id
            ? { ...item, id: savedId, createdAt: savedCreatedAt, status: 'sent', error: undefined }
            : item
        )
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : '留言提交失败'
      setLocalMessages((prev) =>
        prev.map((item) => (item.id === currentMessage.id ? { ...item, status: 'failed', error: message } : item))
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <GuestbookTrigger type='button' onClick={() => setOpen(true)}>
        <GuestbookTriggerAvatars aria-hidden='true'>
          <GuestbookTriggerAvatar>W</GuestbookTriggerAvatar>
          <GuestbookTriggerAvatar>你</GuestbookTriggerAvatar>
        </GuestbookTriggerAvatars>
        <GuestbookTriggerCopy>
          <GuestbookTriggerLabel>Guestbook</GuestbookTriggerLabel>
          <GuestbookTriggerTitle>给我留一句话</GuestbookTriggerTitle>
          <GuestbookTriggerPreview>最近看到的想法、建议或者招呼，都可以放在这里。</GuestbookTriggerPreview>
        </GuestbookTriggerCopy>
        <GuestbookTriggerCta>
          <span>进入</span>
          <IconArrowRight />
        </GuestbookTriggerCta>
      </GuestbookTrigger>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title='留言板'
        width='min(1120px, calc(100vw - 32px))'
        height='min(720px, calc(100vh - 80px))'
      >
        <GuestbookWrapper>
          <GuestbookHeader>
            <div>
              <GuestbookTitle>留言板</GuestbookTitle>
              <GuestbookSubtitle>像群聊一样留下一句话，点击发送后会立即提交。</GuestbookSubtitle>
            </div>
            <LayoutBadge>
              {submitting
                ? '发送中'
                : loadingMessages
                  ? '加载中'
                  : listError
                    ? '加载失败'
                    : failedCount
                      ? `${failedCount} 条失败`
                      : '群聊模式'}
            </LayoutBadge>
          </GuestbookHeader>

          <GuestbookBody>
            <GuestbookPanel>
              <GuestbookStage>
                <ChatFeed ref={feedRef}>
                  {chatMessages.map((item) => (
                    <ChatRow key={item.id} $mine={Boolean(item.mine)}>
                      <ChatAvatar aria-hidden='true'>{getAvatarText(item.nickname)}</ChatAvatar>
                      <ChatBubble $mine={Boolean(item.mine)}>
                        <ChatMessageMeta>
                          <span>{item.nickname}</span>
                          <time>{item.time}</time>
                        </ChatMessageMeta>
                        <p>{item.content}</p>
                        {item.status === 'sending' && <ChatStatus>发送中...</ChatStatus>}
                        {item.status === 'sent' && <ChatStatus>已发送</ChatStatus>}
                        {item.status === 'failed' && (
                          <ChatStatus $tone='error'>{item.error || '发送失败'}</ChatStatus>
                        )}
                      </ChatBubble>
                    </ChatRow>
                  ))}
                </ChatFeed>
              </GuestbookStage>

              <Composer onSubmit={handleSubmit}>
                <input
                  value={nickname}
                  placeholder='你的昵称'
                  maxLength={20}
                  onChange={(event) => handleNicknameChange(event.target.value)}
                />
                <ComposerTextArea
                  value={content}
                  maxLength={MAX_LENGTH}
                  rows={2}
                  placeholder='在群里说点什么...'
                  onChange={(event) => handleChange(event.target.value)}
                />
                <ComposerMeta $overLimit={clamped.remaining === 0 && clamped.length > 0}>
                  <span>
                    {trimmedNickname.length < MIN_NICKNAME_LENGTH
                      ? '昵称至少 2 个字符'
                      : trimmedContent.length < MIN_CONTENT_LENGTH
                        ? '内容至少 5 个字符'
                        : `当前昵称：${trimmedNickname}`}
                  </span>
                  <span>{clamped.length} / {MAX_LENGTH}</span>
                </ComposerMeta>
                <ComposerActions>
                  <button type='submit' disabled={!canSubmit || submitting}>
                    <IconArrowRight />
                    发送
                  </button>
                </ComposerActions>
              </Composer>
            </GuestbookPanel>
          </GuestbookBody>
        </GuestbookWrapper>
      </Dialog>
    </>
  )
}
