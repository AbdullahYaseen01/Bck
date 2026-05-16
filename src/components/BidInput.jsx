import { motion } from 'framer-motion'
import ReaperIcon from './ReaperIcon.jsx'
import { formatUsd } from '../lib/formatUsd.js'

const STEPS = ['Enter your price', 'Review for 10 seconds', 'Get instant result']

export default function BidInput({
  value,
  onChange,
  onSubmit,
  disabledSubmit,
  interactionLocked = false,
  listing,
}) {
  const { hotelName, retailRateUsd, checkIn, checkOut } = listing

  return (
    <section className="relative overflow-hidden rounded-2xl border border-deadline-gold/40 bg-deadline-surface p-4 shadow-[0_28px_90px_-56px_rgba(212,165,116,0.22)] lg:p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.09]">
        <ReaperIcon size={112} className="text-deadline-gold" />
      </div>

      <div className="relative space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-deadline-gold">Your stay</p>
          <h2 className="mt-1 font-serif text-lg font-semibold text-deadline-bone lg:text-xl">{hotelName}</h2>
          <p className="mt-1 text-xs text-deadline-muted">
            Published {formatUsd(retailRateUsd)} · {checkIn}–{checkOut}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-deadline-muted">How it works</p>
          <ol className="mt-2 space-y-1.5 text-[11px] leading-snug text-deadline-bone/90">
            {STEPS.map((label, i) => (
              <li key={label} className="flex gap-2">
                <span className="font-mono text-deadline-gold">{i + 1}.</span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-base font-medium text-deadline-muted">
            $
          </span>
          <input
            id="bid-amount"
            name="bid"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Your price"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-deadline-gold/25 bg-black/35 py-3.5 pl-8 pr-3 font-mono text-2xl font-semibold tracking-tight text-deadline-bone outline-none ring-deadline-gold/25 placeholder:text-deadline-muted/35 focus:border-deadline-gold/55 focus:ring-2"
          />
        </div>

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
          className="relative min-h-[44px] w-full rounded-xl border border-deadline-gold/50 bg-deadline-gold/15 px-4 py-3.5 font-sans text-sm font-semibold tracking-wide text-deadline-gold outline-none transition-[box-shadow,filter] hover:bg-deadline-gold/22 hover:shadow-[0_0_24px_rgba(212,165,116,0.25)] focus-visible:ring-2 focus-visible:ring-deadline-gold/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]"
        >
          Continue
        </motion.button>

        <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3">
          <ReaperIcon className="shrink-0 text-deadline-muted/70" size={28} />
          <p className="text-[10px] leading-snug text-deadline-muted">Any amount · instant yes or no</p>
        </div>
      </div>
    </section>
  )
}
