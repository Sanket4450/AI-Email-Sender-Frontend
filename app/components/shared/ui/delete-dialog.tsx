import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { LABELS } from '~/lib/form'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  title: string
  warningMsg: string
  onDelete: () => void
}

export const DeleteDialog = ({
  open,
  onClose,
  title,
  warningMsg,
  onDelete,
}: DeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}>
      {/* Dialog Content */}
      <DialogContent className="w-[90%] max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{warningMsg}</DialogDescription>
        </DialogHeader>

        {/* Footer with Action Buttons */}
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}>
            {LABELS.CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete() // Call the delete handler
            }}>
            {LABELS.DELETE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
