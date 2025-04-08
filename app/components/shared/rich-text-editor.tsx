import { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import FontFamily from '@tiptap/extension-font-family'
import Heading, { Level } from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { toast } from 'sonner'
import { ERROR_MSG } from '~/lib/messages'
import { TextEditorIcon } from './text-edtor-button'
import { FONTS, HEADERS, TEXT_ALIGNMENTS } from '~/lib/constants'
import { ChevronDown, ImageIcon, Link2Icon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { NAMES, PLACEHOLDERS } from '~/lib/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type PropsType = {
  placeholder: string
  initialValue: string
  onChange?: (initialValue: string) => void
}

export function RichEditor({ placeholder, initialValue, onChange }: PropsType) {
  const editor = useEditor({
    extensions: [
      Document,
      Placeholder.configure({
        placeholder,
      }),
      History,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'text-left',
        },
      }),
      Text,
      TextStyle,
      FontFamily,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Bold,
      Italic,
      Underline,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      BulletList,
      OrderedList,
      ListItem,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`)

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: (url) => {
          try {
            url.includes(':') ? new URL(url) : new URL(`https://${url}`)
            return true
          } catch {
            return false
          }
        },
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
  })

  useEffect(() => {
    editor?.commands.setContent(initialValue)
  }, [initialValue, editor])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editor) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        editor.chain().focus().setImage({ src: imageUrl }).run()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFontFamilyChange = (value: string) => {
    editor?.chain().focus().setFontFamily(value).run()
  }

  const handleAlignmentChange = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run()
  }

  // const resetInsertLink = () => {
  //   setLinkUrl('')
  //   setInsertLinkOpen(false)
  // }

  const setLink = useCallback(() => {
    try {
      if (editor?.isActive('link')) {
        editor.chain().focus().unsetLink().run()
      } else {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
          return
        }

        if (url === '') {
          editor?.chain().focus().extendMarkRange('link').unsetLink().run()
          return
        }

        editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run()
      }
    } catch (error) {
      toast.error(ERROR_MSG.INVALID_URL)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-2 rounded-md">
      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-0 flex-1"
      />

      {/* Toolbar */}
      <div
        className="flex select-none flex-wrap items-center gap-1.5 rounded-md p-2"
        style={{ border: '1px solid hsl(var(--input))' }}>
        <TextEditorIcon
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/undo_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/redo_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          isActive={editor?.isActive('bold') || false}
          onClick={() => editor?.chain().focus().toggleBold().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_bold_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          isActive={editor?.isActive('italic') || false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_italic_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          isActive={editor?.isActive('underline') || false}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_underlined_black_20dp.png" />
        </TextEditorIcon>

        {HEADERS.map((h) => (
          <TextEditorIcon
            key={h.value}
            isActive={
              editor?.isActive('heading', { level: parseInt(h.value) }) || false
            }
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: parseInt(h.value) as Level })
                .run()
            }>
            <span className="text-sm font-semibold">{h.label}</span>
          </TextEditorIcon>
        ))}

        <Select onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="h-8 w-32">
            <SelectValue placeholder={PLACEHOLDERS.FONT_FAMILY} />
          </SelectTrigger>
          <SelectContent className="w-28">
            {FONTS.map((f) => (
              <SelectItem
                key={f.value}
                value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue="left"
          onValueChange={handleAlignmentChange}>
          <SelectTrigger className="h-8 w-14">
            <SelectValue placeholder={PLACEHOLDERS.ALIGNMENT} />
          </SelectTrigger>
          <SelectContent className="min-w-0">
            {TEXT_ALIGNMENTS.map((a) => (
              <SelectItem
                key={a.value}
                value={a.value}>
                <img
                  src={a.url}
                  className="size-5"
                />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label
          htmlFor={NAMES.TEXT_COLOR}
          className="flex h-8 items-center justify-between gap-1 rounded-md border border-input px-2 hover:cursor-pointer">
          <input
            type="color"
            id={NAMES.TEXT_COLOR}
            onInput={(e) =>
              editor
                ?.chain()
                .focus()
                .setColor((e.target as any).value)
                .run()
            }
            value={editor?.getAttributes('textStyle').color}
            className="invisible w-0"
          />

          <div className="flex w-3.5 flex-col items-center">
            <span className="text-sm">A</span>
            <span
              className="h-1 w-full"
              style={{
                backgroundColor: editor?.getAttributes('textStyle').color,
              }}
            />
          </div>
          <ChevronDown className="size-4 opacity-50" />
        </label>

        <TextEditorIcon
          isActive={editor?.isActive('bulletList') || false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_list_bulleted_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          isActive={editor?.isActive('orderedList') || false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_list_numbered_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          isActive={false}
          disabled={!editor?.can().sinkListItem('listItem')}
          onClick={() =>
            editor?.chain().focus().sinkListItem('listItem').run()
          }>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_indent_decrease_black_20dp.png" />
        </TextEditorIcon>

        <TextEditorIcon
          isActive={false}
          disabled={!editor?.can().liftListItem('listItem')}
          onClick={() =>
            editor?.chain().focus().liftListItem('listItem').run()
          }>
          <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/format_indent_increase_black_20dp.png" />
        </TextEditorIcon>

        {/* <Popover open={insertLinkOpen} onOpenChange={setInsertLinkOpen}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center hover:cursor-pointer',
                'hover:bg-accent',
                editor.isActive('link') && 'bg-accent'
              )}
            >
              <Link2Icon size={18} />
            </div>
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <div className='grid gap-4'>
              <h4 className='font-medium leading-none'>{MSG.INSERT_LINK}</h4>
              <Input
                name={NAMES.URL}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder={PLACEHOLDERS.URL}
              />
              <div className='flex justify-end gap-2'>
                <Button variant='outline' size='sm' onClick={resetInsertLink}>
                  {CONSTANTS.CANCEL}
                </Button>
                <Button size='sm' onClick={handleInsertLink}>
                  {CONSTANTS.APPLY}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover> */}

        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center hover:cursor-pointer',
            'hover:bg-accent',
            editor.isActive('link') && 'bg-accent'
          )}
          onClick={setLink}>
          <Link2Icon size={18} />
        </div>

        <TextEditorIcon
          isActive={false}
          onClick={() => editor?.chain().focus().undo().run()}>
          <label
            className={cn(
              'flex h-full w-full items-center justify-center hover:cursor-pointer',
              'hover:bg-accent'
            )}
            htmlFor={NAMES.IMAGE_UPLOAD}>
            <ImageIcon size={18} />
          </label>
          <input
            id={NAMES.IMAGE_UPLOAD}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </TextEditorIcon>
      </div>
    </div>
  )
}
