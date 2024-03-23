'use client'
import React, { useEffect, useRef, useState } from 'react'

import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import TipTapMenuBar from './TipTapMenuBar'
import { Button } from './ui/button'
import { useDebounce } from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { NoteType } from '@/lib/db/schema'
import { useCompletion } from 'ai/react' // this intracting with backend api '/api/completion' and return us to streaming tokens

import Text from "@tiptap/extension-text"

type Props = { note: NoteType }

const TipTapEditor = ({ note }: Props) => {

    const [editorState, setEditorState] = useState(note.editorState || `<h1>${note.name}</h1>`)

    const { complete, completion } = useCompletion({
        api: "/api/completion", // call api and get streaming response.
    })

    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/saveNote', {
                noteId: note.id,
                editorState
            })
            return response.data
        }
    })

    const customText = Text.extend({ // focusing to (shift - a) keyboard types
        addKeyboardShortcuts() {
            return {
                'Shift-a': () => {
                    // take the last 30 words
                    const prompt = this.editor.getText().split(' ').splice(-30).join(" ") //splice(-30) removes the last 30 elements from the array and -- returns them as a new array --

                    console.log('prompt ::', prompt)
                    complete(prompt) // hit endpoit with prompt
                    return true
                }
            }
        }
    })

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML());
        }
    })
    const lastCompletion = useRef("");

    useEffect(() => {
        if (!editor || !completion) return;
        console.log('lastCompletion ::', lastCompletion.current, lastCompletion.current.length);
        console.log('completion ::', completion)

        // completion - coming like this, 
        // 'Cats, with their mysterious and graceful', '
        // 'Cats, with their mysterious and graceful demeanor,', 
        // 'Cats, with their mysterious and graceful demeanor, never fail'

        // for the tiptap editor doesn't like that. editor needed one by one
        // diff ---
        //  editor.commands.insertContent('Cats, with their mysterious and graceful, ')
        //  editor.commands.insertContent('demeanor,', )
        //  editor.commands.insertContent('never fail')

        // lastCompletion :: 'I not' | lastCompletion.current.length :: 5
        // completion :: I not only enjoy the independent
        // diff ::  'only enjoy the independent' // ignore the prev length of text and get new text

        const diff = completion.slice(lastCompletion.current.length) // ignore the prev length of text and get new text into diff
        lastCompletion.current = completion
        console.log('diff ::', diff)
        // get individual word so that we can insert into the editor
        editor.commands.insertContent(diff)
    }, [completion, editor])


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