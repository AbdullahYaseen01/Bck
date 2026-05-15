import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer({
  deadline,
  variant = 'compact',
  label = 'Bidding closes in',
}) {
  const [now, setNow] = useState(() => Date.now())
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now())
      setPulseKey((k) => k + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const { formatted, expired } = useMemo(() => {
    const ms = Math.max(0, deadline - now)
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return {
      formatted: `${pad(h)}:${pad(m)}:${pad(s)}`,
      expired: ms <= 0,
    }
  }, [deadline, now])

  const isHero = variant === 'hero'

  return (
    <div
      className={
        isHero
          ? 'w-full rounded-2xl border border-deadline-crimson/25 bg-deadline-surface/90 px-4 py-5 shadow-[0_0_0_1px_rgba(185,28,28,0.08)_inset]'
          : 'w-full rounded-lg border border-deadline-crimson/35 bg-deadline-bg/80 px-3 py-2 shadow-[0_8px_32px_-12px_rgba(185,28,28,0.45)] backdrop-blur-md'
      }
      role="timer"
      aria-live="polite"
      aria-label={`${label} ${formatted}`}
    >
      <div
        className={
          isHero
            ? 'flex flex-col items-stretch gap-3 text-center'
            : 'flex flex-row flex-nowrap items-center gap-2'
        }
      >
        <div
          className={
            isHero
              ? 'flex items-center justify-center gap-2 text-deadline-muted'
              : 'flex min-w-0 shrink items-center gap-2 text-deadline-muted'
          }
        >
          <motion.span
            key={pulseKey}
            className={
              isHero
                ? 'inline-flex h-2 w-2 shrink-0 rounded-full bg-deadline-crimson shadow-[0_0_12px_rgba(185,28,28,0.85)]'
                : 'inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-deadline-crimson shadow-[0_0_10px_rgba(185,28,28,0.9)]'
            }
            animate={{
              scale: [1, 1.35, 1],
              opacity: [1, 0.92, 1],
            }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
          />
          <span
            className={
              isHero
                ? 'font-sans text-sm font-medium tracking-wide'
                : 'min-w-0 truncate font-sans text-[11px] font-medium leading-tight tracking-wide sm:text-xs'
            }
          >
            {label}
          </span>
        </div>
        <span
          className={
            isHero
              ? 'font-mono text-4xl font-semibold tabular-nums tracking-tight text-deadline-crimson drop-shadow-[0_0_18px_rgba(185,28,28,0.35)] sm:text-5xl'
              : 'ml-auto shrink-0 font-mono text-base font-semibold tabular-nums tracking-tight text-deadline-crimson sm:text-lg'
          }
        >
          {expired ? '00:00:00' : formatted}
        </span>
      </div>
      {expired ? (
        <p className="mt-2 text-center font-sans text-[11px] leading-snug text-deadline-muted">
          Bidding closed — awaiting resolution.
        </p>
      ) : null}
    </div>
  )
}
