import ReaperIcon from './ReaperIcon.jsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-deadline-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3 md:max-w-3xl">
        <span className="font-serif text-lg font-semibold tracking-[0.04em] text-deadline-bone md:text-xl">
          DEADLINE
        </span>
        <div className="flex items-center gap-2">
          <ReaperIcon className="text-deadline-muted" size={26} />
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-deadline-surface text-xs font-medium text-deadline-muted"
            aria-hidden
          >
            You
          </div>
        </div>
      </div>
    </header>
  )
}
