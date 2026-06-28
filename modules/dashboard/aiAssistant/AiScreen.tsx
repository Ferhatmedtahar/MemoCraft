"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select } from "@/components/ui/select";
import {
  AlertCircle,
  BookOpen,
  Bot,
  BotIcon,
  LampDesk,
  Loader2,
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  fetchNoteById,
  fetchNotes,
} from "@/modules/dashboard/notes/data/fetchData";
import {
  chatWithAI,
  getUserAIUsage,
} from "./data/ai.actions";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistantScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [usageInfo, setUsageInfo] = useState({
    currentUsage: 0,
    remainingRequests: 30,
    resetTime: null as Date | null,
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load notes and usage info on component mount
  useEffect(() => {
    loadNotes();
    loadUsageInfo();
  }, []);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadNotes = async () => {
    try {
      const notesData = await fetchNotes();
      if (notesData) {
        setNotes(
          notesData.map((note) => ({
            id: note.id,
            title: note.title || "Untitled Note",
            content: note.content || "",
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to load notes");
      console.error(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const loadUsageInfo = async () => {
    try {
      const usage = await getUserAIUsage();
      if (usage.success) {
        setUsageInfo({
          currentUsage: usage.currentUsage || 0,
          remainingRequests: usage.remainingRequests || 0,
          resetTime: usage.resetTime || null,
        });
      }
    } catch (error) {
      console.error("Failed to load usage info:", error);
    }
  };

  const handleNoteSelection = async (noteId: string) => {
    setSelectedNoteId(noteId);
    try {
      const result = await fetchNoteById(noteId);
      if (result.success && result.data) {
        setSelectedNote({
          id: result.data.id,
          title: result.data.title || "Untitled Note",
          content: result.data.content || "",
        });

        // Start conversation with a welcome message
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: `Hi! I'm ready to help you with "${result.data.title}". Feel free to ask me any questions about this topic!`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      toast.error("Failed to load note content");
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!selectedNote) {
      toast.error("Please select a note first");
      return;
    }

    if (usageInfo.remainingRequests <= 0) {
      toast.error(
        "You've reached your daily AI chat limit. Please try again tomorrow."
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await chatWithAI(
        selectedNote.content,
        userMessage.content,
        conversationHistory
      );

      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            result.response ||
            "I apologize, but I couldn't generate a response.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        setUsageInfo((prev) => ({
          ...prev,
          currentUsage: prev.currentUsage + 1,
          remainingRequests:
            result.remainingRequests || prev.remainingRequests - 1,
        }));
      } else {
        toast.error(result.message || "Failed to get AI response");

        if (typeof result.remainingRequests === "number") {
          setUsageInfo((prev) => ({
            ...prev,
            remainingRequests: result.remainingRequests || 0,
          }));
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSelectedNoteId("");
    setSelectedNote(null);
    setInputMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen flex flex-col space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get help from your personal AI tutor
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="text-xs text-muted-foreground text-center sm:text-right">
            <div>Requests: {usageInfo.currentUsage}/30</div>
            <div>{usageInfo.remainingRequests} remaining</div>
          </div>
          <Button onClick={startNewChat} className="w-full sm:w-auto">
            <MessageCircle className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Note Selection */}
      <div className="space-y-2">
        <Label>Select a note to discuss</Label>
        <Select
          value={selectedNoteId}
          onValueChange={handleNoteSelection}
          disabled={loadingNotes}
        >
          <Select.Trigger className="w-full">
            <Select.Value
              placeholder={
                loadingNotes ? "Loading notes..." : "Choose a note to discuss"
              }
            />
          </Select.Trigger>
          <Select.Content>
            {notes.length === 0 && !loadingNotes && (
              <Select.Item value="no-notes" disabled>
                No notes found
              </Select.Item>
            )}
            {notes.map((note) => (
              <Select.Item key={note.id} value={note.id}>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{note.title}</span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* Chat Interface */}
      {selectedNote ? (
        <Card className="flex-1 flex flex-col">
          <Card.Header className="border-b">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <Card.Title className="text-lg">
                  Discussing: {selectedNote.title}
                </Card.Title>
                <Card.Description>
                  Ask me anything about this topic!
                </Card.Description>
              </div>
            </div>
          </Card.Header>

          <Card.Content className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] border-2 p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary-foreground text-secondary-foreground"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === "assistant" && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.role === "user" && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-foreground" />
                        )}
                        <div className="space-y-1">
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs ${
                              message.role === "user"
                                ? "text-primary-foreground"
                                : "text-secondary-foreground"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-primary-foreground p-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              {usageInfo.remainingRequests <= 0 ? (
                <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-700">
                    Daily AI chat limit reached. Resets in{" "}
                    {usageInfo.resetTime
                      ? Math.ceil(
                          (usageInfo.resetTime.getTime() -
                            new Date().getTime()) /
                            (60 * 60 * 1000)
                        )
                      : "24"}{" "}
                    hours.
                  </span>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question about this note..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <Card.Content className=" flex flex-col items-center text-center space-y-4">
            <BotIcon className="h-12 w-12" />

            <div>
              <h3 className="text-lg font-semibold">
                Select a note to start chatting
              </h3>
              <p className="text-muted-foreground">
                Choose one of your notes above and I&apos;ll help you understand
                the content better!
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <LampDesk /> Tip: I can explain concepts, answer questions, and
                provide additional context
              </p>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
