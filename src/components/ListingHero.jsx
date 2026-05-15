import CountdownTimer from './CountdownTimer.jsx'

const HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=960&q=80&auto=format&fit=crop'

const AMENITIES = ['WiFi', 'Pool', 'Spa', 'Breakfast']

export default function ListingHero({
  deadline,
  checkIn = 'Jun 12, 2026',
  checkOut = 'Jun 15, 2026',
}) {
  return (
    <section className="mt-8 space-y-4 pb-6">
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-deadline-surface shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[16/10] w-full">
          <img
            src={HOTEL_IMAGE}
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
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl font-semibold tracking-tight text-deadline-bone md:text-2xl">
                The Obsidian Grand
              </h2>
              <p className="mt-1 text-sm text-deadline-muted">
                ★★★★★ · South Beach, Miami
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
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
