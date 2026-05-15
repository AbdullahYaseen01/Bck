/** Shared Framer Motion variants — layout transitions (fade + 15px slide). */

export const fadeSlideTransition = {
  duration: 0.3,
  ease: 'easeOut',
}

/** Enter: fade up from +15px; exit: fade up toward -15px */
export const fadeSlide = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export const backdropFadeTransition = {
  duration: 0.3,
  ease: 'easeOut',
}

export const backdropFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

/** Modal sheet on narrow viewports */
export const fadeSlideSheetTransition = {
  type: 'spring',
  damping: 28,
  stiffness: 320,
}

export const fadeSlideSheet = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
}
