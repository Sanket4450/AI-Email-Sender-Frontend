import { LinksFunction } from '@remix-run/node'
import Sidebar from '~/components/layout/sidebar'

import styles from '~/tailwind.css?url'
import Header from './header'
import { ModalProvider } from '~/context/modal-context'
import { VALUES } from '~/lib/values'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ModalProvider>
      <div className="h-[100svh] relative overflow-hidden">
        <Header />

        <div
          className="w-full h-full"
          style={{ paddingTop: VALUES.HEADER_HEIGHT }}>
          <Sidebar />

          <main
            className="w-full h-full overflow-y-auto"
            style={{
              padding: VALUES.MAIN_CONTENT_PADDING,
              paddingLeft:
                VALUES.COLLAPSED_SIDEBAR_WIDTH + VALUES.MAIN_CONTENT_PADDING,
            }}>
            {children}
          </main>
        </div>
      </div>
    </ModalProvider>
  )
}
