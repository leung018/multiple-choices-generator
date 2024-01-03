'use client'

import { useEffect, useState } from 'react'
import { Question } from '../../../model/question_set'
import {
  QuestionSetRepo,
  QuestionSetRepoFactory,
} from '../../../repo/question_set'

export class MultipleChoiceQuizUIService {
  static create({ questionSetId }: { questionSetId: string }) {
    return new MultipleChoiceQuizUIService({
      questionSetRepo: QuestionSetRepoFactory.createLocalStorageInstance(),
      questionSetId,
    })
  }

  static createTestInstance({
    questionSetRepo,
    questionSetId,
  }: {
    questionSetRepo: QuestionSetRepo
    questionSetId: string
  }) {
    return new MultipleChoiceQuizUIService({ questionSetRepo, questionSetId })
  }

  private readonly questionSetRepo: QuestionSetRepo
  private readonly questionSetId: string

  private constructor({
    questionSetRepo,
    questionSetId,
  }: {
    questionSetRepo: QuestionSetRepo
    questionSetId: string
  }) {
    this.questionSetRepo = questionSetRepo
    this.questionSetId = questionSetId
  }

  getElement() {
    return (
      <MultipleChoiceQuiz
        getQuestions={() =>
          this.questionSetRepo.getQuestionSetById(this.questionSetId).questions
        }
      ></MultipleChoiceQuiz>
    )
  }
}

// TODO: Noted that won't test the rendering of submit button by now. Test that part later in the feature of submitting the answer is more meaningful.
export default function MultipleChoiceQuiz({
  getQuestions,
}: {
  getQuestions: () => readonly Question[]
}) {
  const [isLoading, setLoading] = useState(true)

  const [questions, setQuestions] = useState<readonly Question[]>([])
  useEffect(() => {
    setQuestions(getQuestions())
    setLoading(false)
  }, [getQuestions])

  const [questionToCheckedChoiceMap, setCheckedChoice] = useState<
    Map<number, number>
  >(new Map<number, number>())

  const handleChoiceChange = (questionIndex: number, choiceIndex: number) => {
    const newMap = new Map<number, number>(questionToCheckedChoiceMap)
    newMap.set(questionIndex, choiceIndex)
    setCheckedChoice(newMap)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-4">
          <p className="font-bold whitespace-pre-line">
            {question.description}
          </p>
          <div className="ml-4">
            {question.mc.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} className="flex items-center mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  checked={
                    choiceIndex ===
                    questionToCheckedChoiceMap.get(questionIndex)
                  }
                  onChange={() =>
                    handleChoiceChange(questionIndex, choiceIndex)
                  }
                />
                {choice.answer}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Submit
      </button>
    </div>
  )
}
