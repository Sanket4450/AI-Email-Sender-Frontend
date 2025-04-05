import { Check, Minus, X } from 'lucide-react'

interface CompletionMarkerProps {
  completed: boolean
  size?: number
}

export const CompletionMarker = ({
  completed,
  size = 16,
}: CompletionMarkerProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      {completed ? <Check size={size} /> : <Minus size={size} />}
    </div>
  )
}
