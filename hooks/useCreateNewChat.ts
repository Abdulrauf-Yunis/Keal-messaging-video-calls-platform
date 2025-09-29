import streamClient from "@/lib/stream";
import { create } from "domain";

export const useCreateNewChat = () => {
    const createNewChat = async ({ 
        members,
        createdBy,
        groupName,
    }: {
        members: string[];
        createdBy: string;
        groupName?: string; // Optional for group chats
    }) => {
        const isGroupChat = members.length > 2; // More than 2 members indicates a group chat

        // Only check for existing one-on-one chats
        if (!isGroupChat) {
            const existingChannel = await streamClient.queryChannels(
                {
                type: "messaging",
                members: { $eq: members },
            }, 
            { created_at: -1 }, 
            { limit: 1 } 
        );

        if (existingChannel.length > 0) {
            const channel = existingChannel[0];
            const channelMembers = Object.keys(channel.state.members); 

            // For one-on-one chats, ensure the channel has exactly the two members
            if (
                channelMembers.length === 2 &&
                members.length === 2 &&
                members.every(member => channelMembers.includes(member))
            ) {
                console.log("One-on-one chat found");
                return channel;
            }
        }
    }

    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`; // Unique channel ID
    
    try {
        //Create channel with appropriate configurations for group vs one-on-one chat
        const channelData: {
            members: string[];
            name?: string;
            created_by_id: string;
        } = {
            members,
            created_by_id: createdBy,
        };

        // For group chats, include the group specific metadata
        if (isGroupChat) {
            channelData.name =
             groupName || `gROUP CHAT (${members.length} members)`;
        }

        const channel = streamClient.channel(
            isGroupChat ? "team" : "messaging", 
            channelId, 
            channelData
        );

        await channel.watch({
            presence: true,
        });

        return channel;
    } catch (error) {   
        throw error;
    }
 };

 return createNewChat;
};

            

