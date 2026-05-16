import { motion } from 'framer-motion'
import { Hourglass } from 'lucide-react'
import ReaperIcon from './ReaperIcon.jsx'
import {
  backdropFade,
  backdropFadeTransition,
  fadeSlide,
  fadeSlideTransition,
} from '../lib/transitions.js'

/** Brief tension beat — no status copy, outcomes land on the listing shell. */
export function ResolutionBackdrop() {
  return (
    <motion.div
      aria-hidden
      variants={backdropFade}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={backdropFadeTransition}
      className="pointer-events-auto fixed inset-0 z-[100] bg-black/80 backdrop-blur-[2px]"
    />
  )
}

export function ResolutionCenter({ onAnimationComplete }) {
  return (
    <motion.div
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...fadeSlideTransition, duration: 0.35 }}
      className="fixed inset-0 z-[101] flex flex-col items-center justify-center px-8 text-center pointer-events-none"
      onAnimationComplete={onAnimationComplete}
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        <motion.div
          className="absolute"
          animate={{ opacity: [0.35, 0.85, 0.35], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Hourglass className="h-16 w-16 text-deadline-crimson/75" strokeWidth={1.2} />
        </motion.div>
        <motion.div
          className="relative text-deadline-bone"
          initial={{ opacity: 0, scale: 0.65 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <ReaperIcon size={88} />
        </motion.div>
      </div>
    </motion.div>
  )
}
