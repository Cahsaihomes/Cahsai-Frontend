"use client";

import { useState, useEffect } from "react";
import { getSocket } from "@/services/socketClient";
import { useRouter, usePathname } from "next/navigation";
import {
  Send,
  Paperclip,
  EllipsisVertical,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";



export interface Message {
  id: number;
  name: string;
  time: string;
  channel: "Agent" | "Creator" | "Buyer";
  preview: string;
  avatar: string;
  content?: string; // for chat messages
  chatId?: string | number; // for clearing selected contact chat
  type?: 'text' | 'call' | 'image' | 'video'; // message type
  senderId?: string | number; // sender user id
  sender?: {
    id: string | number;
    first_name?: string;
    last_name?: string;
    user_name?: string;
    avatarUrl?: string;
    role?: string;
  };
}

interface MessageScreenProps {
  messages: Message[];
  currentUserId?: string | number;
  receiverId?: string | number;
  roomId?: string | number;
}

export default function MessageScreen({ messages, currentUserId, receiverId, roomId }: MessageScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleClearChat = () => {
    setMenuOpen(false);
    const selectedContact = contacts.find(c => c.id === activeMessage);
    const chatIdToClear = selectedContact?.chatId || roomId;
    if (!chatIdToClear) return;
    const socket = getSocket();
    socket.emit("clearChat", { chatId: chatIdToClear });
  };
  useEffect(() => {
    const socket = getSocket();
    socket.on("chatCleared", ({ chatId }: { chatId: string }) => {
      if (String(chatId) === String(roomId)) {
        setChatMessages([]);
      }
    });
    return () => {
      socket.off("chatCleared");
    };
  }, [roomId]);
  useEffect(() => {
    const socket = getSocket();
    socket.on("chatCleared", ({ chatId }: { chatId: string }) => {
      if (String(chatId) === String(roomId)) {
        setChatMessages([]);
      }
    });
    return () => {
      socket.off("chatCleared");
    };
  }, [roomId]);
  const [messageInput, setMessageInput] = useState("");
  const [activeMessage, setActiveMessage] = useState<number>(() => {
    return receiverId ? Number(receiverId) : (messages[0]?.id || 1);
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [isLgUp, setIsLgUp] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  const [contacts, setContacts] = useState<Message[]>(messages);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const md = window.innerWidth >= 768;
      const lg = window.innerWidth >= 1024;
      setIsLgUp(lg);
      setShowChat(md);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (receiverId) {
      setActiveMessage(Number(receiverId));
    }
  }, [receiverId]);

  const handleSendMessage = () => {
    if (!roomId || !currentUserId || !messageInput.trim()) return;
    const socket = getSocket();
    
    console.log("Sending message:", {
      chatId: roomId,
      senderId: currentUserId,
      content: messageInput.trim(),
    });
    
    socket.emit("sendMessage", {
      chatId: roomId,
      senderId: currentUserId,
      content: messageInput.trim(),
    });
    setMessageInput("");
  };
  useEffect(() => {
    const socket = getSocket();
    
    if (roomId) {
      socket.emit("joinRoom", { chatId: roomId });
    }
    
    if (currentUserId) {
      socket.emit("getContactList", { userId: currentUserId });
    }
    socket.on("contactList", (data: { contacts: any[] }) => {
      const mappedContacts = data.contacts.map((c) => {
        const latestMsg = c.messages?.[0];
        let preview = '';
        if (latestMsg) {
          if (latestMsg.type === 'call') {
            if (latestMsg.content === 'missed') preview = 'Missed Call';
            else if (latestMsg.content === 'outgoing') preview = 'Outgoing Call';
            else if (latestMsg.content === 'incoming') preview = 'Incoming Call';
            else preview = 'Call';
          } else {
            if (latestMsg.senderId === currentUserId) {
              preview = `You: ${latestMsg.content || ''}`;
            } else {
              preview = `${c.contact?.first_name || 'Sender'}: ${latestMsg.content || ''}`;
            }
          }
        }
        return {
          id: c.contact?.id || c.chatId,
          name: c.contact?.first_name ? `${c.contact.first_name} ${c.contact.last_name ?? ''}` : 'Unknown',
          time: latestMsg?.time || '',
          channel: c.contactRole || 'Agent',
          preview,
          avatar: c.contact?.avatarUrl || '/images/avatarr.png',
          chatId: c.chatId,
          messages: c.messages || [],
        };
      });
      
      setContacts(mappedContacts);
      
      // If no specific chat is selected and we have contacts, auto-select the first one
      if (!roomId && mappedContacts.length > 0) {
        const firstContact = mappedContacts[0];
        const newReceiverId = firstContact.id;
        const newRoomId = firstContact.chatId || firstContact.id;
        
        // Determine the current dashboard type from pathname
        const basePath = pathname.includes('/buyerdashboard') 
          ? '/buyerdashboard/messages' 
          : pathname.includes('/creatordashboard')
          ? '/creatordashboard/messages'
          : pathname.includes('/agentdashboard')
          ? '/agentdashboard/messages'
          : '/buyerdashboard/messages'; // fallback
        
        router.push(`${basePath}?receiverId=${newReceiverId}&roomId=${newRoomId}`);
      }
    });

    // Get chat history for room
    if (roomId) {
      socket.emit("getHistory", { chatId: roomId, limit: 50 });
    }
    socket.on("history", ({ chatId, messages }: { chatId: string; messages: Message[] }) => {
      setChatMessages(messages);
    });

    // Listen for room join confirmation
    socket.on("joinedRoom", ({ chatId }: { chatId: string }) => {
      console.log(`Joined room for chat: ${chatId}`);
    });

    // Listen for new messages
    socket.on("receiveMessage", (msg: Message) => {
      console.log("Received new message:", msg);
      setChatMessages((prev) => [...prev, msg]);
    });
    
    // Listen for errors
    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.off("contactList");
      socket.off("history");
      socket.off("receiveMessage");
      socket.off("joinedRoom");
      socket.off("error");
    };
  }, [currentUserId, roomId]);


  useEffect(() => {
    const socket = getSocket();
    socket.on("chatCleared", ({ chatId }: { chatId: string }) => {
      if (String(chatId) === String(roomId)) {
        setChatMessages([]);
      }
    });
    return () => {
      socket.off("chatCleared");
    };
  }, [roomId]);

  const currentMessage =
    contacts.find((msg) => msg.id === activeMessage) || contacts[0];


  return (
    <div className="h-screen flex flex-col rounded-lg p-1 md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,280px),1fr] h-full overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside
          className={`bg-white border-r flex-col overflow-y-auto transition-all ${
            showChat ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center justify-between p-4 font-semibold text-gray-700 border-b relative">
            <span>Messages</span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="rounded hover:bg-gray-100 p-1"
                aria-label="Messages menu"
              >
                <EllipsisVertical className="w-5 h-5 text-gray-500" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      // Navigate to the selected chat with proper parameters
                      if (currentMessage) {
                        const newReceiverId = currentMessage.id;
                        const newRoomId = currentMessage.chatId || currentMessage.id;
                        
                        // Determine the current dashboard type from pathname
                        const basePath = pathname.includes('/buyerdashboard') 
                          ? '/buyerdashboard/messages' 
                          : pathname.includes('/creatordashboard')
                          ? '/creatordashboard/messages'
                          : pathname.includes('/agentdashboard')
                          ? '/agentdashboard/messages'
                          : '/buyerdashboard/messages'; // fallback
                        
                        router.push(`${basePath}?receiverId=${newReceiverId}&roomId=${newRoomId}`);
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Select Chat
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Clear Chat
                  </button>

                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                  <p className="text-sm">Start a conversation to see your messages here.</p>
                </div>
              </div>
            ) : (
              contacts.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-[#DFE2E0] ${
                    activeMessage === m.id
                      ? "bg-[#DFE2E0] border-l-2 border-[#6F8375]"
                      : ""
                  }`}
                  onClick={() => {
                  // Navigate to the correct URL with receiverId and roomId
                  const newReceiverId = m.id;
                  const newRoomId = m.chatId || m.id;
                  
                  // Determine the current dashboard type from pathname
                  const basePath = pathname.includes('/buyerdashboard') 
                    ? '/buyerdashboard/messages' 
                    : pathname.includes('/creatordashboard')
                    ? '/creatordashboard/messages'
                    : pathname.includes('/agentdashboard')
                    ? '/agentdashboard/messages'
                    : '/buyerdashboard/messages'; // fallback
                  
                  router.push(`${basePath}?receiverId=${newReceiverId}&roomId=${newRoomId}`);
                  setActiveMessage(m.id);
                  setShowChat(true);
                }}
              >
                <Image
                  src={m.avatar}
                  alt={m.name}
                  width={36}
                  height={36}
                  className="rounded-full object-contain"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">
                        {m.name}
                      </p>
                      <span className="text-xs text-gray-400">{m.time}</span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        m.channel === "Agent"
                          ? "text-[#007FBF] bg-blue-100 px-2 py-0.5 rounded-full"
                          : "text-[#00BF20] bg-green-100 px-2 py-0.5 rounded-full"
                      }`}
                    >
                      {m.channel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 break-words whitespace-normal mt-1">
                    {m.preview}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>
        </aside>

        {/* MIDDLE CHAT */}
        {showChat && (
          <main className="flex-1 flex flex-col overflow-y-auto bg-white">
            {!currentMessage ? (
              // Show when no conversation is selected
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a conversation from the sidebar to start chatting.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-3.5 border-b flex items-center gap-3">
                  <div className="md:hidden">
                    <button
                      onClick={() => setShowChat(false)}
                      className="rounded hover:bg-gray-100 p-1"
                      aria-label="Back to messages"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <Image
                    src={currentMessage?.avatar || "/images/avatarr.png"}
                    alt={currentMessage?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-contain"
                  />
                  <div className="flex-1">
                    <div className="hidden lg:block">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-800">
                          {currentMessage?.name}
                        </p>
                      </div>
                      <div className="block lg:hidden">
                        <p className="font-semibold text-gray-800">
                          {currentMessage?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <p className="font-xs text-gray-600">Last Time</p>
              </div>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400">No messages yet.</div>
              ) : (
                [...chatMessages]
                  .sort((a, b) => {
                    // If time is a string, convert to Date for comparison
                    const timeA = a.time ? new Date(a.time).getTime() : 0;
                    const timeB = b.time ? new Date(b.time).getTime() : 0;
                    return timeA - timeB;
                  })
                  .map((msg, idx) => {
                  // Use message.sender.id for sent/received logic
                  const isSent = msg.sender && msg.sender.id === currentUserId;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 ${isSent ? 'justify-end' : ''}`}
                      style={{ flexDirection: isSent ? 'row-reverse' : 'row' }}
                    >
                      <Image
                        src={msg.sender?.avatarUrl || "/images/avatarr.png"}
                        alt={msg.sender?.user_name || msg.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full object-contain"
                      />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {msg.sender?.user_name || msg.name} · {msg.time}
                        </p>
                        <div
                          className={`max-w-xs md:max-w-lg px-3 py-2 rounded-lg ${
                            isSent
                              ? 'bg-blue-100 text-blue-800 ml-auto'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{msg.content ?? msg.preview}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {/* Chat Input */}
            <div className="p-3 border-t flex items-center gap-2 bg-white">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pr-10 pl-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={e => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <button
                className="p-2 bg-[#6F8375] text-white rounded hover:bg-[#40bcd8]"
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
              </>
            )}
          </main>
        )}
      </div>

    </div>
  );
}
