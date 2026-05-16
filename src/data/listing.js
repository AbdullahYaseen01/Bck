/**
 * Listing facts for UI. Never imply a specific room category beyond inventoryPromiseLabel.
 */
export const LISTING = {
  hotelName: 'The Obsidian Grand',
  neighborhoodLabel: 'South Beach, Miami',
  starVisual: '★★★★★',
  addressLine1: '1200 Ocean Drive',
  addressLine2: 'Miami Beach, FL 33139',
  /** Promise tier only — no deluxe/king/etc. */
  inventoryPromiseLabel: 'Hotel room · category assigned at check-in',
  retailRateLabel: 'Published rate · this stay',
  retailRateUsd: 1849,
  checkIn: 'Jun 12, 2026',
  checkOut: 'Jun 15, 2026',
  amenities: ['WiFi', 'Pool', 'Spa', 'Breakfast'],
  heroImageUrl:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=960&q=80&auto=format&fit=crop',

  /** Backend-only prototype gate — never displayed as a number or hint. */
  hotelAcceptThresholdUsd: 680,
}
