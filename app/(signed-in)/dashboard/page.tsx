'use client'

import { Channel, ChannelHeader, divMod, useChatContext } from "stream-chat-react"
 11;
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { Window } from "stream-chat-react";
import { MessageList } from "stream-chat-react";
import { MessageInput } from "stream-chat-react";
import { Thread } from "stream-chat-react";

function Dashboard() {

  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  const handleCall = () => {
    console.log("Calling...");
  };

  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
    console.log("No active Chat or User");
    return;
    }
    
    // Confirm before leaving
    const confirm = window.confirm("Are you sure you want to leave the chat?");
    if (!confirm) return; 

    try {
      // Remove current user from the channel using Stream's removeMembers method
      await channel.removeMembers([user.id]);

      // Clea the active channel
      setActiveChannel(undefined);

      // Rediect to dashboard after leaving
      router.push("/dashboard");  
    } catch (error) {
      console.error("Error leaving chat:", error);
      // You could add a toast notification here for better UX
    }
  };

  return (
    <div className="flex flex-col w-full f;ex-1">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex items-center justify-between">
              {channel.data?.member_count === 1 ? (
                <ChannelHeader title="You are the only one in this chat!"/>
              ) : (
                <ChannelHeader />
              )}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCall}>
                  <VideoIcon className="h-4 w-4" />
                  Video Call
                </Button>

                <Button 
                variant="outline" 
                onClick={handleLeaveChat}
                className="text-red-500 hover:text-red-600 hover:bg-red-50
                dark:hover:bg-red-950"
                >
                   <LogOutIcon className="h-4 w-4" />
                    Leave Chat
                </Button>
              </div>
              </div>

              <MessageList/>

              <div className="sticky bottom-0 w-full">
                <MessageInput />  
              </div>
            
          </Window>
          <Thread/>
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground">
            Select a chat from the sidebar or start new conversation
            </p>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
