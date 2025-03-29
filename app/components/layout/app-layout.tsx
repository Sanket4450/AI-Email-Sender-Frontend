import { LinksFunction } from '@remix-run/node'
import Sidebar from '~/components/layout/sidebar'

import styles from '~/tailwind.css?url'
import Header from './header'
import { ModalProvider } from '~/context/modal-context'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ModalProvider>
      <div className="h-[100svh] relative flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 min-h-0 w-full flex">
          <Sidebar />

          <main className="h-full flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ModalProvider>
  )
}
