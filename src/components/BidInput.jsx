import { motion } from 'framer-motion'
import ReaperIcon from './ReaperIcon.jsx'

export default function BidInput({
  value,
  onChange,
  onSubmit,
  disabledSubmit,
  interactionLocked = false,
}) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-deadline-surface p-4 shadow-[0_32px_120px_-64px_rgba(185,28,28,0.22)] md:p-5">
      <div className="pointer-events-none absolute -right-6 -top-6 opacity-[0.07]">
        <ReaperIcon size={140} className="text-deadline-bone" />
      </div>

      <div className="relative space-y-4">
        <div>
          <label
            htmlFor="bid-amount"
            className="font-serif text-lg font-semibold text-deadline-bone md:text-xl"
          >
            Enter your bid
          </label>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-deadline-muted">
            Enter your blind bid. No hints. No guides. Just your number.
          </p>
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
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-4 pl-9 pr-4 font-mono text-2xl font-semibold tracking-tight text-deadline-bone outline-none ring-deadline-crimson/40 placeholder:text-deadline-muted/35 focus:border-deadline-crimson/55 focus:ring-2"
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
          className="relative min-h-[44px] w-full rounded-xl bg-deadline-crimson px-4 py-3.5 font-sans text-sm font-semibold tracking-wide text-white shadow-[0_12px_40px_-16px_rgba(185,28,28,0.85)] outline-none transition-[box-shadow,filter] hover:shadow-[0_0_28px_rgba(185,28,28,0.55),0_16px_48px_-20px_rgba(185,28,28,0.65)] focus-visible:ring-2 focus-visible:ring-deadline-crimson/70 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none md:text-[15px]"
        >
          Lock in Bid
        </motion.button>

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
