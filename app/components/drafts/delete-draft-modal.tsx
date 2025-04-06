import { useModal } from '~/context/modal-context'
import { DeleteDialog } from '../shared/ui/delete-dialog'
import { INFO_MSG, WARNING_MSG } from '~/lib/messages'

interface DeleteDraftModalProps {
  onDelete: (draftId: string) => void
}

export const DeleteDraftModal = ({ onDelete }: DeleteDraftModalProps) => {
  const { closeModal, isModalOpen, getModalData } = useModal()

  const isOpen = isModalOpen('delete-draft')

  const draftData = getModalData('delete-draft')

  const closeDeleteModal = () => {
    closeModal('delete-draft')
  }

  return (
    <DeleteDialog
      open={isOpen}
      onClose={closeDeleteModal}
      title={INFO_MSG.DELETE_DRAFT}
      warningMsg={WARNING_MSG.DELETE_DRAFT_STARTING.replace(
        '{{draftName}}',
        (draftData?.title as string) || ''
      )}
      onDelete={() => onDelete(draftData?.id as string)}
    />
  )
}
