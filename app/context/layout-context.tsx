import { createContext, useContext, useState } from 'react'

interface ModalContextType {
  headerLabel: string
  setHeaderLabel: React.Dispatch<React.SetStateAction<string>>
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useLayout = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerLabel, setHeaderLabel] = useState<string>('')

  return (
    <ModalContext.Provider value={{ headerLabel, setHeaderLabel }}>
      {children}
    </ModalContext.Provider>
  )
}
