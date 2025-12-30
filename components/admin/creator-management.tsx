'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ChevronRight, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { animationStyles } from './animations';
import { getCreators, type Creator, type CreatorsResponse } from '@/app/services/admin/dashboard.service';

const creatorData = [
  { id: 1, name: 'Creator Alpha', videos: 245, leads: 1203, earnings: 12500, status: 'active', joinDate: '2023-01-15' },
  { id: 2, name: 'Creator Beta', videos: 198, leads: 987, earnings: 10200, status: 'active', joinDate: '2023-02-20' },
  { id: 3, name: 'Creator Gamma', videos: 45, leads: 156, earnings: 1800, status: 'flagged', joinDate: '2023-11-10' },
  { id: 4, name: 'Creator Delta', videos: 176, leads: 856, earnings: 8900, status: 'active', joinDate: '2023-03-05' },
];

const videoViewsData = [
  { month: 'Jan', views: 4000 },
  { month: 'Feb', views: 5200 },
  { month: 'Mar', views: 6100 },
  { month: 'Apr', views: 7800 },
  { month: 'May', views: 9200 },
  { month: 'Jun', views: 11500 },
];

const ITEMS_PER_PAGE = 5;

export function CreatorManagement() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailTab, setDetailTab] = useState('performance');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCreators();
        setCreators(data.creators);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch creators';
        setError(errorMessage);
        console.error('Error fetching creators:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  // Reset detail tab to performance when a new creator is selected
  useEffect(() => {
    if (selectedCreator) {
      setDetailTab('performance');
      console.log('Selected creator:', selectedCreator);
    }
  }, [selectedCreator]);

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && creator.status === activeTab;
  });

  const totalPages = Math.ceil(filteredCreators.length / ITEMS_PER_PAGE);
  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="p-8 space-y-6 bg-[#F9F6F1]">
        <div>
          <h1 className="text-3xl font-bold text-black">Creator Management</h1>
          <p className="text-black mt-2">Monitor and manage all content creators on the platform.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
              <p className="text-gray-600">Loading creators...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : selectedCreator ? (
          <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
          <CardHeader className="p-0 mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedCreator(null)}
              className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-white py-2 px-2 h-auto"
            >
              ← Back to List
            </Button>
            <CardTitle className="text-black">{selectedCreator.name}</CardTitle>
            <CardDescription>Creator since {selectedCreator.creatorSince}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Videos Uploaded</p>
                <p className="text-2xl font-bold text-black">{selectedCreator.stats.videosUploaded}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Leads Generated</p>
                <p className="text-2xl font-bold text-black">{selectedCreator.stats.leadsGenerated}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-black">{selectedCreator.stats.totalEarnings}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {['performance', 'engagement', 'payout'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    detailTab === tab
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tab === 'performance' ? 'Performance' : tab === 'engagement' ? 'Engagement' : 'Payout'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {detailTab === 'performance' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-sm text-gray-600 mb-2">Total Views</p>
                  <p className="text-3xl font-bold text-black">{selectedCreator.performanceGraph.totalViews.toLocaleString()}</p>
                </div>
              </div>
            )}

            {detailTab === 'engagement' && (
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-md">
                  <span className="text-black">Avg Engagement Rate</span>
                  <span className="font-semibold text-black">{selectedCreator.engagement.avgEngagementRate}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-md">
                  <span className="text-black">Avg Video Length</span>
                  <span className="font-semibold text-black">{selectedCreator.engagement.avgVideoLength}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-md">
                  <span className="text-black">Upload Frequency</span>
                  <span className="font-semibold text-black">{selectedCreator.engagement.uploadFrequency}</span>
                </div>
              </div>
            )}

            {detailTab === 'payout' && (
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-md">
                  <span className="text-black">Total Paid</span>
                  <span className="font-semibold text-black">{selectedCreator.payout.totalPaid}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-md">
                  <span className="text-black">Pending Payout</span>
                  <span className="font-semibold text-black">{selectedCreator.payout.pendingPayout}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {/* Promote and Flag buttons removed as per requirements */}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'active', 'flagged'].map((tab) => (
              <Button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                variant={activeTab === tab ? 'default' : 'outline'}
                className={
                  activeTab === tab
                    ? 'bg-[#6F8375] text-white border-[#6F8375]'
                    : 'bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white hover:border-[#6F8375]'
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 shadow-md">
                <Search size={18} className="text-gray-600" />
                <Input
                  placeholder="Search creators..."
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
                      <th className="text-left py-3 px-4 font-semibold text-black">Creator</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Videos</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Leads</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Earnings</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-black"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCreators.map((creator, idx) => (
                      <tr
                        key={`${creator.name}-${idx}`}
                        className={`hover:bg-gray-50 transition-colors border-b border-gray-100 animate-scale-in table-row-${idx % 5}`}
                      >
                        <td className="py-3 px-4 text-black">{creator.name}</td>
                        <td className="py-3 px-4 text-black">{creator.videos}</td>
                        <td className="py-3 px-4 text-black">{creator.leads}</td>
                        <td className="py-3 px-4 text-black font-semibold">{creator.earnings}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              creator.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedCreator(creator)}
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
