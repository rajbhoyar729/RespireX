'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useToast } from "@/components/ui/use-toast"
import { ChatMessageInput } from '@/lib/types'

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to chat
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
        body: JSON.stringify({ message: userMessage } satisfies ChatMessageInput),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
      // Remove the user's message if the API call failed
      setMessages(prev => prev.filter(msg => msg.id !== newUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Chat with AI for Health Advice</h1>
            <p className="text-sm text-gray-500">Get personalized respiratory health information and advice</p>
          </div>
          
          <ScrollArea className="h-[500px] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="break-words">{message.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-grow"
                maxLength={1000}
                aria-label="Chat message input"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                aria-label="Send message"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ErrorBoundary>
  )
}

