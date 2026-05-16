import { motion } from 'framer-motion'
import { formatUsd } from '../lib/formatUsd.js'

export default function BidOutcomePanel({
  listing,
  savingsUsd,
  accepted,
  isTransitioning,
  onTryAnother,
  onDone,
}) {
  const busy = isTransitioning

  if (accepted) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-deadline-gold/45 bg-gradient-to-b from-deadline-gold/[0.12] via-deadline-surface to-deadline-surface p-5 shadow-[0_24px_70px_-36px_rgba(212,165,116,0.35)] lg:p-6">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-deadline-gold/18 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <div className="relative space-y-5 text-center">
          <motion.h2
            className="font-serif text-4xl font-semibold tracking-tight text-deadline-bone sm:text-[2.75rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            ACCEPTED
          </motion.h2>
          <div className="space-y-3 text-base leading-snug text-deadline-bone/95">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.06 }}>
              You got the room.
            </motion.p>
            <motion.p
              className="text-deadline-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              We&apos;ll email your confirmation.
            </motion.p>
            <motion.p
              className="font-mono text-xl font-semibold tabular-nums text-deadline-gold sm:text-2xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, type: 'spring', stiffness: 280, damping: 22 }}
            >
              You saved {formatUsd(savingsUsd)}.
            </motion.p>
          </div>
          <motion.button
            type="button"
            disabled={busy}
            whileTap={busy ? undefined : { scale: 0.98 }}
            onClick={() => {
              if (busy) return
              onDone()
            }}
            className="mt-2 min-h-[44px] w-full rounded-xl border border-deadline-gold/45 bg-transparent px-4 py-3 text-sm font-semibold text-deadline-gold hover:bg-deadline-gold/10 disabled:pointer-events-none disabled:opacity-50"
          >
            Done
          </motion.button>
          <p className="text-[10px] text-deadline-muted">{listing.hotelName}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-deadline-crimson/45 bg-[#141416] p-5 shadow-[0_24px_70px_-36px_rgba(185,28,28,0.45)] lg:p-6">
      <div className="relative space-y-5 text-center">
        <motion.h2
          className="font-serif text-4xl font-semibold tracking-tight text-deadline-bone sm:text-[2.75rem]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          NOT ACCEPTED
        </motion.h2>
        <div className="space-y-3 text-sm leading-snug text-deadline-bone/90">
          <p>This bid didn&apos;t meet the hotel&apos;s threshold.</p>
          <p className="text-deadline-muted">Try a different amount or new dates.</p>
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <motion.button
            type="button"
            disabled={busy}
            whileTap={busy ? undefined : { scale: 0.98 }}
            onClick={() => {
              if (busy) return
              onTryAnother()
            }}
            className="min-h-[44px] rounded-xl bg-deadline-crimson px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_12px_36px_-16px_rgba(185,28,28,0.75)] hover:shadow-[0_0_22px_rgba(185,28,28,0.35)] disabled:pointer-events-none disabled:opacity-50"
          >
            Bid again
          </motion.button>
          <motion.button
            type="button"
            disabled={busy}
            whileTap={busy ? undefined : { scale: 0.98 }}
            onClick={() => {
              if (busy) return
              onDone()
            }}
            className="min-h-[44px] rounded-xl border border-white/[0.12] bg-transparent px-4 py-3 text-sm font-semibold text-deadline-bone hover:bg-white/[0.04] disabled:pointer-events-none disabled:opacity-50"
          >
            Leave
          </motion.button>
        </div>
      </div>
    </section>
  )
}
