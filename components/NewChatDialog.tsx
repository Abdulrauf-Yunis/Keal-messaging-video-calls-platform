'use client'

import { useState } from "react"
import { Doc } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useChatContext } from "stream-chat-react"
import { useCreateNewChat } from "@/hooks/useCreateNewChat"

export function NewChatDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Doc<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const { setActiveChannel } = useChatContext();

  return  <>{children}</>;
}