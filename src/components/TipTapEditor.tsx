'use client'
import React, { useEffect, useState } from 'react'

import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import TipTapMenuBar from './TipTapMenuBar'
import { Button } from './ui/button'
import { useDebounce } from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { NoteType } from '@/lib/db/schema'

type Props = { note: NoteType }

const TipTapEditor = ({ note }: Props) => {

    const [editorState, setEditorState] = useState(note.editorState || `<h1>${note.name}</h1>`)

    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/saveNote', {
                noteId: note.id,
                editorState
            })
            return response.data
        }
    })

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit],
        content: editorState,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML());
        }
    })

    // giving little await
    const debouncedEditorState = useDebounce(editorState, 500)

    useEffect(() => {
        // save to db
        if (debouncedEditorState === '') return
        saveNote.mutate(undefined, { // undefined -> we doesn't pass anything to it.
            onSuccess: data => {
                console.log('success update! ::', data)
            },
            onError: err => {
                console.error(err)
            }
        });
    }, [debouncedEditorState])

    return (
        <>
            <div className=' flex'>
                {editor && <TipTapMenuBar editor={editor} />}
                <Button variant={'outline'} disabled>
                    {saveNote.isPending ? "Saving..." : "Saved"}
                </Button>
            </div>
            {/* Now you can use the - prose - classes to add sensible typography styles to any vanilla HTML: H1, H2, p */}
            <div className=' prose'>
                <EditorContent editor={editor} />
            </div>
        </>
    )
}

export default TipTapEditor