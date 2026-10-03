export default function Question({
  question,
  questionNumber,
  selectedOption,
  onAnswerSelect,
  showCorrectAnswer,
  userAnswer,
  explanation,
}) {
  const optionLabels = ["a", "b", "c", "d", "e", "f"]

  return (
    <div>
      <p className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">
        {questionNumber}. {question.question}
      </p>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex
          const isSelected = selectedOption === i

          const rowStyle = showCorrectAnswer
            ? isCorrect
              ? "bg-green-100 dark:bg-green-900/40 border-green-500"
              : isSelected
              ? "bg-red-100 dark:bg-red-900/40 border-red-500"
              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            : isSelected
            ? "border-[#339999] bg-[#339999]/10"
            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#339999]/60 hover:bg-gray-50 dark:hover:bg-gray-800"

          const labelStyle =
            !showCorrectAnswer && isSelected
              ? "border-[#339999] bg-[#339999] text-white"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400"

          return (
            <button
              key={i}
              type="button"
              aria-pressed={isSelected}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm text-gray-800 dark:text-gray-200 transition-colors sm:px-4 sm:py-3 sm:text-base ${rowStyle}`}
              onClick={() => onAnswerSelect(i)}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold uppercase ${labelStyle}`}
              >
                {optionLabels[i] || i + 1}
              </span>
              <span className="min-w-0 flex-1 break-words">{option}</span>
            </button>
          )
        })}
      </div>

      {showCorrectAnswer && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          ✅ Correct Answer: {question.options[question.correctIndex]}
        </p>
      )}
    </div>
  )
}
