'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

interface GlobalPresenceProps {
    userId: string
}

export function GlobalPresence({ userId }: GlobalPresenceProps) {
    const supabase = createClient()

    useEffect(() => {
        if (!userId) return

        const channel = supabase.channel('global_presence')

        channel
            .on('presence', { event: 'sync' }, () => {
                // We just need to track ourselves, we don't necessarily need to listen
                // unless we want to do something with the list.
                // But tracking is essential.
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Track this user
                    await channel.track({
                        user_id: userId,
                        online_at: new Date().toISOString(),
                    })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase])

    return null // Invisible component
}
