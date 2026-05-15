import { motion } from 'framer-motion'
import { fadeSlide, fadeSlideTransition } from '../lib/transitions.js'
import { formatUsd } from '../lib/formatUsd.js'

export default function SealedConfirmation({
  auctionDeadline,
  bidAmount,
  listing,
  onBackToListings,
  isTransitioning,
  onEnterAnimationComplete,
}) {
  const reveal = new Date(auctionDeadline)
  const revealLabel = reveal.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const clearing = listing.demoClearingBidUsd
  const demoAhead = bidAmount >= clearing

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
      <h1 className="mt-2 text-center font-serif text-3xl font-semibold leading-tight tracking-tight text-deadline-bone sm:text-4xl">
        Bid received — you&apos;re done on your side.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-deadline-muted md:text-base">
        Nothing left to undo here—the withdraw window already closed before we recorded this. Results align with the
        auction deadline below; no hotel ping-pong or operator back-and-forth.
      </p>

      <div
        className={`mt-8 rounded-2xl border px-4 py-4 text-center text-sm leading-relaxed ${
          demoAhead
            ? 'border-emerald-500/35 bg-emerald-500/[0.07] text-emerald-100/95'
            : 'border-white/[0.08] bg-black/25 text-deadline-muted'
        }`}
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-deadline-muted">
          Demo emotion check
        </p>
        <p className="mt-2 font-medium text-deadline-bone">
          {demoAhead ? (
            <>
              Your bid is above this prototype&apos;s simulated clearing line ({formatUsd(clearing)}). In production,
              that reads like real contention—not a dollar stunt through the funnel.
            </>
          ) : (
            <>
              Your bid is below this prototype&apos;s simulated clearing line ({formatUsd(clearing)}). You&apos;d likely
              feel an honest loss—use it to tune floors and storytelling.
            </>
          )}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-deadline-surface px-4 py-5 font-mono text-sm text-deadline-muted shadow-[0_24px_80px_-56px_rgba(0,0,0,0.85)]">
        <div className="border-b border-dashed border-white/[0.08] pb-4">
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-deadline-muted/90">
            Receipt
          </p>
          <p className="mt-2 font-sans text-base font-semibold text-deadline-bone">{listing.hotelName}</p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-deadline-muted">
            {listing.addressLine1}, {listing.addressLine2}
          </p>
        </div>
        <dl className="mt-4 space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">Stay</dt>
            <dd className="text-right text-deadline-bone">
              {listing.checkIn} → {listing.checkOut}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">
              Published rate (anchor)
            </dt>
            <dd className="text-deadline-bone">{formatUsd(listing.retailRateUsd)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">Your bid</dt>
            <dd className="text-deadline-crimson">{formatUsd(bidAmount)}</dd>
          </div>
          <div className="border-t border-white/[0.06] pt-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <dt className="font-sans text-xs uppercase tracking-wide text-deadline-muted">
                Auction resolves after
              </dt>
              <dd className="text-deadline-bone sm:text-right">{revealLabel}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-deadline-gold/35 bg-deadline-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-deadline-gold">
          <span aria-hidden>✓</span>
          Binding bid on file
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
