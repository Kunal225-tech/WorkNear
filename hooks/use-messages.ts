import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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

export const messageKeys = {
  all: ["messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
};

async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/messages");
  if (!res.ok) throw new Error("Failed to fetch conversations");
  const json = await res.json();
  return json.data as Conversation[];
}

/** Fetch all inbox conversations with 15s polling */
export function useConversations() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: fetchConversations,
    enabled: !!session?.user,
    refetchInterval: 15000,
    staleTime: 5000,
  });
}

/** Returns total unread message count across all conversations */
export function useUnreadMessageCount(): number {
  const { data: conversations = [] } = useConversations();
  return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
}
