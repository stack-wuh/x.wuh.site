'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Dialog from '@wuh.site/components/dialog'
import { IconArrowRight } from '@wuh.site/components/icons'
import {
  MessageAvatar,
  MessageContent,
  MessageMeta,
  MessageName,
  MessageStatus,
  MessageTime,
} from '@wuh.site/components/message-card'
import {
  ChatRow,
  Composer,
  ComposerBadge,
  ComposerInput,
  ComposerNicknameInput,
  ComposerSend,
  GuestbookCard,
  GuestbookFeed,
  GuestbookFooter,
  GuestbookFooterLink,
  GuestbookStage,
  GuestbookTrigger,
  GuestbookTriggerAvatar,
  GuestbookTriggerAvatars,
  GuestbookTriggerCopy,
  GuestbookTriggerCta,
  GuestbookTriggerLabel,
  GuestbookTriggerPreview,
  GuestbookTriggerTitle,
  GuestbookWrapper,
  NewMessageBanner,
} from './guestbook-barrage.styles'
import {
  clampGuestbookContent,
  createGuestbookMessage,
  normalizeGuestbookComments,
  sortGuestbookAsc,
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
  const [editingNickname, setEditingNickname] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(true)
  const [hasNewWhileAway, setHasNewWhileAway] = useState(false)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const clamped = useMemo(() => clampGuestbookContent(content), [content])
  const trimmedNickname = nickname.trim()
  const trimmedContent = clamped.value.trim()
  const failedCount = localMessages.filter((item) => item.status === 'failed').length
  const canSubmit = trimmedNickname.length >= MIN_NICKNAME_LENGTH && trimmedContent.length >= MIN_CONTENT_LENGTH
  const chatMessages = useMemo<ChatMessage[]>(() => {
    const samples = sampleMessages.map((item) => ({ ...item, mine: item.nickname === '吴尒红' }))
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
      setFootprint(createFootprint())
    }
  }, [])

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scrollToBottom = (behavior: ScrollBehavior) => {
    const viewport = viewportRef.current
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior })
    }
  }

  // 视口滚动监听：距底 50px 内视为贴底，恢复贴底时清除新留言提示
  useEffect(() => {
    if (!open) return
    const viewport = viewportRef.current
    if (!viewport) return

    const handleScroll = () => {
      const isAtBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 50
      setAtBottom(isAtBottom)
      if (isAtBottom) setHasNewWhileAway(false)
    }

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    return () => viewport.removeEventListener('scroll', handleScroll)
  }, [open])

  // 首次填充 instant 定位底部；后续新消息在贴底时跟随，否则提示
  const prevChatLengthRef = useRef(0)
  useEffect(() => {
    const prev = prevChatLengthRef.current
    prevChatLengthRef.current = chatMessages.length
    if (chatMessages.length <= prev) return
    if (atBottom) {
      scrollToBottom(prev === 0 || prefersReducedMotion() ? 'instant' : 'smooth')
    } else {
      setHasNewWhileAway(true)
    }
  }, [chatMessages.length, atBottom])

  useEffect(() => {
    if (!open) return

    let cancelled = false
    const loadMessages = async () => {
      setLoadingMessages(true)
      setListError(null)

      try {
        const params = new URLSearchParams({
          issueNumber: String(GUESTBOOK_ISSUE_NUMBER),
          limit: '500',
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
          const normalized = normalizeGuestbookComments(data, footprint) as GuestbookMessage[]
          setPersistedMessages(sortGuestbookAsc(normalized))
          if (data && typeof data === 'object' && 'pagination' in data) {
            const p = (data as { pagination?: { total?: number } }).pagination
            if (typeof p?.total === 'number') setTotalCount(p.total)
          }
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

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleChange = (value: string) => {
    if (value.length > MAX_LENGTH) return
    setContent(value)
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
      nickname: trimmedNickname,
      content: clamped.value.trim(),
      footprint,
    }) as GuestbookMessage[]
    const currentMessage = nextMessages[nextMessages.length - 1]
    if (!currentMessage) return

    setLocalMessages(nextMessages)
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

  const handleScrollToBottom = () => {
    scrollToBottom(prefersReducedMotion() ? 'instant' : 'smooth')
    setHasNewWhileAway(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      const form = (event.target as HTMLInputElement).closest('form')
      form?.requestSubmit()
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
          <GuestbookTriggerTitle>潘江陆海，各洒云尔~</GuestbookTriggerTitle>
          <GuestbookTriggerPreview>最近看到的想法、建议或者招呼，都可以放在这里。</GuestbookTriggerPreview>
        </GuestbookTriggerCopy>
        <GuestbookTriggerCta>
          <span>见字如面</span>
          <IconArrowRight />
        </GuestbookTriggerCta>
      </GuestbookTrigger>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title='留言板'
        subtitle='声无哀乐 · 萍水楚客，路远情长'
        width='min(1120px, calc(100vw - 32px))'
        height='min(720px, calc(100vh - 80px))'
      >
        <GuestbookWrapper>
          <GuestbookStage>
            <GuestbookFeed viewportRef={viewportRef} aria-label='留言列表'>
              {listError && (
                <div role='alert' style={{ padding: '8px 18px', fontSize: '0.78rem', color: 'var(--primary-color)' }}>
                  {listError}
                </div>
              )}
              {loadingMessages ? (
                <div style={{ color: 'var(--text-muted)', padding: '24px 18px', textAlign: 'center', fontSize: '0.82rem' }}>
                  留言加载中...
                </div>
              ) : (
                chatMessages.map((item) => (
                  <ChatRow key={item.id} $mine={Boolean(item.mine)} style={{ padding: '6px 18px' }}>
                    <MessageAvatar aria-hidden='true'>{getAvatarText(item.nickname)}</MessageAvatar>
                    <GuestbookCard $mine={Boolean(item.mine)}>
                      <MessageMeta align={item.mine ? 'end' : 'start'}>
                        <MessageName>{item.nickname}</MessageName>
                        <MessageTime>{item.time}</MessageTime>
                        {item.status === 'sending' && <MessageStatus>发送中...</MessageStatus>}
                        {item.status === 'sent' && <MessageStatus>已发送</MessageStatus>}
                        {item.status === 'failed' && (
                          <MessageStatus $tone='error'>{item.error || '发送失败'}</MessageStatus>
                        )}
                      </MessageMeta>
                      <MessageContent>{item.content}</MessageContent>
                    </GuestbookCard>
                  </ChatRow>
                ))
              )}
            </GuestbookFeed>
            {hasNewWhileAway && (
              <NewMessageBanner
                type='button'
                aria-label='有新留言，跳到最新'
                onClick={handleScrollToBottom}
              >
                有新留言 ↓
              </NewMessageBanner>
            )}
          </GuestbookStage>

          <GuestbookFooter>
            <GuestbookFooterLink
              as={Link}
              href='/guestbook'
              title='查看全部留言历史'
            >
              {totalCount != null ? `查看全部 ${totalCount} 条留言 →` : '—'}
            </GuestbookFooterLink>
          </GuestbookFooter>

          <Composer onSubmit={handleSubmit}>
            <ComposerBadge type='button' onClick={() => setEditingNickname(!editingNickname)} title='点击修改昵称'>
              {getAvatarText(trimmedNickname)}
            </ComposerBadge>
            {editingNickname ? (
              <ComposerNicknameInput
                value={nickname}
                placeholder='你的昵称'
                maxLength={20}
                onChange={(event) => handleNicknameChange(event.target.value)}
                onBlur={() => setEditingNickname(false)}
                onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); setEditingNickname(false); }}}
                autoFocus
              />
            ) : (
              <ComposerInput
                ref={inputRef}
                value={content}
                placeholder={trimmedNickname ? `作为 ${trimmedNickname}，说点什么...` : '说点什么...'}
                onChange={(event) => handleChange(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_LENGTH}
              />
            )}
            <ComposerSend type='submit' disabled={!canSubmit || submitting}>
              <IconArrowRight />
            </ComposerSend>
          </Composer>

          {failedCount > 0 && (
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--primary-color)' }}>
              {failedCount} 条发送失败
            </div>
          )}
        </GuestbookWrapper>
      </Dialog>
    </>
  )
}
