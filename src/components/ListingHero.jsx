import CountdownTimer from './CountdownTimer.jsx'
import { formatUsd } from '../lib/formatUsd.js'

export default function ListingHero({ deadline, listing }) {
  const {
    hotelName,
    starVisual,
    neighborhoodLabel,
    addressLine1,
    addressLine2,
    roomType,
    retailRateLabel,
    retailRateUsd,
    minimumBidUsd,
    checkIn,
    checkOut,
    amenities,
    heroImageUrl,
  } = listing

  return (
    <section className="space-y-4 pb-2">
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-deadline-surface shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[16/10] w-full">
          <img
            src={heroImageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/45" />
          <div className="absolute left-0 right-0 top-0 z-10 p-2 md:p-3">
            <CountdownTimer deadline={deadline} variant="compact" />
          </div>
        </div>
        <div className="space-y-3 px-4 pb-4 pt-3">
          <div>
            <h2 className="font-serif text-xl font-semibold tracking-tight text-deadline-bone md:text-2xl">
              {hotelName}
            </h2>
            <p className="mt-1 text-sm text-deadline-muted">
              {starVisual} · {neighborhoodLabel}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-deadline-muted/95">
              {addressLine1}
              <br />
              {addressLine2}
            </p>
            <p className="mt-2 text-xs text-deadline-bone/90">{roomType}</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/35 px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-deadline-muted">
              {retailRateLabel}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-deadline-bone md:text-xl">
              {formatUsd(retailRateUsd)}{' '}
              <span className="font-sans text-xs font-normal text-deadline-muted">
                total · reference only
              </span>
            </p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t border-white/[0.06] pt-2">
              <span className="text-xs text-deadline-muted">Minimum bid (demo)</span>
              <span className="font-mono text-sm font-semibold text-deadline-gold">
                {formatUsd(minimumBidUsd)}
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-deadline-muted">
              Retail helps you judge risk; we still never show other people&apos;s bids or ranges.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/[0.08] bg-black/30 px-3 py-1 text-xs font-medium text-deadline-bone/90"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-white/[0.06] pt-3 font-mono text-xs text-deadline-muted md:text-sm">
            <span>
              Check-in <span className="text-deadline-bone">{checkIn}</span>
            </span>
            <span aria-hidden className="text-deadline-muted/40">
              →
            </span>
            <span>
              Check-out <span className="text-deadline-bone">{checkOut}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
