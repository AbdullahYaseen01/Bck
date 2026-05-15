import { motion } from 'framer-motion'
import CountdownTimer from './CountdownTimer.jsx'
import { fadeSlide, fadeSlideTransition } from '../lib/transitions.js'

function formatUsd(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function SealedConfirmation({
  deadline,
  bidAmount,
  holdAmount,
  hotelName,
  checkIn,
  checkOut,
  onBackToListings,
  isTransitioning,
  onEnterAnimationComplete,
}) {
  const reveal = new Date(deadline)
  const revealLabel = reveal.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const busy = isTransitioning

  return (
    <motion.section
      className="mx-auto max-w-lg pb-28 pt-4 md:max-w-xl md:pb-12 md:pt-8"
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={fadeSlideTransition}
      onAnimationComplete={onEnterAnimationComplete}
    >
      <div className="mt-1">
        <CountdownTimer deadline={deadline} variant="hero" label="Deadline strikes in" />
      </div>

      <h1 className="mt-8 text-center font-serif text-3xl font-semibold leading-tight tracking-tight text-deadline-bone sm:text-4xl">
        Your bid is sealed.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-deadline-muted md:text-base">
        Results revealed when the deadline strikes.
      </p>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-deadline-surface px-4 py-5 font-mono text-sm text-deadline-muted shadow-[0_24px_80px_-56px_rgba(0,0,0,0.85)]">
        <div className="border-b border-dashed border-white/[0.08] pb-4">
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-deadline-muted/90">
            Receipt
          </p>
          <p className="mt-2 font-sans text-base font-semibold text-deadline-bone">{hotelName}</p>
        </div>
        <dl className="mt-4 space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">Stay</dt>
            <dd className="text-right text-deadline-bone">
              {checkIn} → {checkOut}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">Your bid</dt>
            <dd className="text-deadline-bone">{formatUsd(bidAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">Hold</dt>
            <dd className="text-deadline-bone">{formatUsd(holdAmount)}</dd>
          </div>
          <div className="border-t border-white/[0.06] pt-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">
                Result reveals at
              </dt>
              <dd className="text-deadline-bone sm:text-right">{revealLabel}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-deadline-gold/35 bg-deadline-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-deadline-gold">
          <span aria-hidden>🔒</span>
          Bid Locked
        </span>
        <motion.button
          type="button"
          onClick={() => {
            if (busy) return
            onBackToListings()
          }}
          disabled={busy}
          whileTap={busy ? undefined : { scale: 0.97 }}
          className="min-h-[44px] rounded-xl border border-white/[0.14] bg-transparent px-6 py-3.5 text-sm font-semibold text-deadline-bone outline-none ring-deadline-crimson/25 hover:bg-white/[0.05] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60"
        >
          Back to Listings
        </motion.button>
      </div>
    </motion.section>
  )
}
