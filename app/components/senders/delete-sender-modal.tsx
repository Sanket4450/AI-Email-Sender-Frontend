import { useModal } from '~/context/modal-context'
import { DeleteDialog } from '../shared/delete-dialog'
import { INFO_MSG, WARNING_MSG } from '~/lib/messages'

interface DeleteSenderModalProps {
  onDelete: (senderId: string) => void
}

export const DeleteSenderModal = ({ onDelete }: DeleteSenderModalProps) => {
  const { closeModal, isModalOpen, getModalData } = useModal()

  const isOpen = isModalOpen('delete-sender')

  const senderData = getModalData('delete-sender')

  const closeDeleteModal = () => {
    closeModal('delete-sender')
  }

  return (
    <DeleteDialog
      open={isOpen}
      onClose={closeDeleteModal}
      title={INFO_MSG.DELETE_COMPANY}
      warningMsg={WARNING_MSG.DELETE_COMPANY_STARTING.replace(
        '{{senderName}}',
        (senderData?.title as string) || ''
      )}
      onDelete={() => onDelete(senderData?.id as string)}
    />
  )
}
