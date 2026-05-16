import { formatUsd } from '../lib/formatUsd.js'

export default function ListingHero({ listing }) {
  const {
    hotelName,
    starVisual,
    neighborhoodLabel,
    addressLine1,
    addressLine2,
    inventoryPromiseLabel,
    retailRateLabel,
    retailRateUsd,
    checkIn,
    checkOut,
    amenities,
    heroImageUrl,
  } = listing

  return (
    <section className="space-y-4 pb-2 lg:pb-8">
      <div className="overflow-hidden rounded-2xl border border-deadline-gold/35 bg-deadline-surface shadow-[0_24px_80px_-48px_rgba(212,165,116,0.14)] ring-1 ring-deadline-gold/15">
        <div className="relative aspect-[16/10] w-full lg:aspect-[16/9]">
          <img
            src={heroImageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/40" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-deadline-gold/10 to-transparent" />
          <div className="absolute left-0 right-0 top-0 z-10 flex justify-end p-2 md:p-3">
            <span className="rounded-full border border-deadline-gold/45 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-deadline-gold backdrop-blur-md">
              Instant result
            </span>
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
            <p className="mt-2 text-[11px] leading-snug text-deadline-gold/95">{inventoryPromiseLabel}</p>
          </div>

          <div className="rounded-xl border border-deadline-gold/25 bg-black/35 px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-deadline-muted">
              {retailRateLabel}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-deadline-bone md:text-xl">
              {formatUsd(retailRateUsd)}{' '}
              <span className="font-sans text-xs font-normal text-deadline-muted">reference</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <span
                key={a}
                className="rounded-full border border-deadline-gold/15 bg-black/25 px-3 py-1 text-xs font-medium text-deadline-bone/90"
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
