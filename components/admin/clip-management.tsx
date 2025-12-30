'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, ChevronRight, Trash2, MoreVertical, Loader2, ChevronLeft } from 'lucide-react';
import { animationStyles } from './animations';
import { getClips, deleteClip, type Clip, type ClipsResponse } from '@/app/services/admin/dashboard.service';

const clipsData = [
  {
    id: 'C001',
    title: 'Luxury Penthouse Tour',
    creator: 'Creator Alpha',
    views: 5420,
    likes: 342,
    status: 'published',
    uploadDate: '2024-01-15',
    duration: '3:45',
    thumbnail: '🏠',
  },
  {
    id: 'C002',
    title: 'Modern Downtown Loft',
    creator: 'Creator Beta',
    views: 3210,
    likes: 198,
    status: 'published',
    uploadDate: '2024-01-14',
    duration: '2:30',
    thumbnail: '🏢',
  },
  {
    id: 'C003',
    title: 'Beach House Review',
    creator: 'Creator Gamma',
    views: 1540,
    likes: 87,
    status: 'pending-review',
    uploadDate: '2024-01-13',
    duration: '4:15',
    thumbnail: '🌊',
  },
  {
    id: 'C004',
    title: 'Suburban Family Home',
    creator: 'Creator Delta',
    views: 4230,
    likes: 256,
    status: 'published',
    uploadDate: '2024-01-12',
    duration: '3:20',
    thumbnail: '🏡',
  },
  {
    id: 'C005',
    title: 'Commercial Space Showcase',
    creator: 'Creator Alpha',
    views: 2180,
    likes: 145,
    status: 'flagged',
    uploadDate: '2024-01-11',
    duration: '5:00',
    thumbnail: '🏗️',
  },
];

const ITEMS_PER_PAGE = 5;

export function ClipsManagement() {
  const { toast } = useToast();
  const [clips, setClips] = useState<Clip[]>([]);
  const [clipStats, setClipStats] = useState({ totalClips: 0, published: 0, pendingReview: 0, totalViews: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clipToDelete, setClipToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClips();
        setClips(data.posts);
        setClipStats(data.stats);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch clips';
        setError(errorMessage);
        console.error('Error fetching clips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  const filteredClips = clips.filter((clip) => {
    const matchesSearch =
      clip.clip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clip.creator.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && clip.status.toLowerCase() === activeTab.toLowerCase();
  });

  const totalPages = Math.ceil(filteredClips.length / ITEMS_PER_PAGE);
  const paginatedClips = filteredClips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const openDeleteDialog = (clipId: number, clipName: string) => {
    setClipToDelete({ id: clipId, name: clipName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteClip = async () => {
    if (!clipToDelete) return;

    try {
      setDeleting(true);
      await deleteClip(clipToDelete.id);
      
      // Remove deleted clip from state
      const updatedClips = clips.filter((clip) => clip.id !== clipToDelete.id);
      setClips(updatedClips);
      
      // Update stats
      const updatedStats = {
        ...clipStats,
        totalClips: clipStats.totalClips - 1,
        published: clipStats.published - (clips.find(c => c.id === clipToDelete.id)?.status === 'published' ? 1 : 0),
        pendingReview: clipStats.pendingReview - (clips.find(c => c.id === clipToDelete.id)?.status === 'pending-review' ? 1 : 0),
      };
      setClipStats(updatedStats);
      
      // Close detail view if deleted clip was selected
      if (selectedClip?.id === clipToDelete.id) {
        setSelectedClip(null);
      }
      
      toast({
        title: "Success",
        description: `Clip "${clipToDelete.name}" deleted successfully`,
      });
      
      // Close dialog
      setDeleteDialogOpen(false);
      setClipToDelete(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete clip';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error deleting clip:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="p-8 space-y-6 bg-[#F9F6F1]">
      <div>
        <h1 className="text-3xl font-bold text-black">Clips Management</h1>
        <p className="text-black mt-2">View, moderate, and manage all clips and posts on the platform.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
            <p className="text-gray-600">Loading clips...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      ) : selectedClip ? (
        <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
        <CardHeader className="p-0 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedClip(null)}
            className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-white py-2 px-2 h-auto"
          >
            ← Back to List
          </Button>
          <CardTitle className="text-black">{selectedClip.clip}</CardTitle>
          <CardDescription>By {selectedClip.creator}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Views</p>
              <p className="text-2xl font-bold text-black">{selectedClip.views.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Likes</p>
              <p className="text-2xl font-bold text-black">{selectedClip.likes}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-black">{selectedClip.duration}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-xl font-bold ${selectedClip.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                {selectedClip.status}
              </p>
            </div>
          </div>

          {/* Media Slider */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-black mb-4">Media</h3>
            {selectedClip.imagesUrl.length > 0 || selectedClip.videoUrl ? (
              <div className="space-y-4">
                {/* Image/Video Display */}
                <div className="relative bg-black rounded-lg overflow-hidden h-96">
                  {selectedClip.videoUrl && currentImageIndex === selectedClip.imagesUrl.length ? (
                    <video
                      src={selectedClip.videoUrl}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : selectedClip.imagesUrl.length > 0 ? (
                    <img
                      src={selectedClip.imagesUrl[currentImageIndex]}
                      alt={`${selectedClip.clip} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <video
                        src={selectedClip.videoUrl || ""}
                        className="w-full h-full object-contain"
                        controls
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => {
                      const maxIndex = (selectedClip.imagesUrl.length || 0) + (selectedClip.videoUrl ? 1 : 0);
                      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
                    }}
                    disabled={currentImageIndex === 0}
                    variant="outline"
                    className="bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </Button>

                  <div className="text-sm text-gray-600">
                    {currentImageIndex + 1} / {(selectedClip.imagesUrl.length || 0) + (selectedClip.videoUrl ? 1 : 0)}
                  </div>

                  <Button
                    onClick={() => {
                      const maxIndex = (selectedClip.imagesUrl.length || 0) + (selectedClip.videoUrl ? 1 : 0);
                      setCurrentImageIndex(Math.min(maxIndex - 1, currentImageIndex + 1));
                    }}
                    disabled={currentImageIndex >= ((selectedClip.imagesUrl.length || 0) + (selectedClip.videoUrl ? 1 : 0) - 1)}
                    variant="outline"
                    className="bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={18} />
                  </Button>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedClip.imagesUrl.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        currentImageIndex === idx ? 'border-[#6F8375]' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {selectedClip.videoUrl && (
                    <button
                      onClick={() => setCurrentImageIndex(selectedClip.imagesUrl.length)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden flex items-center justify-center ${
                        currentImageIndex === selectedClip.imagesUrl.length ? 'border-[#6F8375]' : 'border-gray-300'
                      } bg-black`}
                    >
                      <span className="text-white text-xs">Video</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No media available</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-2">Upload Date</p>
            <p className="text-black">{selectedClip.date}</p>
          </div>

            <div className="flex gap-3 pt-4">
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                    onClick={() => openDeleteDialog(selectedClip.id, selectedClip.clip)}
                    disabled={deleting}
                  >
                    <Trash2 size={18} />
                    Delete Clip
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Clip</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{clipToDelete?.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteClip}
                      disabled={deleting}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-white p-6 rounded-lg shadow-md border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium text-black">Total Clips</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl font-bold text-black">{clipStats.totalClips}</div>
                <p className="text-xs text-gray-600">All platform clips</p>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 rounded-lg shadow-md border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium text-black">Published</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl font-bold text-black">{clipStats.published}</div>
                <p className="text-xs text-gray-600">Live on platform</p>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 rounded-lg shadow-md border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium text-black">Pending Review</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl font-bold text-black">{clipStats.pendingReview}</div>
                <p className="text-xs text-gray-600">Awaiting moderation</p>
              </CardContent>
            </Card>

            <Card className="bg-white p-6 rounded-lg shadow-md border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium text-black">Total Views</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl font-bold text-black">{clipStats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-gray-600">All time views</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'published', 'pending-review'].map((status) => (
              <Button
                key={status}
                onClick={() => {
                  setActiveTab(status);
                  setCurrentPage(1);
                }}
                variant={activeTab === status ? 'default' : 'outline'}
                className={
                  activeTab === status
                    ? 'bg-[#6F8375] text-white border-[#6F8375]'
                    : 'bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white hover:border-[#6F8375]'
                }
              >
                {status === 'pending-review' ? 'Pending Review' : status === 'flagged' ? 'Flagged' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 shadow-md">
                <Search size={18} className="text-gray-600" />
                <Input
                  placeholder="Search by clip title or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent text-black placeholder:text-gray-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="">
                      <th className="text-left py-3 px-4 font-semibold text-black">Clip</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Creator</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Views</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Likes</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-black"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClips.map((clip, idx) => (
                      <tr
                        key={`${clip.clip}-${idx}`}
                        className={`hover:bg-gray-50 transition-colors border-b border-gray-100 animate-scale-in table-row-${idx % 5} cursor-pointer`}
                        onClick={() => setSelectedClip(clip)}
                      >
                        <td className="py-3 px-4 text-black">
                          <div className="flex items-center gap-2">
                            {clip.imagesUrl && clip.imagesUrl.length > 0 ? (
                              <img src={clip.imagesUrl[0]} alt="thumbnail" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <span className="text-xl">📹</span>
                            )}
                            <span className="font-medium">{clip.clip}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-black">{clip.creator}</td>
                        <td className="py-3 px-4 text-black">{clip.views.toLocaleString()}</td>
                        <td className="py-3 px-4 text-black">{clip.likes}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(clip.status)}`}>
                            {clip.status === 'pending-review' ? 'Pending' : clip.status.charAt(0).toUpperCase() + clip.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-black">{clip.date}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedClip(clip)}
                            className="text-gray-900 hover:text-gray-600 transition-colors"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-4"
                  >
                    ← Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? 'default' : 'outline'}
                        className={
                          currentPage === page
                            ? 'bg-[#6F8375] text-white border-[#6F8375] min-w-10 h-10 rounded-full'
                            : 'bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white min-w-10 h-10 rounded-full'
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-4"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </>
  );
}
