export default function ReaperIcon({ className = '', size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M24 4c-2.2 0-4 1.8-4 4v2.2c-4.8 1-8.5 4.8-9.4 9.7-.3 1.5-.5 3-.5 4.6 0 6.8 4 12.6 9.8 15.4v4.1h8v-4.1c5.8-2.8 9.8-8.6 9.8-15.4 0-1.6-.2-3.1-.5-4.6-.9-4.9-4.6-8.7-9.4-9.7V8c0-2.2-1.8-4-4-4z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M18 22h12M21 19h6"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M12 36c2.5 2 5.5 3 12 3s9.5-1 12-3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}
