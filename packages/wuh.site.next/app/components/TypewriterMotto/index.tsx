'use client'
import { useEffect, useRef, useState } from 'react'
import * as S from './styles'

const PHRASES = [
  '写作是抵抗遗忘的方式，代码是构建世界的语言。',
  '不要停步不前，每一天都要做出改变。',
]

const TYPING_MS = 100
const DELETING_MS = 50
const PAUSE_MS = 3500
const SWITCH_MS = 1000

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  distance: number
}

let pid = 0

export default function TypewriterMotto() {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'switching'>('typing')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [glowX, setGlowX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  // Typing state machine
  useEffect(() => {
    const target = PHRASES[phraseIdx]

    if (phase === 'typing') {
      if (text === target) {
        setPhase('pausing')
        return
      }
      const delay = TYPING_MS + Math.random() * 40
      const timer = setTimeout(() => setText(target.slice(0, text.length + 1)), delay)
      return () => clearTimeout(timer)
    }

    if (phase === 'pausing') {
      const timer = setTimeout(() => setPhase('deleting'), PAUSE_MS)
      return () => clearTimeout(timer)
    }

    if (phase === 'deleting') {
      if (text === '') {
        setPhase('switching')
        return
      }
      const timer = setTimeout(() => setText(text.slice(0, -1)), DELETING_MS)
      return () => clearTimeout(timer)
    }

    if (phase === 'switching') {
      const timer = setTimeout(() => {
        setPhraseIdx((i) => (i + 1) % PHRASES.length)
        setPhase('typing')
      }, SWITCH_MS)
      return () => clearTimeout(timer)
    }
  }, [text, phase, phraseIdx])

  // Measure cursor position for glow
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return
    const cr = containerRef.current.getBoundingClientRect()
    const tr = textRef.current.getBoundingClientRect()
    setGlowX(tr.right - cr.left)
  }, [text])

  // Spawn particles on each typed character
  useEffect(() => {
    if (phase !== 'typing' || text.length === 0) return
    if (!containerRef.current || !textRef.current) return
    const cr = containerRef.current.getBoundingClientRect()
    const tr = textRef.current.getBoundingClientRect()
    const x = tr.right - cr.left
    const y = cr.height / 2
    const count = 2 + Math.floor(Math.random() * 2)
    const batch = Array.from<Particle>({ length: count }, () => ({
      id: ++pid,
      x,
      y,
      angle: Math.random() * 180 - 90,
      distance: 8 + Math.random() * 22,
    }))
    setParticles((prev) => [...prev, ...batch].slice(-30))
    const ids = batch.map((p) => p.id)
    setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.includes(p.id))), 700)
  }, [text.length, phase])

  const blink = phase === 'pausing' || phase === 'switching'
  const showGlow = text.length > 0 && phase !== 'switching'

  return (
    <>
      <S.Container ref={containerRef} aria-label={PHRASES[phraseIdx]}>
        <S.TextWrap ref={textRef}>{text}</S.TextWrap>
        <S.Cursor $blink={blink} />
        {showGlow && <S.Glow style={{ left: glowX }} />}
        {particles.map((p) => (
          <S.ParticleDot
            key={p.id}
            style={
              {
                left: p.x,
                top: p.y,
                '--a': `${p.angle}deg`,
                '--d': `${p.distance}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </S.Container>
    </>
  )
}
