import { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import stylesheet from '~/tailwind.css?url'
import AppLayout from './components/layout/app-layout'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

export const meta: MetaFunction = () => [
  { title: 'EmailSender Dashboard' },
  { name: 'description', content: 'A dashboard for managing email campaigns.' },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <AppLayout>
          <Outlet />
        </AppLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
