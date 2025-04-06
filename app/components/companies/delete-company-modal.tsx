import { useModal } from '~/context/modal-context'
import { DeleteDialog } from '../shared/ui/delete-dialog'
import { INFO_MSG, WARNING_MSG } from '~/lib/messages'

interface DeleteCompanyModalProps {
  onDelete: (companyId: string) => void
}

export const DeleteCompanyModal = ({ onDelete }: DeleteCompanyModalProps) => {
  const { closeModal, isModalOpen, getModalData } = useModal()

  const isOpen = isModalOpen('delete-company')

  const companyData = getModalData('delete-company')

  const closeDeleteModal = () => {
    closeModal('delete-company')
  }

  return (
    <DeleteDialog
      open={isOpen}
      onClose={closeDeleteModal}
      title={INFO_MSG.DELETE_COMPANY}
      warningMsg={WARNING_MSG.DELETE_COMPANY_STARTING.replace(
        '{{companyName}}',
        (companyData?.title as string) || ''
      )}
      onDelete={() => onDelete(companyData?.id as string)}
    />
  )
}
