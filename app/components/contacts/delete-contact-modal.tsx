import { useModal } from '~/context/modal-context'
import { DeleteDialog } from '../shared/ui/delete-dialog'
import { INFO_MSG, WARNING_MSG } from '~/lib/messages'

interface DeleteContactModalProps {
  onDelete: (contactId: string) => void
}

export const DeleteContactModal = ({ onDelete }: DeleteContactModalProps) => {
  const { closeModal, isModalOpen, getModalData } = useModal()

  const isOpen = isModalOpen('delete-contact')

  const contactData = getModalData('delete-contact')

  const closeDeleteModal = () => {
    closeModal('delete-contact')
  }

  return (
    <DeleteDialog
      open={isOpen}
      onClose={closeDeleteModal}
      title={INFO_MSG.DELETE_COMPANY}
      warningMsg={WARNING_MSG.DELETE_COMPANY_STARTING.replace(
        '{{contactName}}',
        (contactData?.title as string) || ''
      )}
      onDelete={() => onDelete(contactData?.id as string)}
    />
  )
}
