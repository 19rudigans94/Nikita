interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md w-full text-center">
        <p className="text-red-800 mb-2">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}