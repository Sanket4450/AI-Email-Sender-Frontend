import React, { createContext, useContext, useState } from 'react'

enum ModalType {
  deleteCompany = 'delete-company',
  deleteContact = 'delete-contact',
  deleteDraft = 'delete-draft',
  deleteScheduledEmail = 'delete-scheduled-email',
}

interface ModalState {
  type: ModalType // Type of modal (e.g., "edit-company", "delete-contact")
  data: Record<string, unknown> // Data associated with the modal
}

interface ModalContextType {
  modals: ModalState[]
  openModal: (type: ModalType, data: Record<string, unknown>) => void
  closeModal: (type: ModalType) => void
  isModalOpen: (type: ModalType) => boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<ModalState[]>([])

  // Open a new modal
  const openModal = (type: ModalType, data: Record<string, unknown>) => {
    setModals([...modals, { type, data }])
  }

  // Close a specific modal by ID
  const closeModal = (type: ModalType) => {
    setModals(modals.filter((modal) => modal.type !== type))
  }

  // Check if a specific modal is open
  const isModalOpen = (type: ModalType) => {
    return modals.some((modal) => modal.type === type)
  }

  return (
    <ModalContext.Provider
      value={{ modals, openModal, closeModal, isModalOpen }}>
      {children}
    </ModalContext.Provider>
  )
}
