"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Loader2, Plus } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { useRouter } from 'next/navigation'

type Props = {}

const CreateNoteDiaog = (props: Props) => {
    const router = useRouter()

    const [input, setInput] = useState("")

    const uploadToFirebase = useMutation({
        mutationFn: async (note_id: string) => {
            const response = await axios.post('/api/uploadToFirebase', {
                noteId: note_id
            })
            return response.data
        }
    })

    const createNotebook = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/createNoteBook', {
                name: input
            })
            return response.data
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input === '') {
            window.alert('Please enter a name for your notebook')
            return
        }

        createNotebook.mutate(undefined, {
            onSuccess: ({ note_id }) => {
                console.log('yayy note created. note_id ::', { note_id })

                // hit another endpoint upload the temp Dalle url to permenent firebase storage

                uploadToFirebase.mutate(note_id, {
                    onSuccess: (data) => {
                        console.log('success data ::', data)
                    },
                    onError: (error) => {
                        console.log('error uploadToFirebase ::', error)
                    }
                })
                router.push(`/notebook/${note_id}`)
            },
            onError: (error) => {
                console.error('error handle submit ::', error)
                window.alert("Failed to create new notebook");
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger>
                <div className=' flex border-dashed border-2 border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4'>
                    <Plus className='w-6 h-6 text-green-600' strokeWidth={3} />
                    <h2 className=' font-semibold text-green-600 sm:mt-2'>New Note Book</h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Note Book</DialogTitle>
                    <DialogDescription>
                        You can create a new note by clicking thee button below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Name...' />
                    <div className=' h-4'></div>
                    <div className='flex items-center gap-2'>
                        <Button type='reset' variant={'secondary'}>Cancel</Button>
                        <Button type='submit' className=' bg-green-600' disabled={createNotebook.isPending}>
                            {createNotebook.isPending && (
                                <Loader2 className=' w-4 h-4 mr-2 animate-spin' />
                            )}
                            Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNoteDiaog