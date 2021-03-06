import * as React from 'react'

import Link from 'next/link'
import Markdown from 'react-markdown'
import useCio from 'hooks/use-cio'
import {sortingHatReducer} from './sorting-hat-reducer'
import {SurveyQuestion} from 'data/sorting-hat'
import Card from 'components/pages/home/card'

const QuestionHeading: React.FunctionComponent<{question: SurveyQuestion}> = ({
  question,
}) => {
  return (
    <>
      <h2 className="text-xl mb-3 font-bold dark:text-gray-100 text-gray-700">
        <Markdown>{question.heading}</Markdown>
      </h2>
      <h3 className="text-lg mb-4">
        <Markdown>{question.subheading}</Markdown>
      </h3>
    </>
  )
}

const question = {
  version: '1.0.0',
  career_chat: {
    heading: `Taking the next step in your career?`,
    subheading: `We would like to chat 1:1 and see how we can help.`,
    type: `cta-link`,
    url: `/level-up`,
    button_label: `Team up with egghead!`,
    final: true,
  },
}

const LevelUpCTA: React.FunctionComponent<{
  className?: any
  alternative?: JSX.Element
}> = ({className, alternative}) => {
  const [state, dispatch] = React.useReducer(sortingHatReducer, {
    currentQuestionKey: 'career_chat',
    answers: {},
    closed: true,
    data: question,
    surveyTitle: 'career chat survey',
  })
  const {subscriber, loadingSubscriber} = useCio()

  React.useEffect(() => {
    dispatch({type: `load`, subscriber, loadingSubscriber})
  }, [subscriber, loadingSubscriber])

  const onAnswer = (answer?: string) => {
    dispatch({type: 'answered', answer})
  }

  className = className || `border p-6 mb-16`

  return !state.question || state.closed ? (
    alternative || null
  ) : (
    <Card>
      <div className={className}>
        {state.question.type === 'cta-link' && (
          <div>
            <QuestionHeading question={state.question} />
            <Link href={state.question.url}>
              <a
                onClick={() => {
                  onAnswer('maybe')
                }}
                className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
              >
                {state.question.button_label}
              </a>
            </Link>
          </div>
        )}

        <div className="w-100 flex items-center justify-end mt-2">
          <button
            className="rounded text-xs px-2 py-1 flex justify-center items-center dark:text-gray-900 dark:bg-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
            onClick={() => {
              dispatch({type: 'dismiss'})
            }}
          >
            close
          </button>
        </div>
      </div>
    </Card>
  )
}

export default LevelUpCTA
