'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type Props = {
    children: React.ReactNode
}

const queryClient = new QueryClient();

// why we use that -@tanstack/react-query- 
// u are fetching note from api, after u navigate to another page and u are fetching same endpoint and getting back the same endpoint.
// instered of doingthis 
// react query will notice that and getting that data from the cache.

const Provider = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Provider