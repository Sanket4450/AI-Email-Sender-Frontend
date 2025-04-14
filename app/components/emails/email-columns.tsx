import { LABELS, NAMES } from '~/lib/form'
import { ColumnDef } from '~/types/common'
import { Email } from '~/types/email'
import { createdAtColumn } from '../shared/table/common-columns'
import { CompletionMarker } from '../shared/ui/completion-marker'
import { EmailEventTracker } from './email-event-tracker'
import { formatStringArray } from '~/lib/utils'
import { CONSTANTS } from '~/lib/constants'

export const emailColumns: ColumnDef<Email>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => row.contact.name,
  },
  {
    id: 'tags',
    header: 'Tags',
    cell: ({ row }) => formatStringArray(row.tags, NAMES.TITLE) || CONSTANTS.NA,
  },
  {
    id: 'events',
    header: 'Events',
    align: 'center',
    cell: ({ row }) => (
      <EmailEventTracker
        id={row.id}
        events={row.events}
      />
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
    cell: ({ row }) => <CompletionMarker completed={row.isBounced} />,
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
