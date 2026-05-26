"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Heart, MessageCircle, Share2, MapPin, Bed, Bath, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/app/Utils/post-types";
import { getPostById } from "@/app/services/post.service";
import PropertyCard from "@/components/ui/property-card";
import OptimizedVideoPlayer from "@/components/OptimizedVideoPlayer";
import { useCloudinaryVideo } from "@/hooks/useCloudinaryVideo";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Get user from Redux
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  // Optimize video URL
  const { posterUrl } = useCloudinaryVideo(post?.video || "");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(postId as string);
        setPost(postData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Post not found");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#968470] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <Image
              src="/images/cahsai-logo1.png"
              alt="Cahsai"
              width={150}
              height={50}
              className="mx-auto mb-6"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-lg text-gray-600 mb-2">{error || "Post not found"}</p>
          <p className="text-sm text-gray-500 mb-6">
            The post you're looking for may have been deleted or is no longer available.
          </p>
          <button
            onClick={() => router.push("/watch-homes")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#968470] text-white rounded-lg hover:bg-[#7a6d5e] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Watch Homes
          </button>
        </div>
      </div>
    );
  }

  const isCreator = post?.user?.role === "creator";
  const isAgent = post?.user?.role === "agent";

  const handleAuthenticationRequired = (action: string) => {
    toast.error("Please login first");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      handleAuthenticationRequired("contact agent");
      return;
    }
    // Add your contact agent logic here
    toast.success("Message sent to agent!");
  };

  const handleFollowCreator = () => {
    if (!isAuthenticated) {
      handleAuthenticationRequired("follow creator");
      return;
    }
    // Add your follow creator logic here
    toast.success("Now following creator!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Shared Post Details</h1>
          <div className="w-14"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Images/Video */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-6 bg-gray-100">
              {post.video ? (
                <OptimizedVideoPlayer
                  src={post.video}
                  controls
                  className="w-full h-96 object-cover"
                  poster={posterUrl || post.images?.[0]}
                />
              ) : post.images?.[0] ? (
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Gallery */}
            {post.images && post.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mb-6">
                {post.images.slice(0, 4).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    width={150}
                    height={100}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}

            {/* Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h2>
              
              {/* Price - only show for agents/rentals, not for creators */}
              {!isCreator && post.price && (
                <p className="text-3xl font-bold text-[#968470] mb-4">
                  {post.listing_type === "FOR_RENT" ? `$${post.monthly_rent}/month` : `$${post.price}`}
                </p>
              )}

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{post.location}, {post.city}</span>
              </div>

              {/* Features */}
              {!isCreator && (
                <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-200">
                  {post.bedrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Bedrooms</p>
                        <p className="text-lg font-semibold text-gray-900">{post.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {post.bathrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Bathrooms</p>
                        <p className="text-lg font-semibold text-gray-900">{post.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {post.listing_type && (
                    <div>
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {post.listing_type === "FOR_SALE" ? "For Sale" : post.listing_type === "FOR_RENT" ? "For Rent" : "Stay"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {post.description && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">{post.description}</p>
                </div>
              )}

              {/* Amenities */}
              {post.amenities && post.amenities.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {post.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                        <span className="text-[#968470]">✓</span>
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Agent/Creator Info */}
          <div>
            {/* Agent/Creator Card */}
            {post.user && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  {post.user.avatarUrl && (
                    <Image
                      src={post.user.avatarUrl}
                      alt={`${post.user.first_name} ${post.user.last_name}`}
                      width={60}
                      height={60}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {post.user.first_name} {post.user.last_name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {isCreator ? "Creator" : "Real Estate Agent"}
                    </p>
                  </div>
                </div>

                {/* Agent Buttons */}
                {isAgent && (
                  <>
                    <button 
                      onClick={handleContactAgent}
                      className="w-full bg-[#968470] text-white py-3 rounded-lg font-semibold hover:bg-[#7a6d5e] transition-colors mb-3"
                    >
                      Contact Agent
                    </button>
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          handleAuthenticationRequired("schedule tour");
                          return;
                        }
                        toast.success("Tour scheduled!");
                      }}
                      className="w-full border border-[#968470] text-[#968470] py-3 rounded-lg font-semibold hover:bg-[#968470]/5 transition-colors"
                    >
                      Schedule Tour
                    </button>
                  </>
                )}

                {/* Creator Buttons */}
                {isCreator && (
                  <>
                    <button 
                      onClick={handleFollowCreator}
                      className="w-full bg-[#968470] text-white py-3 rounded-lg font-semibold hover:bg-[#7a6d5e] transition-colors mb-3"
                    >
                      Follow Creator
                    </button>
                    {post.productLink && (
                      <button
                        onClick={() => window.open(post.productLink, "_blank")}
                        className="w-full border border-[#968470] text-[#968470] py-3 rounded-lg font-semibold hover:bg-[#968470]/5 transition-colors flex items-center justify-center gap-2"
                      >
               
                        Shop Look
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Heart className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">{post.likeCount || 0}</p>
                <p className="text-xs text-gray-600">Likes</p>
              </div>
              <div className="text-center">
                <MessageCircle className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">{post.commentCount || 0}</p>
                <p className="text-xs text-gray-600">Comments</p>
              </div>
              <div className="text-center">
                <Share2 className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">{post.shareCount || 0}</p>
                <p className="text-xs text-gray-600">Shares</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
