'use client'

import { useEffect, useState } from 'react'

type TypewriterProps = {
  phrases: string[]
  className?: string
  typeMs?: number
  eraseMs?: number
  holdMs?: number
}

/**
 * Types a phrase, holds it, erases it, moves to the next. Hand-rolled rather
 * than pulling react-type-animation back in — the whole effect is one timer.
 *
 * Accessibility: the animation is decorative. The full phrase list is exposed
 * once to screen readers, the animated text is hidden from them, and anyone
 * with prefers-reduced-motion just gets the first phrase, static.
 */
const Typewriter = ({
  phrases,
  className = '',
  typeMs = 55,
  eraseMs = 30,
  holdMs = 1800
}: TypewriterProps) => {
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [erasing, setErasing] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)

    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return

    const phrase = phrases[index % phrases.length]

    // Finished typing: hold, then start erasing.
    if (!erasing && length === phrase.length) {
      const timer = setTimeout(() => setErasing(true), holdMs)
      return () => clearTimeout(timer)
    }

    // Finished erasing: advance to the next phrase.
    if (erasing && length === 0) {
      setErasing(false)
      setIndex((current) => (current + 1) % phrases.length)
      return
    }

    const timer = setTimeout(
      () => setLength((current) => current + (erasing ? -1 : 1)),
      erasing ? eraseMs : typeMs
    )
    return () => clearTimeout(timer)
  }, [phrases, index, length, erasing, reducedMotion, typeMs, eraseMs, holdMs])

  const phrase = phrases[index % phrases.length] ?? ''
  const visible = reducedMotion ? phrase : phrase.slice(0, length)

  return (
    <span className={`grid ${className}`}>
      {/* The real content for assistive tech: every phrase, no animation. */}
      <span className="sr-only">{phrases.join('. ')}</span>

      {/*
        Ghosts. Every phrase is rendered invisibly, stacked into the same grid
        cell, so the box always reserves the height of the tallest phrase — even
        when a longer line wraps at a given width. The animated line can grow and
        shrink underneath without nudging the content below it (no layout shift).
      */}
      {phrases.map((ghost) => (
        <span key={ghost} aria-hidden className="invisible [grid-area:1/1]">
          {ghost}
          <span className="ms-0.5 inline-block w-[0.6ch] align-baseline">
            &nbsp;
          </span>
        </span>
      ))}

      <span aria-hidden className="[grid-area:1/1]">
        {visible}
        <span className="ms-0.5 inline-block w-[0.6ch] animate-caret bg-accent align-baseline">
          &nbsp;
        </span>
      </span>
    </span>
  )
}

export default Typewriter
