import { Badge } from '~/components/ui/badge'
import { EMAIL_EVENTS } from '~/lib/constants'
import { EmailEvent } from '~/types/email'

interface EmailEventTrackerProps {
  eventData: EmailEvent[]
}

export const EmailEventTracker = ({ eventData }: EmailEventTrackerProps) => {
  const steps = Object.values(EMAIL_EVENTS)

  // Determine the completed steps based on the event data
  const completedSteps = eventData.map((event) => event.eventType)

  // Find the index of the last completed step
  const currentStepIndex = Math.max(
    ...steps.map((step, index) => (completedSteps.includes(step) ? index : -1))
  )

  return (
    <div className="flex items-center justify-center space-x-6">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex
        const isActive = index === currentStepIndex

        return (
          <div
            key={step}
            className="flex flex-col items-center space-y-2">
            {/* Step Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                isCompleted
                  ? 'bg-green-500 border-green-500'
                  : isActive
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-gray-200 border-gray-300'
              }`}>
              {isCompleted && <span className="text-white text-xs">✓</span>}
              {!isCompleted && !isActive && (
                <span className="text-gray-500 text-xs">{index + 1}</span>
              )}
              {isActive && (
                <span className="text-white text-xs">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <Badge
              variant={
                isCompleted ? 'default' : isActive ? 'secondary' : 'outline'
              }
              className="text-xs">
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </Badge>
          </div>
        )
      })}
    </div>
  )
}
