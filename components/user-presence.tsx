'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface UserPresenceProps {
    userId: string
    className?: string
}

export function UserPresence({ userId, className }: UserPresenceProps) {
    const [isOnline, setIsOnline] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase.channel('global_presence')

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                // Simple check: if userId is key in presenceState
                // Note: presenceState keys are unique tracking IDs, not user IDs usually, 
                // unless we track with user_id as key or check values.
                // Supabase presence values are arrays of objects.

                const onlineUsers = new Set()
                Object.values(state).flat().forEach((user: any) => {
                    if (user.user_id) onlineUsers.add(user.user_id)
                })

                setIsOnline(onlineUsers.has(userId))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase])

    if (!isOnline) return null

    return (
        <span className={`inline-block w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 ${className}`} />
    )
}
