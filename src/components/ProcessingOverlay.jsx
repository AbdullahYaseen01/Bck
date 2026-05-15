import { motion } from 'framer-motion'
import ReaperIcon from './ReaperIcon.jsx'
import {
  backdropFade,
  backdropFadeTransition,
  fadeSlide,
  fadeSlideTransition,
} from '../lib/transitions.js'

export function ProcessingBackdrop() {
  return (
    <motion.div
      aria-hidden
      variants={backdropFade}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={backdropFadeTransition}
      className="fixed inset-0 z-[100] bg-deadline-bg"
    />
  )
}

export function ProcessingContent({ onAnimationComplete }) {
  return (
    <motion.div
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={fadeSlideTransition}
      className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-8 px-6 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        animate={{ scale: [1, 1.03, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="text-deadline-muted"
      >
        <ReaperIcon size={112} />
      </motion.div>

      <div>
        <p className="font-serif text-2xl font-semibold text-deadline-bone md:text-3xl">
          Sealing your bid...
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-deadline-crimson"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
