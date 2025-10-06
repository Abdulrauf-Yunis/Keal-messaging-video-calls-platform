`use client`
import { createToken } from "@/actions/createToken";
import { useUser } from "@clerk/nextjs";
import {
    Call,
    CallingState,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
    throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set");
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { id } = useParams();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client,setClient] = useState<StreamVideoClient | null>(null);

  const streamUser = useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      name:
        user.fullName || user.emailAddresses[0]?.emailAddress || "Unknown User",
        image: user.imageUrl || "",
        type: "authenticated" as const,
    };
  }, [user]);

  // Create token provider function outside of useMemo to avoid calling during render
  const tokenProvider = useCallback(async () => {
    if (!user?.id) {
        throw new Error("User not authenticated"); 
    }
    return await createToken(user.id);
  }, [user?.id]);

  // Initialize client in useEffect to avoid side effects during render
  useEffect(() => {
    if (!streamUser) {
        setClient(null);
        return;
    }

    const newClient = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
        user: streamUser,
        tokenProvider,
    }); 

    setClient(newClient);

    return () => {
        newClient.disconnectUser().catch(console.error);
    };
  }, [streamUser, tokenProvider] );

  useEffect(() => {
    if(!client || !id) return;

    setError(null);
    const streamCall = client.call("default", id as string);

    const joinCall =  async () => {
      try {
        await streamCall.join({ create: true });
        setCall(streamCall);
      } catch (error) {
        console.error("Failed to join call:", error);
        setError(
          error instanceof Error ? error.message : "Failed to join call"
        );
      }
    };

    joinCall();

    // cleanup function 
    return () => {
      if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error);
      }
    }
  }, [id, client]);

  if (!client) {
    return <div>Loading ...Client</div>;
  }

  if (!call) {
    return <div>Loading ...Call</div>;
  }

  return (
   <StreamVideo client={client}>
    <StreamTheme className="text-white">
        <StreamCall call={call}>{children}</StreamCall>
    </StreamTheme>
   </StreamVideo>
  );
}

export default Layout
