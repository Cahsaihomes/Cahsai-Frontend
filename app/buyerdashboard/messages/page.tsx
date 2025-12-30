"use client";


import MessageScreen from "@/components/ui/MessageScreen";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

interface Message {
  id: number;
  name: string;
  time: string;
  channel: "Agent" | "Creator" | "Buyer";
  preview: string;
  avatar: string;
}

const messages: Message[] = [

];

export default function ChatPage() {
  // Get current user id from redux
  const currentUserId = useSelector((state: any) => state.auth.user?.id);
  // Get receiverId and roomId from params
  const searchParams = useSearchParams();
  const receiverIdRaw = searchParams.get("receiverId");
  const roomIdRaw = searchParams.get("roomId");
  const receiverId = receiverIdRaw === null ? undefined : receiverIdRaw;
  const roomId = roomIdRaw === null ? undefined : roomIdRaw;

  // Always render MessageScreen - it will handle fetching contacts and showing appropriate UI
  return (
    <MessageScreen
      messages={messages}
      currentUserId={currentUserId}
      receiverId={receiverId}
      roomId={roomId}
    />
  );
}
