import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CountdownTimer from './CountdownTimer.jsx'
import { formatUsd } from '../lib/formatUsd.js'
import {
  backdropFade,
  backdropFadeTransition,
  fadeSlide,
  fadeSlideSheet,
  fadeSlideSheetTransition,
  fadeSlideTransition,
} from '../lib/transitions.js'

export default function ConfirmModal({
  open,
  listing,
  bidAmount,
  graceDeadlineMs,
  onBack,
  onConfirm,
  isTransitioning,
  onSheetAnimationComplete,
}) {
  const [isMdUp, setIsMdUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setIsMdUp(mq.matches)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (graceDeadlineMs == null) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [graceDeadlineMs])

  const sheetVariants = useMemo(() => (isMdUp ? fadeSlide : fadeSlideSheet), [isMdUp])
  const sheetTransition = useMemo(
    () => (isMdUp ? fadeSlideTransition : fadeSlideSheetTransition),
    [isMdUp],
  )

  const bidLabel = formatUsd(bidAmount)
  const graceExpired = graceDeadlineMs != null && now >= graceDeadlineMs
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
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-[2px]"
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
              className="pointer-events-auto relative max-h-[min(88dvh,640px)] w-full max-w-md overflow-y-auto rounded-t-3xl border border-deadline-crimson/45 bg-[#141416] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-24px_80px_-24px_rgba(185,28,28,0.55)] md:rounded-2xl md:shadow-[0_40px_100px_-40px_rgba(185,28,28,0.45)]"
              onAnimationComplete={onSheetAnimationComplete}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-deadline-crimson/35 md:hidden" aria-hidden />

              <p
                id="confirm-bid-title"
                className="text-center font-serif text-[10px] font-medium uppercase tracking-[0.26em] text-deadline-crimson"
              >
                Final bid
              </p>

              <p className="mt-3 text-center font-mono text-3xl font-semibold tabular-nums text-deadline-bone sm:text-4xl">
                {bidLabel}
              </p>
              <p className="mt-1 text-center text-[11px] text-deadline-muted">{listing.hotelName}</p>

              <div className="mt-4 rounded-xl border border-deadline-crimson/40 bg-deadline-crimson/[0.12] px-3 py-3">
                <p className="text-center text-[11px] font-semibold leading-snug text-deadline-bone">
                  If accepted, your card is charged immediately after you confirm.
                </p>
              </div>

              {graceDeadlineMs != null ? (
                <div className="mt-4">
                  <CountdownTimer
                    deadline={graceDeadlineMs}
                    variant="compact"
                    label="Withdraw window"
                    quietWhenExpired
                  />
                </div>
              ) : null}

              <p className="mt-2 text-center text-[11px] text-deadline-muted">
                {graceExpired ? 'Ready to submit.' : 'Step away anytime until this hits zero.'}
              </p>

              <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/35 px-3 py-3 text-[11px]">
                <p className="font-medium text-deadline-bone">{listing.hotelName}</p>
                <p className="mt-1 text-deadline-muted">
                  {listing.addressLine1}, {listing.addressLine2}
                </p>
                <p className="mt-2 flex justify-between gap-2 border-t border-white/[0.06] pt-2 font-mono text-deadline-muted">
                  <span className="font-sans font-normal">Published reference</span>
                  <span className="text-deadline-bone">{formatUsd(listing.retailRateUsd)}</span>
                </p>
                <p className="mt-1 flex justify-between gap-2 font-mono text-deadline-crimson">
                  <span className="font-sans font-normal text-deadline-muted">Your price</span>
                  <span>{bidLabel}</span>
                </p>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (busy) return
                    onBack()
                  }}
                  disabled={busy}
                  whileTap={busy ? undefined : { scale: 0.97 }}
                  className="min-h-[44px] w-full rounded-xl border border-white/[0.12] bg-transparent px-4 py-3 text-sm font-semibold text-deadline-bone hover:bg-white/[0.04] disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    if (busy || !graceExpired) return
                    onConfirm()
                  }}
                  disabled={busy || !graceExpired}
                  whileTap={busy || !graceExpired ? undefined : { scale: 0.97 }}
                  className="min-h-[44px] w-full rounded-xl bg-deadline-crimson px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_14px_40px_-18px_rgba(185,28,28,0.85)] hover:shadow-[0_0_22px_rgba(185,28,28,0.45)] disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[160px]"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
