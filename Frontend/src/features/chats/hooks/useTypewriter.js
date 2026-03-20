import { useState, useEffect, useRef } from 'react'

export const useTypewriter = (text, speed = 18, enabled = true) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const indexRef = useRef(0)
  const prevTextRef = useRef('')

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      setIsDone(true)
      return
    }

    // If text changed (new message), reset
    if (text !== prevTextRef.current) {
      prevTextRef.current = text
      indexRef.current = 0
      setDisplayedText('')
      setIsDone(false)
    }

    if (indexRef.current >= text.length) {
      setIsDone(true)
      return
    }

    const timer = setTimeout(() => {
      indexRef.current += 1
      setDisplayedText(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) setIsDone(true)
    }, speed)

    return () => clearTimeout(timer)
  }, [text, displayedText, speed, enabled])

  return { displayedText, isDone }
}