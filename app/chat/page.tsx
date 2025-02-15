'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useToast } from "@/components/ui/use-toast"
import { ChatMessageInput } from '@/lib/types'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Material UI Color Palette
const COLORS = {
  primary: '#1976d2',
  secondary: '#9c27b0',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#d32f2f',
  textPrimary: 'rgba(0, 0, 0, 0.87)',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
}

export default function Chat() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full p-8 text-center">
          <p>Loading...</p>
        </Card>
      </div>
    )
  }

  // Require authentication
  if (!session?.user?.id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full p-8 text-center">
          <h2 className="text-2xl font-bold">Please sign in to use the chat</h2>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: session.user.id
        } satisfies ChatMessageInput),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      
      const newAIMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newAIMessage])
    } catch (error) {
      console.error('Error in chat:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
      setMessages(prev => prev.filter(msg => msg.id !== newUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.surface }}>
          <div 
            className="p-6 border-b flex items-center space-x-4"
            style={{ backgroundColor: COLORS.primary, color: 'white' }}
          >
            <Avatar>
              <AvatarFallback className="bg-white text-blue-600">AI</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Health Assistant</h1>
              <p className="text-sm opacity-90">Specialized in Respiratory Health</p>
            </div>
          </div>
          
          <ScrollArea 
            className="h-[600px] p-4 bg-gradient-to-b from-blue-50/20 to-white"
            ref={scrollAreaRef}
          >
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.isUser ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {!message.isUser && (
                    <Avatar className="mt-1">
                      <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl p-4 shadow-sm transition-all",
                      "hover:shadow-md duration-300",
                      message.isUser 
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-white text-gray-900 border border-gray-100'
                    )}
                    style={{
                      boxShadow: message.isUser 
                        ? '0 4px 6px -1px rgba(25, 118, 210, 0.2)' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="text-sm leading-relaxed break-words">{message.text}</div>
                    <div 
                      className={cn(
                        "text-xs mt-2",
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="mt-1">
                    <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
            <div className="flex gap-3 items-center">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your health question..."
                disabled={isLoading}
                className="flex-grow rounded-full px-6 py-5 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{ backgroundColor: COLORS.background }}
                maxLength={1000}
                aria-label="Chat message input"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="rounded-full px-6 py-5 h-auto shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: COLORS.primary }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2">Sending</span>
                    <span className="dot-flashing" />
                  </span>
                ) : 'Send'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ErrorBoundary>
  )
}