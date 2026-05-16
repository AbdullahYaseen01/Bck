import ReaperIcon from './ReaperIcon.jsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-deadline-gold/15 bg-deadline-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <span className="font-serif text-lg font-semibold tracking-[0.06em] text-deadline-gold md:text-xl">
          DEADLINE
        </span>
        <div className="flex items-center gap-2">
          <ReaperIcon className="text-deadline-muted" size={26} />
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-deadline-gold/20 bg-deadline-surface text-xs font-medium text-deadline-muted"
            aria-hidden
          >
            You
          </div>
        </div>
      </div>
    </header>
  )
}
