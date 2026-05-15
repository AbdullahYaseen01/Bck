/**
 * Single source of listing facts shown before a user commits.
 * Retail total is a decision anchor only — not a suggested bid.
 */
export const LISTING = {
  hotelName: 'The Obsidian Grand',
  neighborhoodLabel: 'South Beach, Miami',
  starVisual: '★★★★★',
  addressLine1: '1200 Ocean Drive',
  addressLine2: 'Miami Beach, FL 33139',
  roomType: 'Deluxe Ocean King · non-smoking',
  retailRateLabel: 'Published rate · this stay',
  /** Typical published total for these dates — anchor only */
  retailRateUsd: 1849,
  /** Bids below this are rejected (prototype). */
  minimumBidUsd: 420,
  /**
   * Prototype-only “clearing line” so the sealed screen can show win/loss-flavored
   * feedback without a backend (try a bid below vs above this).
   */
  demoClearingBidUsd: 680,
  checkIn: 'Jun 12, 2026',
  checkOut: 'Jun 15, 2026',
  amenities: ['WiFi', 'Pool', 'Spa', 'Breakfast'],
  heroImageUrl:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=960&q=80&auto=format&fit=crop',
}
