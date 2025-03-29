interface PageTitleProps {
  title: string
  subtitle?: string
}

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <header className="flex flex-col items-start w-full pb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </header>
  )
}
