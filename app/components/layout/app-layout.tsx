import { LinksFunction } from '@remix-run/node'
import Sidebar from '~/components/layout/sidebar'

import styles from '~/tailwind.css?url'
import Header from './header'
import { ModalProvider } from '~/context/modal-context'
import { VALUES } from '~/lib/values'
import { LayoutProvider } from '~/context/layout-context'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <LayoutProvider>
      <ModalProvider>
        <div className="h-[100svh] relative overflow-hidden">
          <Sidebar />

          <div
            className="w-full h-full"
            style={{
              paddingTop: VALUES.HEADER_HEIGHT,
              paddingLeft: VALUES.COLLAPSED_SIDEBAR_WIDTH,
            }}>
            <Header />

            <main
              className="w-full h-full overflow-y-auto"
              style={{
                padding: VALUES.MAIN_CONTENT_PADDING,
              }}>
              {children}
            </main>
          </div>
        </div>
      </ModalProvider>
    </LayoutProvider>
  )
}
