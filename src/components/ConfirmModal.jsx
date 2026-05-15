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

/** Short window where backing out is clearly safe before “Place binding bid” enables. */
const COMMIT_GRACE_MS = 12_000

export default function ConfirmModal({
  open,
  listing,
  auctionDeadline,
  bidAmount,
  onBack,
  onConfirm,
  isTransitioning,
  onSheetAnimationComplete,
}) {
  const [isMdUp, setIsMdUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )
  const [graceDeadline, setGraceDeadline] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setIsMdUp(mq.matches)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!open) {
      setGraceDeadline(null)
      return
    }
    setGraceDeadline(Date.now() + COMMIT_GRACE_MS)
  }, [open])

  useEffect(() => {
    if (!open || graceDeadline == null) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [open, graceDeadline])

  const sheetVariants = useMemo(() => (isMdUp ? fadeSlide : fadeSlideSheet), [isMdUp])
  const sheetTransition = useMemo(
    () => (isMdUp ? fadeSlideTransition : fadeSlideSheetTransition),
    [isMdUp],
  )

  const bidLabel = formatUsd(bidAmount)
  const graceExpired = graceDeadline != null && now >= graceDeadline
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
              className="pointer-events-auto relative max-h-[min(92dvh,840px)] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/[0.08] bg-deadline-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_-32px_120px_-48px_rgba(0,0,0,0.95)] md:rounded-3xl md:border md:pb-6 md:shadow-[0_40px_120px_-56px_rgba(0,0,0,0.85)]"
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
                Confirm what you&apos;re buying
              </p>

              <div className="mt-5 space-y-3">
                <CountdownTimer deadline={auctionDeadline} variant="compact" />
                {graceDeadline != null ? (
                  <CountdownTimer
                    deadline={graceDeadline}
                    variant="compact"
                    label="Free to withdraw — locks in"
                    quietWhenExpired
                  />
                ) : null}
              </div>

              <p className="mt-3 text-center text-xs leading-relaxed text-deadline-muted">
                {graceExpired ? (
                  <>
                    Withdraw window ended.{' '}
                    <span className="text-deadline-bone/95">
                      From here on, placing your bid is binding—no negotiating with the hotel or us.
                    </span>
                  </>
                ) : (
                  <>
                    Go back anytime until the withdraw timer hits zero. After that, tap commit only if you accept this
                    price rule: winner pays their bid when the auction closes (if it clears our minimum).
                  </>
                )}
              </p>

              <p className="mt-6 text-center font-mono text-4xl font-semibold tabular-nums text-deadline-bone sm:text-5xl">
                {bidLabel}
              </p>
              <p className="mt-2 text-center text-xs text-deadline-muted">Your bid (winner pays this)</p>

              <div className="mt-6 space-y-3 rounded-xl border border-white/[0.06] bg-black/25 px-4 py-4 text-sm">
                <div className="border-b border-white/[0.06] pb-3">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-deadline-muted">
                    Listing
                  </p>
                  <p className="mt-2 font-sans font-semibold text-deadline-bone">{listing.hotelName}</p>
                  <p className="mt-1 text-xs leading-relaxed text-deadline-muted">
                    {listing.addressLine1}, {listing.addressLine2}
                  </p>
                  <p className="mt-1 text-xs text-deadline-muted">{listing.roomType}</p>
                  <p className="mt-2 font-mono text-xs text-deadline-bone">
                    {listing.checkIn} → {listing.checkOut}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-deadline-muted">{listing.retailRateLabel}</span>
                  <span className="text-right font-mono font-medium text-deadline-bone">
                    {formatUsd(listing.retailRateUsd)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-white/[0.06] pt-3">
                  <span className="text-deadline-muted">Floor bid (demo)</span>
                  <span className="font-mono font-medium text-deadline-bone">
                    {formatUsd(listing.minimumBidUsd)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-white/[0.06] pt-3">
                  <span className="text-deadline-muted">Your bid</span>
                  <span className="font-mono font-medium text-deadline-crimson">{bidLabel}</span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-deadline-muted">
                When the auction clock hits zero, it resolves in one shot—no inbox threads. If your bid wins and clears
                the floor, that&apos;s your checkout price for this stay. If not, your obligation ends.
              </p>

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
                  Go back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    if (busy || !graceExpired) return
                    onConfirm()
                  }}
                  disabled={busy || !graceExpired}
                  whileTap={busy || !graceExpired ? undefined : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                  className="min-h-[44px] w-full rounded-xl bg-deadline-crimson px-4 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_14px_44px_-18px_rgba(185,28,28,0.85)] outline-none ring-2 ring-transparent hover:shadow-[0_0_26px_rgba(185,28,28,0.45)] focus-visible:ring-deadline-crimson/70 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
                >
                  Place binding bid
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
