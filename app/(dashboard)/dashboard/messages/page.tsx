"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";

interface Conversation {
    jobId: string;
    jobTitle: string;
    jobStatus: string;
    otherParticipant: {
        id: string;
        name: string;
        profileImage: string;
    };
    latestMessage: {
        content: string;
        createdAt: string;
        read: boolean;
        isMine: boolean;
    };
    unreadCount: number;
}

export default function InboxPage() {
    const { t } = useI18n();

    const { data: conversations = [], isLoading, isError } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const res = await axios.get("/api/messages");
            return res.data.data as Conversation[];
        },
        refetchInterval: 10000, // refresh inbox every 10 seconds
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View active conversations for your assigned and completed jobs.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : isError ? (
                <div className="p-6 text-center text-destructive bg-destructive/10 rounded-xl">
                    Failed to load conversations. Please try again.
                </div>
            ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No active conversations</h3>
                    <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                        You can message posters and workers once a job is assigned or completed. Check back later!
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {conversations.map((conv) => (
                        <Link
                            href={`/jobs/${conv.jobId}`}
                            key={conv.jobId}
                            className={`block p-4 rounded-xl border transition-all hover:shadow-md ${
                                conv.unreadCount > 0
                                    ? "bg-white dark:bg-zinc-900 border-teal-200 dark:border-teal-900/50"
                                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shrink-0">
                                        {conv.otherParticipant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {conv.otherParticipant.name}
                                            </h3>
                                            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                                                {conv.jobTitle}
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-1 line-clamp-1 ${conv.unreadCount > 0 ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}`}>
                                            {conv.latestMessage.isMine && <span className="mr-1 text-zinc-400">You:</span>}
                                            {conv.latestMessage.content}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="text-xs text-zinc-400">
                                        {new Date(conv.latestMessage.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                    </span>
                                    {conv.unreadCount > 0 ? (
                                        <span className="h-5 min-w-[20px] rounded-full bg-teal-600 px-1.5 flex items-center justify-center text-[10px] font-bold text-white">
                                            {conv.unreadCount}
                                        </span>
                                    ) : (
                                        <ArrowRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
