import { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

type PropsType = {
  value?: string
  onChange?: (value: string) => void
}

export function RichEditor({ value, onChange }: PropsType) {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
  })

  useEffect(() => {
    if (quill && value !== undefined && value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value)
    }
  }, [quill, value])

  useEffect(() => {
    if (quill && onChange) {
      const handleChange = () => {
        onChange(quill.root.innerHTML)
      }

      quill.on('text-change', handleChange)

      return () => {
        quill.off('text-change', handleChange)
      }
    }
  }, [quill, onChange])

  useEffect(() => {
    if (quill) {
      // Override Enter key to insert <br> instead of new block
      ;(quill.getModule('keyboard') as any).bindings['enter'] = {
        key: 'enter',
        handler: () => {
          quill.insertEmbed(quill.getSelection()?.index || 0, 'break', true)
          return false // Prevent default block creation
        },
      }

      // Apply Gmail-like default styles
      quill.root.style.fontFamily = 'Arial, sans-serif'
      quill.root.style.fontSize = '13px'
      quill.root.style.margin = '0'
      quill.root.style.lineHeight = '1.2'
    }
  }, [quill])

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div ref={quillRef} />
    </div>
  )
}
