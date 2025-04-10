import { LABELS } from '~/lib/form'
import { ColumnDef } from '~/types/common'
import { Email } from '~/types/email'
import { createdAtColumn } from '../shared/table/common-columns'
import { StatusMarker } from '../shared/ui/status-marker'
import { CompletionMarker } from '../shared/ui/completion-marker'
import { EmailEventTracker } from './email-event-tracker'
import { prepareEmailEvents } from '~/lib/utils'

export const emailColumns: ColumnDef<Email>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => row.contact.name,
  },
  {
    id: 'contact',
    header: 'Events',
    align: 'center',
    cell: ({ row }) => (
      <EmailEventTracker data={prepareEmailEvents(row.events)} />
    ),
  },
  {
    id: 'sender',
    header: 'Sender',
    cell: ({ row }) => row.sender.displayName,
  },
  {
    id: 'isBounced',
    header: 'Bounced',
    align: 'center',
    cell: ({ row }) => <StatusMarker status={row.isBounced} />,
  },
  {
    id: 'isSpamReported',
    header: 'Spam Reported',
    align: 'center',
    minWidth: 130,
    cell: ({ row }) => <CompletionMarker completed={row.isSpamReported} />,
  },
  createdAtColumn(LABELS.SENT_AT),
]
