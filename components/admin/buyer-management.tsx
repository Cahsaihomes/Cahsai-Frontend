'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { animationStyles } from './animations';
import { getBuyers, type Buyer, type BuyersResponse } from '@/app/services/admin/dashboard.service';

const buyerData = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    toursBooked: 5,
    dreamBoards: 12,
    status: 'active',
    signupDate: '2024-01-10',
    clipsWatched: 45,
    homesSaved: 8,
    preferredAreas: 'Downtown, Midtown',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    toursBooked: 8,
    dreamBoards: 18,
    status: 'active',
    signupDate: '2024-01-05',
    clipsWatched: 120,
    homesSaved: 15,
    preferredAreas: 'Suburbs, Waterfront',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    toursBooked: 2,
    dreamBoards: 5,
    status: 'inactive',
    signupDate: '2023-12-20',
    clipsWatched: 12,
    homesSaved: 2,
    preferredAreas: 'Downtown',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    toursBooked: 12,
    dreamBoards: 24,
    status: 'active',
    signupDate: '2024-01-01',
    clipsWatched: 200,
    homesSaved: 28,
    preferredAreas: 'Luxury, Waterfront',
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david@example.com',
    toursBooked: 0,
    dreamBoards: 3,
    status: 'inactive',
    signupDate: '2023-11-15',
    clipsWatched: 5,
    homesSaved: 1,
    preferredAreas: 'Suburbs',
  },
];

const buyers = [
  { id: 1, name: 'Michael Chen', email: 'michael@example.com', status: 'Active', purchases: 12 },
  { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', status: 'Active', purchases: 8 },
  { id: 3, name: 'David Miller', email: 'david@example.com', status: 'Inactive', purchases: 3 },
  { id: 4, name: 'Emily Taylor', email: 'emily@example.com', status: 'Active', purchases: 15 },
  { id: 5, name: 'James Wilson', email: 'james@example.com', status: 'Active', purchases: 6 },
];

const ITEMS_PER_PAGE = 5;

export function BuyerManagement() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailTab, setDetailTab] = useState('agent');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBuyers();
        setBuyers(data.buyers);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch buyers';
        setError(errorMessage);
        console.error('Error fetching buyers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Reset detail tab to agent when a new buyer is selected
  useEffect(() => {
    if (selectedBuyer) {
      setDetailTab('agent');
      console.log('Selected buyer:', selectedBuyer);
      console.log('Assigned agent:', selectedBuyer.assignedAgent);
    }
  }, [selectedBuyer]);

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && buyer.status === activeTab;
  });

  const totalPages = Math.ceil(filteredBuyers.length / ITEMS_PER_PAGE);
  const paginatedBuyers = filteredBuyers.slice(
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
          <h1 className="text-3xl font-bold text-black">Buyer Management</h1>
          <p className="text-black mt-2">Manage and monitor all buyers on the platform.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
              <p className="text-gray-600">Loading buyers...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : selectedBuyer ? (
        <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
          <CardHeader className="p-0 mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedBuyer(null)}
              className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-white py-2 px-2 h-auto"
            >
              ← Back to List
            </Button>
            <CardTitle className="text-black">{selectedBuyer.name}</CardTitle>
            <CardDescription>{selectedBuyer.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Clips Watched</p>
                <p className="text-2xl font-bold text-black">{selectedBuyer.clipsWatched}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Homes Saved</p>
                <p className="text-2xl font-bold text-black">{selectedBuyer.homesSaved}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Tours Booked</p>
                <p className="text-2xl font-bold text-black">{selectedBuyer.toursBooked}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`text-2xl font-bold ${selectedBuyer.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}
                >
                  {selectedBuyer.status.charAt(0).toUpperCase() + selectedBuyer.status.slice(1)}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {['agent', 'communication'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    detailTab === tab
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tab === 'agent' ? 'Assigned Agent' : 'Communication'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {detailTab === 'agent' && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Assigned Agent</h3>
                {selectedBuyer && selectedBuyer.assignedAgent && Object.keys(selectedBuyer.assignedAgent).length > 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-[#6F8375]">
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Agent Name</p>
                      <p className="text-lg font-semibold text-black">{selectedBuyer.assignedAgent.name}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Email</p>
                      <p className="text-sm text-black">{selectedBuyer.assignedAgent.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Phone</p>
                      <p className="text-sm text-black">{selectedBuyer.assignedAgent.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">No agent assigned to this buyer</p>
                  </div>
                )}
              </div>
            )}

            {detailTab === 'communication' && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Communication History</h3>
                {selectedBuyer?.communicationHistory && selectedBuyer.communicationHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBuyer.communicationHistory.map((msg, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg shadow-md">
                        <p className="text-sm text-black">{msg.type}</p>
                        <p className="text-xs text-gray-600">{msg.timeAgo}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">No communication history</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {/* Send Message and Suspend Buyer buttons hidden as per requirements */}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'active', 'inactive'].map((tab) => (
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
                  placeholder="Search buyers..."
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
                      <th className="text-left py-3 px-4 font-semibold text-black">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Signup Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Tours Booked</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-black"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBuyers.map((buyer, idx) => (
                      <tr
                        key={`${buyer.name}-${idx}`}
                        className={`hover:bg-gray-50 transition-colors border-b border-gray-100 animate-scale-in table-row-${idx % 5}`}
                      >
                        <td className="py-3 px-4 text-black">{buyer.name}</td>
                        <td className="py-3 px-4 text-black">{buyer.email}</td>
                        <td className="py-3 px-4 text-black">{buyer.signupDate}</td>
                        <td className="py-3 px-4 text-black">{buyer.toursBooked}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              buyer.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedBuyer(buyer)}
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
