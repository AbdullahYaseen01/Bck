import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'
import {
  backdropFade,
  backdropFadeTransition,
  fadeSlide,
  fadeSlideSheet,
  fadeSlideSheetTransition,
  fadeSlideTransition,
} from '../lib/transitions.js'

function formatUsd(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function ConfirmModal({
  open,
  bidAmount,
  holdAmount,
  onBack,
  onConfirm,
  isTransitioning,
  onSheetAnimationComplete,
}) {
  const [isMdUp, setIsMdUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setIsMdUp(mq.matches)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const sheetVariants = useMemo(() => (isMdUp ? fadeSlide : fadeSlideSheet), [isMdUp])
  const sheetTransition = useMemo(
    () => (isMdUp ? fadeSlideTransition : fadeSlideSheetTransition),
    [isMdUp],
  )

  const bidLabel = formatUsd(bidAmount)
  const holdLabel = formatUsd(holdAmount)

  const busy = isTransitioning

  return (
    <AnimatePresence mode="sync">
      {open ? (
        <>
          <motion.button
            key="confirm-backdrop"
            type="button"
            aria-label="Close dialog"
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={backdropFadeTransition}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-[2px]"
            onClick={() => {
              if (busy) return
              onBack()
            }}
          />

          <div className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
            <motion.div
              key="confirm-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-bid-title"
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={sheetTransition}
              className="pointer-events-auto relative w-full max-w-lg rounded-t-3xl border border-white/[0.08] bg-deadline-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_-32px_120px_-48px_rgba(0,0,0,0.95)] md:rounded-3xl md:border md:pb-6 md:shadow-[0_40px_120px_-56px_rgba(0,0,0,0.85)]"
              onAnimationComplete={onSheetAnimationComplete}
            >
              <div
                className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15 md:hidden"
                aria-hidden
              />

              <p
                id="confirm-bid-title"
                className="font-serif text-center text-xs font-medium uppercase tracking-[0.2em] text-deadline-muted"
              >
                Confirm commitment
              </p>
              <p className="mt-3 text-center font-mono text-4xl font-semibold tabular-nums text-deadline-bone sm:text-5xl">
                {bidLabel}
              </p>

              <div className="mt-6 space-y-3 rounded-xl border border-white/[0.06] bg-black/25 px-4 py-4">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-deadline-muted">Your bid</span>
                  <span className="font-mono font-medium text-deadline-bone">{bidLabel}</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-deadline-muted">Authorization hold</span>
                  <span className="text-right">
                    <span className="font-mono font-medium text-deadline-bone">{holdLabel}</span>
                    <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-deadline-gold/90">
                      Not a charge
                    </span>
                  </span>
                </div>
                <div className="border-t border-white/[0.06] pt-3 text-sm leading-relaxed text-deadline-muted">
                  You are only charged if you win.
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-deadline-muted">
                We place a temporary hold on your card. If you don&apos;t win, the hold is released within 24 hours.
                If you win, the hold becomes the charge.
              </p>

              <details className="mt-3 rounded-lg border border-transparent hover:bg-white/[0.03] open:border-white/[0.06] open:bg-white/[0.03]">
                <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-deadline-bone/90 outline-none ring-deadline-crimson/30 focus-visible:ring-2 [&::-webkit-details-marker]:hidden">
                  <Info className="h-4 w-4 shrink-0 text-deadline-muted" aria-hidden />
                  <span>Authorization vs charge</span>
                </summary>
                <p className="px-1 pb-1 pt-2 text-xs leading-relaxed text-deadline-muted">
                  A hold reserves funds so your bid can settle instantly if you win. Nothing posts to your statement until the auction resolves.
                  If you lose, the bank releases the hold—timing varies by issuer, but we aim for within 24 hours.
                </p>
              </details>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (busy) return
                    onBack()
                  }}
                  disabled={busy}
                  whileTap={busy ? undefined : { scale: 0.97 }}
                  className="min-h-[44px] w-full rounded-xl border border-white/[0.12] bg-transparent px-4 py-3.5 text-sm font-semibold text-deadline-bone outline-none ring-deadline-crimson/25 hover:bg-white/[0.04] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[120px]"
                >
                  Go Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    if (busy) return
                    onConfirm()
                  }}
                  disabled={busy}
                  whileTap={busy ? undefined : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                  className="min-h-[44px] w-full rounded-xl bg-deadline-crimson px-4 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_14px_44px_-18px_rgba(185,28,28,0.85)] outline-none ring-2 ring-transparent hover:shadow-[0_0_26px_rgba(185,28,28,0.45)] focus-visible:ring-deadline-crimson/70 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
                >
                  Confirm & Place Hold
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
