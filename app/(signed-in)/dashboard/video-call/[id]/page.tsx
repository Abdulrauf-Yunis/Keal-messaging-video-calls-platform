"use client"

import { InlineSpinner } from "@/components/LoadingSpinner";
import { StatusCard } from "@/components/StatusCard";
import { useSidebar } from "@/components/ui/sidebar";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";

function VideoCall() {
  const { useCallCallingState, useParticipants} = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const router = useRouter();
  const [ConvexProvider, setCopied] = useState(false);
  const {setOpen} = useSidebar();

  const handleLeave = () => {
    router.push("/dashboar");
    setOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (callingState === CallingState.JOINING) {
    return (
      <StatusCard
        title="Joining call..."
        description="Please wait while we connect you to the call."
        className="bg-gray=50 rounded-lg"
      >
        <InlineSpinner size="lg" />
      </StatusCard>  
    )
  }

  return <div>VideoCall</div>
}

export default VideoCall
