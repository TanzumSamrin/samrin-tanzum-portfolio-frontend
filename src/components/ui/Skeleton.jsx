function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-[var(--border)] rounded-md ${className}`}
      aria-hidden="true"
    />
  )
}

export default Skeleton