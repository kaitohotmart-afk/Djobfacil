'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface Message {
    id: string
    content: string
    sender_id: string | null
    created_at: string
    tipo_mensagem: string
}

interface ChatInterfaceProps {
    conversationId: string
    userId: string
    initialMessages: Message[]
}

export function ChatInterface({ conversationId, userId, initialMessages }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message
                    setMessages((prev) => {
                        // Avoid duplicates if optimistic update used later
                        if (prev.find(m => m.id === newMsg.id)) return prev
                        return [...prev, newMsg]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, supabase])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || isSending) return

        const content = newMessage
        setNewMessage('')
        setIsSending(true)

        // Optimistic UI could go here, but waiting for realtime is safer for consistency
        const result = await sendMessage(conversationId, content)

        setIsSending(false)
        if (result.error) {
            alert('Erro ao enviar mensagem')
            setNewMessage(content) // Restore on error
        }
    }

    return (
        <div className="flex flex-col h-[600px] bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        Nenhuma mensagem nesta conversa. Diga olá!
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.sender_id === userId
                    const isSystem = msg.tipo_mensagem === 'sistema'

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-4">
                                <div className="bg-slate-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                                    {msg.content}
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-gray-200 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {format(new Date(msg.created_at), 'HH:mm')}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-slate-900/80 rounded-b-xl">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-slate-950 border-white/10 text-white placeholder:text-gray-500"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim() || isSending}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
