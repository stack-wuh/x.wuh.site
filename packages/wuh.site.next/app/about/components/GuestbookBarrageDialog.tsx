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
  ComposerBadge,
  ComposerInput,
  ComposerNicknameInput,
  ComposerSend,
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
} from './guestbook-barrage.styles'
import styled from '@wuh.site/components/styled'

const GuestbookGuide = styled.p`
  margin: 0;
  padding: 6px 18px 4px;
  font-size: var(--font-size-sm, 14px);
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.6;
  text-align: center;

  @media (max-width: 640px) {
    padding: 6px 12px 4px;
    font-size: 13px;
  }
`
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
  const feedRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      setFootprint(createFootprint())
    }
  }, [])

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatMessages.length])

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
        subtitle='声无哀乐'
        width='min(1120px, calc(100vw - 32px))'
        height='min(720px, calc(100vh - 80px))'
      >
        <GuestbookWrapper>
          <GuestbookGuide>萍水楚客，路远情长</GuestbookGuide>
          <GuestbookStage>
            <ChatFeed ref={feedRef}>
              {loadingMessages && (
                <div>留言加载中...</div>
              )}
              {listError && (
                <div>留言加载失败</div>
              )}
              {!loadingMessages && !listError && chatMessages.map((item) => (
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
              {!loadingMessages && !listError && chatMessages.length === 0 && (
                <div style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center', fontSize: '0.82rem' }}>
                  还没有留言，来发第一条吧。
                </div>
              )}
            </ChatFeed>
          </GuestbookStage>

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
