'use client'

import { notFound, useSearchParams } from 'next/navigation'
import { MultipleChoiceQuizUIService } from '../../components/mc/quiz'
import { QuestionSetGetError } from '../../../repo/question_set'

export default function MultipleChoiceQuizPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  if (!id) {
    notFound()
  }

  try {
    return MultipleChoiceQuizUIService.create({
      questionSetId: id,
    }).getElement()
  } catch (e) {
    if (
      e instanceof QuestionSetGetError &&
      e.cause.code === 'QUESTION_SET_NOT_FOUND'
    ) {
      notFound()
    }
    throw e
  }
}
