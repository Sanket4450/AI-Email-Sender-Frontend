import { Check } from 'lucide-react'
import { Fragment, memo } from 'react'
import { EMAIL_EVENTS } from '~/lib/constants'
import { cn, prepareEmailEvents } from '~/lib/utils'
import { EmailEvent } from '~/types/email'

interface EmailEventTrackerProps {
  id: string
  events: EmailEvent[]
}

export const EmailEventTracker = memo(
  ({ id, events }: EmailEventTrackerProps) => {
    const preparedSteps: Record<
      (typeof EMAIL_EVENTS)[keyof typeof EMAIL_EVENTS],
      boolean
    > = prepareEmailEvents(events)

    const steps = Object.entries(preparedSteps).map(([key, value]) => ({
      id: `email-${id}-${key}`,
      label: EMAIL_EVENTS[key as keyof typeof EMAIL_EVENTS]
        .charAt(0)
        .toUpperCase(),
      completed: value,
    }))

    return (
      <div className="flex justify-center items-center px-2">
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            {/* Circle Indicator */}
            <div
              className={cn(
                'relative size-7 flex justify-center items-center text-white rounded-full',
                step.completed ? 'bg-primary' : 'bg-gray'
              )}>
              {step.completed ? (
                <Check
                  size={16}
                  strokeWidth={3}
                />
              ) : (
                // Label
                <div className={`absolute text-sm font-semibold text-white`}>
                  {step.label}
                </div>
              )}
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-[3px] w-6 ${
                  step.completed && steps[index + 1].completed
                    ? 'bg-primary'
                    : 'bg-secondary'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    )
  }
)
