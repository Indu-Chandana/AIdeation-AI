import { Editor } from '@tiptap/react'
import { Bold } from 'lucide-react'
import React from 'react'

type Props = {

    editor: Editor
}

const TipTapMenuBar = ({ editor }: Props) => {
    return (
        <div className=' flex flex-wrap gap-2'>
            {/* In there we do bold stuff */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
            >
                <Bold className=' w-6 h-6' />
            </button>
        </div>
    )
}

export default TipTapMenuBar