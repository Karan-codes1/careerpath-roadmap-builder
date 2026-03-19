import { Button } from "@/components/ui/button"

export default function Question({
  question,
  questionNumber,
  selectedOption,
  onAnswerSelect,
  showCorrectAnswer,
  userAnswer,
  explanation,
}) {
  const optionLabels = ["a", "b", "c", "d"]

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <p className="font-semibold mb-2">
        {questionNumber}. {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex
          const isSelected = selectedOption === i

          return (
            <Button
              key={i}
              variant="outline"
              className={`justify-start text-left w-full ${
                showCorrectAnswer
                  ? isCorrect
                    ? "bg-green-100 border-green-500"
                    : isSelected
                    ? "bg-red-100 border-red-500"
                    : ""
                  : isSelected
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
              onClick={() => onAnswerSelect(i)}
            >
              <span className="font-semibold mr-2">{optionLabels[i]}.</span>
              {option}
            </Button>
          )
        })}
      </div>

      {showCorrectAnswer && (
        <p className="mt-2 text-sm text-gray-600">
          ✅ Correct Answer: {question.options[question.correctIndex]}
        </p>
      )}
    </div>
  )
}
