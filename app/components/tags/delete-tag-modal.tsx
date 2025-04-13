import { useModal } from '~/context/modal-context'
import { DeleteDialog } from '../shared/ui/delete-dialog'
import { INFO_MSG, WARNING_MSG } from '~/lib/messages'

interface DeleteTagModalProps {
  onDelete: (tagId: string) => void
}

export const DeleteTagModal = ({ onDelete }: DeleteTagModalProps) => {
  const { closeModal, isModalOpen, getModalData } = useModal()

  const isOpen = isModalOpen('delete-tag')

  const tagData = getModalData('delete-tag')

  const closeDeleteModal = () => {
    closeModal('delete-tag')
  }

  return (
    <DeleteDialog
      open={isOpen}
      onClose={closeDeleteModal}
      title={INFO_MSG.DELETE_TAG}
      warningMsg={WARNING_MSG.DELETE_TAG_STARTING.replace(
        '{{tagName}}',
        (tagData?.title as string) || ''
      )}
      onDelete={() => onDelete(tagData?.id as string)}
    />
  )
}
