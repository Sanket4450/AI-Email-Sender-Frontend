interface CommonTableHeaderProps {
  children: React.ReactNode
}

export const TableHeaderSection = ({ children }: CommonTableHeaderProps) => {
  return (
    <section className="flex justify-between items-center pb-2">
      {children}
    </section>
  )
}
