import { motion } from 'framer-motion'
import ReaperIcon from './ReaperIcon.jsx'
import { formatUsd } from '../lib/formatUsd.js'

export default function BidInput({
  value,
  onChange,
  onSubmit,
  disabledSubmit,
  interactionLocked = false,
  listing,
}) {
  const {
    hotelName,
    addressLine1,
    addressLine2,
    minimumBidUsd,
    retailRateUsd,
    checkIn,
    checkOut,
  } = listing

  const numericTry = Number.parseFloat(String(value).trim().replace(/,/g, ''))
  const showMinError =
    String(value).trim() !== '' &&
    Number.isFinite(numericTry) &&
    numericTry > 0 &&
    numericTry < minimumBidUsd

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-deadline-surface p-4 shadow-[0_32px_120px_-64px_rgba(185,28,28,0.22)] md:p-5">
      <div className="pointer-events-none absolute -right-6 -top-6 opacity-[0.07]">
        <ReaperIcon size={140} className="text-deadline-bone" />
      </div>

      <div className="relative space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-deadline-muted">
            Your decision
          </p>
          <h2 className="mt-1 font-serif text-lg font-semibold text-deadline-bone md:text-xl">
            Bid on {hotelName}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-deadline-muted">
            {addressLine1}, {addressLine2}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-deadline-muted">
            Everything above stays visible while you decide—deadline on the photo, published-rate anchor{' '}
            <span className="font-mono text-deadline-bone/95">{formatUsd(retailRateUsd)}</span> for these dates (
            {checkIn}–{checkOut}), and floor{' '}
            <span className="font-mono text-deadline-bone/95">{formatUsd(minimumBidUsd)}</span>. Next step is review
            only: short withdraw countdown before anything binds.
          </p>
        </div>

        <div>
          <label
            htmlFor="bid-amount"
            className="font-serif text-base font-semibold text-deadline-bone"
          >
            Your bid (USD)
          </label>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-medium text-deadline-muted">
            $
          </span>
          <input
            id="bid-amount"
            name="bid"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={String(minimumBidUsd)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={showMinError}
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-4 pl-9 pr-4 font-mono text-2xl font-semibold tracking-tight text-deadline-bone outline-none ring-deadline-crimson/40 placeholder:text-deadline-muted/35 focus:border-deadline-crimson/55 focus:ring-2 aria-invalid:border-deadline-crimson/45"
          />
        </div>

        {showMinError ? (
          <p className="text-xs font-medium leading-snug text-deadline-crimson">
            Enter at least {formatUsd(minimumBidUsd)} — lower bids aren&apos;t accepted.
          </p>
        ) : null}

        <motion.button
          type="button"
          disabled={disabledSubmit || interactionLocked}
          onClick={() => {
            if (interactionLocked || disabledSubmit) return
            onSubmit()
          }}
          whileTap={
            disabledSubmit || interactionLocked ? undefined : { scale: 0.97 }
          }
          className="relative min-h-[44px] w-full rounded-xl bg-deadline-crimson px-4 py-3.5 font-sans text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-16px_rgba(185,28,28,0.85)] outline-none transition-[box-shadow,filter] hover:shadow-[0_0_28px_rgba(185,28,28,0.55),0_16px_48px_-20px_rgba(185,28,28,0.65)] focus-visible:ring-2 focus-visible:ring-deadline-crimson/70 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none md:text-[15px]"
        >
          Review binding bid
        </motion.button>
        <p className="text-center text-[11px] leading-snug text-deadline-muted">
          Opens a recap sheet with both timers—the auction clock plus a short window to leave free.
        </p>

        <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4">
          <ReaperIcon className="shrink-0 text-deadline-muted/70" size={36} />
          <p className="text-xs leading-snug text-deadline-muted">
            Guess the Price. Win the Room.
          </p>
        </div>
      </div>
    </section>
  )
}
