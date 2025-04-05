import { LABELS } from '~/lib/form'
import { ColumnDef } from '~/types/common'
import { Email } from '~/types/email'
import { createdAtColumn } from '../shared/table/common-columns'
import { StatusMarker } from '../shared/ui/status-marker'
import { CompletionMarker } from '../shared/ui/completion-marker'

export const emailColumns: ColumnDef<Email>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => row.contact.name,
  },
  // event tracking column
  {
    id: 'sender',
    header: 'Sender',
    cell: ({ row }) => row.sender.displayName,
  },
  {
    id: 'isBounced',
    header: 'Bounced',
    cell: ({ row }) => <StatusMarker status={row.isBounced} />,
  },
  {
    id: 'isSpamReported',
    header: 'Spam Reported',
    cell: ({ row }) => <CompletionMarker completed={row.isSpamReported} />,
  },
  createdAtColumn(LABELS.SENT_AT),
]
