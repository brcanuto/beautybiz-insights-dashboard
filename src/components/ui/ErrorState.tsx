type ErrorStateProps = {
  title?: string
  message?: string | null
  onRetry?: () => void
}

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-red-950/40 border border-red-700/70 text-red-100 rounded-xl p-4 flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{title}</p>
        {message && (
          <p className="text-xs text-red-200 mt-1">
            {message}
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}