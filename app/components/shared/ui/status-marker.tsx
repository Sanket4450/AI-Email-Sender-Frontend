import { Check, X } from 'lucide-react'

interface StatusMarkerProps {
  status: boolean
  size?: number
}

export const StatusMarker = ({ status, size = 16 }: StatusMarkerProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      {status ? <Check size={size} /> : <X size={size} />}
    </div>
  )
}
