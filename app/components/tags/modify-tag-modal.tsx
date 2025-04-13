import { useModal } from '~/context/modal-context'
import { INFO_MSG } from '~/lib/messages'
import { ModifyDialog } from '../shared/ui/modify-dialog'
import { SubmitBtn } from '../shared/ui/buttons'
import { LABELS } from '~/lib/form'
import { ModifyTag, ModifyTagSchema } from '~/schemas/tag'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { CONSTANTS } from '~/lib/constants'
import { ModifyTagFields } from './modify-tag-fields'
import { useEffect } from 'react'

interface ModifyTagModalProps {
  onClose: () => void
  onModify: (tagId: string | undefined, data: ModifyTag) => void
}

export const ModifyTagModal = ({ onClose, onModify }: ModifyTagModalProps) => {
  const { isModalOpen, getModalData } = useModal()

  const isOpen = isModalOpen('modify-tag')

  const tagData = getModalData('modify-tag')

  const tagId = tagData?.id as string | undefined

  useEffect(() => {
    if (tagData?.id) {
      form.setValue('title', tagData.title)
    }
  }, [tagData])

  const form = useForm<ModifyTag>({
    resolver: zodResolver(ModifyTagSchema),
    defaultValues: {
      title: '',
    },
  })

  const closeModifyModal = () => {
    form.reset()
    onClose()
  }

  const handleSubmit = (values: ModifyTag) => {
    onModify(tagId, values)
  }

  const actionBtn = (
    <SubmitBtn
      name={CONSTANTS.MODIFY_TAG_FORM}
      child={LABELS.SAVE}
    />
  )

  // Form
  const dialogBody = (
    <Form {...form}>
      <form
        id={CONSTANTS.MODIFY_TAG_FORM}
        className="py-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <ModifyTagFields control={form.control} />
      </form>
    </Form>
  )

  return (
    <ModifyDialog
      open={isOpen}
      onClose={closeModifyModal}
      title={tagId ? INFO_MSG.EDIT_TAG : INFO_MSG.ADD_TAG}
      body={dialogBody}
      actionChild={actionBtn}
    />
  )
}
