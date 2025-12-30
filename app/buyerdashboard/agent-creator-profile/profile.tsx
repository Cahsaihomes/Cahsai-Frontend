"use client";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getUserProfileOverview } from "@/app/services/userProfile.service";
import { followUnfollowUser } from "@/app/services/auth.service";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux";
import { toast } from "sonner";

import PropertyCard from '@/components/Cards/PropertyCard';
import { useRouter } from 'next/navigation';
import { SocketProvider, useSocket } from '@/context/SocketContext';


function AgentCreatorPageInner() {

  const { chatId, createOrGetRoom, messages, sendMessage, loading: chatLoading } = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  // Get current user id from redux
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const [loadingFollow, setLoadingFollow] = useState(false);
  console.log("Profile Data:", profile);

  const handleCreateChat = () => {
    if (!currentUserId || !profile?.data?.user?.id) return;
    createOrGetRoom(Number(currentUserId), Number(profile.data.user.id));
  };

  // Redirect to messages when chatId is available
  useEffect(() => {
    if (chatId && profile?.data?.user?.id) {
      router.push(`/buyerdashboard/messages?receiverId=${profile.data.user.id}&roomId=${chatId}`);
    }
  }, [chatId, profile?.data?.user?.id, router]);

  useEffect(() => {
    if (id) {
      getUserProfileOverview(id).then((data) => {
        setProfile(data);
        // Check if current user is in followers_ids array from fetched data
        const followers = data?.data?.user?.followers_ids || [];
        setIsFollowing(currentUserId && followers.includes(currentUserId));
      });
    }
  }, [id, currentUserId]);
  const handleFollowUnfollow = async () => {
    if (!id) return;
    setLoadingFollow(true);
    try {
      await followUnfollowUser(id);
      const didFollow = !isFollowing;
      setIsFollowing((prev) => !prev);
      setProfile((prev: any) => {
        if (!prev) return prev;
        let followers = prev.data.user.followers_ids || [];
        let following = prev.data.user.following_ids || [];
        if (didFollow && currentUserId) {
          followers = [...followers, currentUserId];
        } else if (!didFollow && currentUserId) {
          followers = followers.filter((fid: any) => fid !== currentUserId);
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            user: {
              ...prev.data.user,
              followers_ids: followers,
              following_ids: following,
            }
          }
        };
      });
      toast(didFollow ? "You are now following this user." : "You have unfollowed this user.");
    } finally {
      setLoadingFollow(false);
    }
  };
  return (
    <div className="min-h-screen bg-white rounded-xl overflow-hidden flex flex-col">
      <div className="relative flex flex-col items-center pt-10 pb-8">
        <button
          className="absolute left-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-transparent"
          onClick={() => router.push('/buyerdashboard/home-screen')}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
  <h2 className="text-2xl font-semibold mb-6">{profile?.data?.user ? `${profile.data.user.first_name} ${profile.data.user.last_name}` : "User"}</h2>
        <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
          <Image 
            src={profile?.data?.user?.avatarUrl || "/images/avatar.jpg"} 
            alt="Profile" 
            width={96} 
            height={96} 
            className="object-cover aspect-square w-full h-full rounded-full" 
          />
        </div>

        <div className="flex gap-16 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{profile?.data?.postCount ?? 0}</span>
            <span className="text-base text-gray-500">Total Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{Array.isArray(profile?.data?.user?.followers_ids) ? profile.data.user.followers_ids.length : 0}</span>
            <span className="text-base text-gray-500">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{Array.isArray(profile?.data?.user?.following_ids) ? profile.data.user.following_ids.length : 0}</span>
            <span className="text-base text-gray-500">Following</span>
          </div>
        </div>
        <div className="flex gap-6">
          <Button
            className={`px-10 py-2 text-base rounded-lg ${isFollowing ? 'bg-white text-black border border-[#6F8375] hover:text-white' : 'bg-[#6F8375] text-white '} `}
            disabled={loadingFollow}
            onClick={handleFollowUnfollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
          <Button
            onClick={handleCreateChat}
            variant="outline"
            className="px-10 py-2 text-base rounded-lg border-gray-300"
            disabled={chatLoading}
          >
            {chatLoading ? "Starting Chat..." : "Message"}
          </Button>
        </div>
      </div>
      <div className="border-b border-gray-200 mx-8 mb-10" />
      <div className="flex-1 px-8 pb-8">
        <div className="overflow-y-auto" >
          <div className="grid grid-cols-2 gap-6">
            {profile?.data?.posts?.map((post: any) => (
              <PropertyCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  price: post.price,
                  location: post.location,
                  city: post.city,
                  description: post.description,
                  bedrooms: post.bedrooms,
                  bathrooms: post.bathrooms,
                  tags: post.tags,
                  homeStyle: post.homeStyle,
                  amenities: post.amenities,
                  images: post.images,
                  video: post.video,
                  isPromoted: post.isPromoted,
                  createdAt: post.createdAt,
                  user: post.user,
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function AgentCreatorPage() {
  return (
    <SocketProvider>
      <AgentCreatorPageInner />
    </SocketProvider>
  );
}
