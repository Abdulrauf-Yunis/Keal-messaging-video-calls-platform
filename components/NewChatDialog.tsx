'use client'

import { useState } from "react"
import { Doc } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useChatContext } from "stream-chat-react"
import { useCreateNewChat } from "@/hooks/useCreateNewChat"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function NewChatDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Doc<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const { setActiveChannel } = useChatContext();

  const handleSelectUser = (user: Doc<"users">) => {
    // Avoid adding duplicates
    if (!selectedChat.find((u) => u._id === user._id)) {
      setSelectedChat((prev) => [...prev, user]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedChat((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog is closed
      setSelectedChat([]);
      setGroupName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger> 

      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new chat</DialogTitle>
          <DialogDescription>
            Select users to start a new chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          
        </div>
      </DialogContent>
    </Dialog>
  )
}