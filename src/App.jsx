import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import BidInput from './components/BidInput.jsx'
import ListingHero from './components/ListingHero.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'
import BidOutcomePanel from './components/BidOutcomePanel.jsx'
import { ResolutionBackdrop, ResolutionCenter } from './components/ResolutionBeat.jsx'
import { LISTING } from './data/listing.js'
import { fadeSlide, fadeSlideTransition } from './lib/transitions.js'

const COMMIT_GRACE_MS = 10_000
const VERDICT_BEAT_MS = 950

const TRANSITION_FALLBACK_MS = 380

function parseBid(raw) {
  const cleaned = String(raw).trim().replace(/,/g, '')
  if (!cleaned) return NaN
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) && n > 0 ? n : NaN
}

export default function App() {
  const [step, setStep] = useState('enter')
  const [bidRaw, setBidRaw] = useState('')
  const [confirmGraceDeadlineMs, setConfirmGraceDeadlineMs] = useState(null)
  const [outcomeAccepted, setOutcomeAccepted] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const bidSentRef = useRef(false)
  const confirmSentRef = useRef(false)
  const transitioningRef = useRef(false)
  const transitionTimerRef = useRef(null)
  const prevStepRef = useRef(step)

  const bidValue = useMemo(() => parseBid(bidRaw), [bidRaw])
  const bidValid = Number.isFinite(bidValue)

  const savingsUsd = useMemo(
    () => Math.max(0, LISTING.retailRateUsd - bidValue),
    [bidValue],
  )

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

  const resetSubmissionRefs = useCallback(() => {
    bidSentRef.current = false
    confirmSentRef.current = false
  }, [])

  useEffect(() => {
    const prev = prevStepRef.current
    if (step === 'confirm' && prev !== 'confirm') {
      confirmSentRef.current = false
    }
    prevStepRef.current = step
  }, [step])

  useEffect(() => {
    if (step !== 'verdict') return undefined
    const t = window.setTimeout(() => {
      const accepted = bidValue >= LISTING.hotelAcceptThresholdUsd
      setOutcomeAccepted(accepted)
      setStep('result')
    }, VERDICT_BEAT_MS)
    return () => window.clearTimeout(t)
  }, [step, bidValue])

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
    resetSubmissionRefs()
    setConfirmGraceDeadlineMs(null)
    setOutcomeAccepted(null)
    beginTransition()
    setStep('enter')
    setBidRaw('')
  }, [beginTransition, resetSubmissionRefs])

  const openConfirm = useCallback(() => {
    if (transitioningRef.current || bidSentRef.current || !Number.isFinite(bidValue)) {
      return
    }
    bidSentRef.current = true
    setConfirmGraceDeadlineMs(Date.now() + COMMIT_GRACE_MS)
    setStep('confirm')
  }, [bidValue])

  const closeConfirm = useCallback(() => {
    if (transitioningRef.current) return
    resetSubmissionRefs()
    setConfirmGraceDeadlineMs(null)
    beginTransition()
    setStep('enter')
  }, [beginTransition, resetSubmissionRefs])

  const submitOffer = useCallback(() => {
    if (transitioningRef.current || confirmSentRef.current) return
    confirmSentRef.current = true
    setConfirmGraceDeadlineMs(null)
    beginTransition()
    setStep('verdict')
  }, [beginTransition])

  const tryAnotherOffer = useCallback(() => {
    if (transitioningRef.current) return
    resetSubmissionRefs()
    setOutcomeAccepted(null)
    beginTransition()
    setStep('enter')
  }, [beginTransition, resetSubmissionRefs])

  const showListingShell = step === 'enter' || step === 'confirm' || step === 'verdict' || step === 'result'
  const confirmModalOpen = step === 'confirm'

  const resetDisabled = isTransitioning || step === 'verdict'

  return (
    <div className="min-h-dvh overflow-x-hidden text-deadline-bone">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
        <AnimatePresence mode="wait">
          {showListingShell ? (
            <motion.div
              key="listing-flow"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={fadeSlideTransition}
              className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_min(340px,36vw)] lg:items-start lg:gap-10 lg:rounded-2xl lg:border lg:border-deadline-gold/15 lg:bg-deadline-gold/[0.02] lg:p-8 lg:ring-1 lg:ring-deadline-gold/10"
            >
              <ListingHero listing={LISTING} />
              <aside className="lg:sticky lg:top-24 lg:min-w-0 lg:self-start">
                {step === 'result' && outcomeAccepted !== null ? (
                  <BidOutcomePanel
                    listing={LISTING}
                    accepted={outcomeAccepted}
                    savingsUsd={savingsUsd}
                    isTransitioning={isTransitioning}
                    onTryAnother={tryAnotherOffer}
                    onDone={resetFlow}
                  />
                ) : (
                  <BidInput
                    value={bidRaw}
                    onChange={setBidRaw}
                    onSubmit={openConfirm}
                    disabledSubmit={!bidValid}
                    interactionLocked={
                      isTransitioning || step !== 'enter'
                    }
                    listing={LISTING}
                  />
                )}
              </aside>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <ConfirmModal
        open={confirmModalOpen}
        listing={LISTING}
        bidAmount={bidValue}
        graceDeadlineMs={confirmGraceDeadlineMs}
        onBack={closeConfirm}
        onConfirm={submitOffer}
        isTransitioning={isTransitioning}
        onSheetAnimationComplete={clearTransition}
      />

      <AnimatePresence mode="sync">
        {step === 'verdict' ? (
          <>
            <ResolutionBackdrop key="rez-bd" />
            <ResolutionCenter key="rez-cn" onAnimationComplete={clearTransition} />
          </>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        disabled={resetDisabled}
        onClick={() => {
          if (transitioningRef.current || step === 'verdict') return
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
