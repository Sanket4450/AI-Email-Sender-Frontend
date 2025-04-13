import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { LABELS } from '~/lib/form'

interface ModifyDialogProps {
  open: boolean
  onClose: () => void
  title: string
  body: React.ReactNode
  actionChild: React.ReactNode
}

export const ModifyDialog = ({
  open,
  onClose,
  title,
  body,
  actionChild,
}: ModifyDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}>
      {/* Dialog Content */}
      <DialogContent className="w-[90%] max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {body}
        </DialogHeader>

        {/* Footer with Action Buttons */}
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}>
            {LABELS.CANCEL}
          </Button>

          {actionChild}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
