import React, { createContext, useContext, useState } from 'react'

export type ModalType =
  | 'modify-tag'
  | 'delete-company'
  | 'delete-contact'
  | 'delete-sender'
  | 'delete-draft'
  | 'delete-tag'

interface ModalState {
  type: ModalType 
  data: Record<string, unknown>
}

interface ModalContextType {
  openModal: (type: ModalType, data: Record<string, any>) => void
  closeModal: (type: ModalType) => void
  isModalOpen: (type: ModalType) => boolean
  getModalData: (type: ModalType) => Record<string, any> | undefined
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
  const openModal = (type: ModalType, data: Record<string, any>) => {
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

  // Get data associated with a specific modal
  const getModalData = (type: ModalType) => {
    const modal = modals.find((modal) => modal.type === type)
    return modal ? modal.data : undefined
  }

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, isModalOpen, getModalData }}>
      {children}
    </ModalContext.Provider>
  )
}
