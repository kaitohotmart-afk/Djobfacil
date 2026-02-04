'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage, markConversationAsRead } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, Paperclip, X, Image as ImageIcon } from 'lucide-react'
import { MessageBubble } from './message-bubble'
import { ProposalModal } from './proposal-modal'

interface Message {
    id: string
    content: string
    sender_id: string | null
    created_at: string
    tipo_mensagem: 'normal' | 'sistema' | 'admin' | 'aviso'
    lida_por?: string[]
    file_url?: string | null
    file_type?: string | null
    sender?: {
        role: string
    }
}

interface ChatInterfaceProps {
    conversationId: string
    userId: string
    initialMessages: Message[]
    otherUser?: any
}

export function ChatInterface({ conversationId, userId, initialMessages, otherUser }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Mark messages as read when conversation is viewed
    useEffect(() => {
        const markAsRead = async () => {
            await markConversationAsRead(conversationId)
        }
        markAsRead()

        // Mark as read when window gains focus
        const handleFocus = () => {
            markAsRead()
        }
        window.addEventListener('focus', handleFocus)

        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [conversationId])

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
                        // Avoid duplicates
                        if (prev.find(m => m.id === newMsg.id)) return prev
                        return [...prev, newMsg]
                    })
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const updatedMsg = payload.new as Message
                    setMessages((prev) =>
                        prev.map(m => m.id === updatedMsg.id ? updatedMsg : m)
                    )
                }
            )
            .on(
                'broadcast',
                { event: 'typing' },
                (payload) => {
                    const { userId: typingUserId, isTyping } = payload.payload
                    if (typingUserId === userId) return // Ignore self

                    setTypingUsers((prev) => {
                        const newSet = new Set(prev)
                        if (isTyping) {
                            newSet.add(typingUserId)
                        } else {
                            newSet.delete(typingUserId)
                        }
                        return newSet
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, supabase, userId])

    const handleTyping = () => {
        // Send typing event
        const channel = supabase.channel(`chat:${conversationId}`)
        channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId, isTyping: true }
        })

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            channel.send({
                type: 'broadcast',
                event: 'typing',
                payload: { userId, isTyping: false }
            })
            typingTimeoutRef.current = null
        }, 3000)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('O arquivo deve ter no máximo 5MB')
                return
            }
            setSelectedFile(file)
        }
    }

    const clearFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const uploadFile = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${conversationId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('chat-uploads')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('chat-uploads')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error) {
            console.error('Error uploading file:', error)
            return null
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if ((!newMessage.trim() && !selectedFile) || isSending || isUploading) return

        const content = newMessage
        const file = selectedFile

        // Clear input immediately for better UX
        setNewMessage('')
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''

        setIsSending(true)

        let fileUrl = undefined
        let fileType = undefined

        if (file) {
            setIsUploading(true)
            const uploadedUrl = await uploadFile(file)
            setIsUploading(false)

            if (!uploadedUrl) {
                alert('Erro ao enviar imagem')
                setIsSending(false)
                setNewMessage(content) // Restore
                setSelectedFile(file) // Restore
                return
            }

            fileUrl = uploadedUrl
            fileType = file.type.startsWith('image/') ? 'image' : 'document'
        }

        const result = await sendMessage(conversationId, content, 'normal', fileUrl, fileType)

        setIsSending(false)
        if (result.error) {
            alert('Erro ao enviar mensagem')
            setNewMessage(content) // Restore on error
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur overflow-hidden">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto py-4"
            >
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        Nenhuma mensagem nesta conversa. Diga olá!
                    </div>
                )}

                {messages.map((msg) => {
                    // Determine sender role
                    let senderRole = msg.sender?.role

                    // If realtime message (no sender object), check against known users
                    if (!senderRole) {
                        if (msg.sender_id === otherUser?.id) {
                            senderRole = otherUser.role
                        }
                        // We could also check current user, but usually we don't badge ourselves
                    }

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isCurrentUser={msg.sender_id === userId}
                            currentUserId={userId}
                            senderRole={senderRole}
                        />
                    )
                })}

                {/* Typing Indicator */}
                {typingUsers.size > 0 && (
                    <div className="px-4 mb-3">
                        <div className="bg-slate-800 rounded-lg rounded-bl-none px-4 py-3 inline-flex items-center gap-1 w-16 h-10">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-slate-900/80 rounded-b-xl">
                {selectedFile && (
                    <div className="mb-3 p-3 bg-slate-800/50 rounded-lg flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                {selectedFile.type.startsWith('image/') ? (
                                    <ImageIcon className="h-5 w-5 text-blue-400" />
                                ) : (
                                    <Paperclip className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-white truncate max-w-[200px]">
                                    {selectedFile.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={clearFile}
                            className="text-gray-400 hover:text-red-400"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <form onSubmit={handleSend} className="flex gap-2 items-end">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                    />

                    {otherUser && (
                        <ProposalModal
                            conversationId={conversationId}
                            receiverId={otherUser.id}
                        />
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending || isUploading}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    <Input
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)
                            handleTyping()
                        }}
                        onKeyDown={() => handleTyping()}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-slate-950 border-white/10 text-white placeholder:text-gray-500"
                        disabled={isSending || isUploading}
                        maxLength={1000}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={(!newMessage.trim() && !selectedFile) || isSending || isUploading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isSending || isUploading ? (
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
