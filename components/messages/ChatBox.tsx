"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
    _id: string;
    sender: { _id: string; name: string; profileImage: string };
    receiver: { _id: string; name: string; profileImage: string };
    content: string;
    read: boolean;
    createdAt: string;
}

interface ChatBoxProps {
    jobId: string;
    currentUserId: string;
    otherParticipantName?: string;
    otherParticipantRole?: string;
}

export default function ChatBox({ jobId, currentUserId, otherParticipantName = "Participant", otherParticipantRole = "" }: ChatBoxProps) {
    const [content, setContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [isScrolledUp, setIsScrolledUp] = useState(false);

    // Fetch messages with polling every 4 seconds
    const { data: messages = [], isLoading, isError, error } = useQuery({
        queryKey: ["messages", jobId],
        queryFn: async () => {
            const res = await axios.get(`/api/messages?jobId=${jobId}`);
            return res.data.data as Message[];
        },
        refetchInterval: 4000,
    });

    // Mutation to send a message
    const sendMutation = useMutation({
        mutationFn: async (messageContent: string) => {
            const res = await axios.post("/api/messages", { jobId, content: messageContent });
            return res.data.data as Message;
        },
        onSuccess: () => {
            setContent("");
            queryClient.invalidateQueries({ queryKey: ["messages", jobId] });
            // Force scroll to bottom immediately on send
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to send message");
        }
    });

    // Mutation to mark messages as read
    const markReadMutation = useMutation({
        mutationFn: async () => {
            await axios.patch("/api/messages", { jobId });
        },
        // No invalidation needed — marking as read doesn't change visible content
        // and invalidating here would create an infinite loop with the useEffect below
    });

    // Mark as read when unread messages are found
    // NOTE: markReadMutation is intentionally excluded from deps — it's a new object
    // reference each render and including it would cause an infinite loop.
    useEffect(() => {
        const hasUnread = messages.some(
            (msg) => msg.receiver._id === currentUserId && !msg.read
        );
        if (hasUnread) {
            markReadMutation.mutate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, currentUserId]);

    // Scroll to bottom on new messages, unless user has scrolled up significantly
    useEffect(() => {
        if (!isScrolledUp && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isScrolledUp]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        // If user scrolls up more than 50px from bottom, consider them "scrolled up"
        const isBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
        setIsScrolledUp(!isBottom);
    };

    const handleSend = () => {
        if (!content.trim()) return;
        sendMutation.mutate(content.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isLoading && messages.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-32 items-center justify-center text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 p-4 text-center">
                Error loading messages: {(error as any).response?.data?.message || error.message}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {/* Conversation Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm shrink-0">
                    {otherParticipantName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {otherParticipantName}
                    </span>
                    {otherParticipantRole && (
                        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
                            {otherParticipantRole}
                        </span>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div 
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[150px] max-h-[50vh] sm:max-h-[400px]"
                onScroll={handleScroll}
            >
                {messages.length === 0 ? (
                    <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center px-4">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No messages yet</p>
                        <p className="text-xs text-zinc-500 mt-1 max-w-[250px]">Start the conversation about this job.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.sender._id === currentUserId;
                        return (
                            <div
                                key={msg._id}
                                className={`flex w-full ${isMine ? "justify-end pl-12" : "justify-start pr-12"}`}
                            >
                                <div
                                    className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                                        isMine
                                            ? "bg-teal-600 text-white rounded-br-sm"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-200/50 dark:border-zinc-700/50"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                                    <div
                                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                            isMine ? "text-teal-100/90" : "text-zinc-400 dark:text-zinc-500"
                                        }`}
                                    >
                                        <span>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {isMine && (
                                            <span className="tracking-tighter font-medium ml-0.5">
                                                {msg.read ? "✓✓" : "✓"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} className="h-px w-full" />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="relative flex items-end gap-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-1.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-shadow">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 resize-none py-2.5 px-3 shadow-none text-sm leading-relaxed"
                        rows={1}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!content.trim() || sendMutation.isPending}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors mb-0.5 mr-0.5"
                    >
                        {sendMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4 ml-0.5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
