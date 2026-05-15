import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import BidInput from './components/BidInput.jsx'
import ListingHero from './components/ListingHero.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'
import {
  ProcessingBackdrop,
  ProcessingContent,
} from './components/ProcessingOverlay.jsx'
import SealedConfirmation from './components/SealedConfirmation.jsx'
import { fadeSlide, fadeSlideTransition } from './lib/transitions.js'

const INITIAL_OFFSET_MS =
  (2 * 3600 + 47 * 60 + 13) * 1000

const TRANSITION_FALLBACK_MS = 380

function parseBid(raw) {
  const cleaned = String(raw).trim().replace(/,/g, '')
  if (!cleaned) return NaN
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) && n > 0 ? n : NaN
}

export default function App() {
  const [deadline, setDeadline] = useState(() => Date.now() + INITIAL_OFFSET_MS)
  const [step, setStep] = useState('enter')
  const [bidRaw, setBidRaw] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const bidSentRef = useRef(false)
  const confirmSentRef = useRef(false)
  const transitioningRef = useRef(false)
  const transitionTimerRef = useRef(null)
  const prevStepRef = useRef(step)

  const bidValue = useMemo(() => parseBid(bidRaw), [bidRaw])
  const holdAmount = bidValue

  const clearTransition = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }
    transitioningRef.current = false
    setIsTransitioning(false)
  }, [])

  const beginTransition = useCallback(() => {
    transitioningRef.current = true
    setIsTransitioning(true)
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
    }
    transitionTimerRef.current = window.setTimeout(() => {
      transitionTimerRef.current = null
      transitioningRef.current = false
      setIsTransitioning(false)
    }, TRANSITION_FALLBACK_MS)
  }, [])

  useEffect(() => {
    const prev = prevStepRef.current
    if (step === 'confirm' && prev !== 'confirm') {
      confirmSentRef.current = false
    }
    prevStepRef.current = step
  }, [step])

  useEffect(() => {
    if (step !== 'processing') return undefined
    const t = window.setTimeout(() => setStep('sealed'), 2000)
    return () => window.clearTimeout(t)
  }, [step])

  useEffect(
    () => () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
      }
    },
    [],
  )

  const resetFlow = useCallback(() => {
    if (transitioningRef.current) return
    bidSentRef.current = false
    confirmSentRef.current = false
    beginTransition()
    setStep('enter')
    setBidRaw('')
    setDeadline(Date.now() + INITIAL_OFFSET_MS)
  }, [beginTransition])

  const openConfirm = useCallback(() => {
    if (transitioningRef.current || bidSentRef.current || Number.isNaN(bidValue)) return
    bidSentRef.current = true
    setStep('confirm')
  }, [bidValue])

  const closeConfirm = useCallback(() => {
    if (transitioningRef.current) return
    bidSentRef.current = false
    confirmSentRef.current = false
    beginTransition()
    setStep('enter')
  }, [beginTransition])

  const startProcessing = useCallback(() => {
    if (transitioningRef.current || confirmSentRef.current) return
    confirmSentRef.current = true
    beginTransition()
    setStep('processing')
  }, [beginTransition])

  const showBidSection = step === 'enter' || step === 'confirm'
  const confirmModalOpen = step === 'confirm'

  const resetDisabled = isTransitioning || step === 'processing'

  return (
    <div className="min-h-dvh overflow-x-hidden text-deadline-bone">
      <Header />

      <main className="mx-auto max-w-lg px-4 pt-4 md:max-w-3xl md:px-6 md:pt-6">
        <AnimatePresence mode="wait">
          {step === 'sealed' ? (
            <SealedConfirmation
              key="sealed"
              deadline={deadline}
              bidAmount={bidValue}
              holdAmount={holdAmount}
              hotelName="The Obsidian Grand"
              checkIn="Jun 12, 2026"
              checkOut="Jun 15, 2026"
              isTransitioning={isTransitioning}
              onEnterAnimationComplete={clearTransition}
              onBackToListings={resetFlow}
            />
          ) : (
            <motion.div
              key="listing-flow"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={fadeSlideTransition}
            >
              <AnimatePresence mode="wait">
                {showBidSection ? (
                  <motion.div
                    key="bid-stack"
                    variants={fadeSlide}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={fadeSlideTransition}
                    className="flex flex-col"
                  >
                    <BidInput
                      value={bidRaw}
                      onChange={setBidRaw}
                      onSubmit={openConfirm}
                      disabledSubmit={Number.isNaN(bidValue)}
                      interactionLocked={isTransitioning || step !== 'enter'}
                    />
                    <ListingHero deadline={deadline} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ConfirmModal
        open={confirmModalOpen}
        bidAmount={bidValue}
        holdAmount={holdAmount}
        onBack={closeConfirm}
        onConfirm={startProcessing}
        isTransitioning={isTransitioning}
        onSheetAnimationComplete={clearTransition}
      />

      <AnimatePresence mode="sync">
        {step === 'processing' ? (
          <>
            <ProcessingBackdrop key="proc-bd" />
            <ProcessingContent key="proc-cn" onAnimationComplete={clearTransition} />
          </>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        disabled={resetDisabled}
        onClick={() => {
          if (transitioningRef.current || step === 'processing') return
          resetFlow()
        }}
        whileTap={resetDisabled ? undefined : { scale: 0.97 }}
        className="fixed bottom-4 left-4 z-[120] min-h-[44px] rounded-full border border-white/[0.12] bg-deadline-surface/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-deadline-muted shadow-lg backdrop-blur-sm hover:border-white/20 hover:text-deadline-bone disabled:pointer-events-none disabled:opacity-60"
      >
        Reset Flow
      </motion.button>
    </div>
  )
}
