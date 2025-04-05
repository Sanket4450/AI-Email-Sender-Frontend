interface PageTitleProps {
  title: string
  subtitle?: string
}

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <header className="flex items-center gap-2 w-full pb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <p className="mt-0.5 text-muted-foreground">{subtitle}</p>
      )}
    </header>
  )
}
