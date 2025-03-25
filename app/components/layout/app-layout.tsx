import { LinksFunction } from '@remix-run/node'
import Sidebar from '~/components/layout/sidebar'
import { VALUES } from '~/lib/values'

import styles from '~/tailwind.css?url'
import Header from './header'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-[100svh] relative overflow-hidden">
      <Header />

      <div className="w-full flex">
        <Sidebar />

        <main className="h-full flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
