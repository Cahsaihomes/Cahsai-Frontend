"use client";

"use client";

import MessageScreen from "@/components/ui/MessageScreen";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";



export default function ChatPage() {
  // Get current user id from redux
  const currentUserId = useSelector((state: any) => state.auth.user?.id);
  // Get receiverId and roomId from params
  const searchParams = useSearchParams();
  const receiverIdRaw = searchParams.get("receiverId");
  const roomIdRaw = searchParams.get("roomId");
  const receiverId = receiverIdRaw === null ? undefined : receiverIdRaw;
  // Fallback: use currentUserId as roomId if not provided
  const roomId = roomIdRaw === null ? currentUserId : roomIdRaw;

  if (!currentUserId || !roomId) {
    return (
      <div className="p-8 text-center text-red-600">
        Chat cannot be loaded: Missing user or room information.<br />
        Please check your login and URL parameters.
      </div>
    );
  }

  return (
    <MessageScreen
      messages={[]}
      currentUserId={currentUserId}
      receiverId={receiverId}
      roomId={roomId}
    />
  );
}
