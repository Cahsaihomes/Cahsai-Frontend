'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Loader2 } from 'lucide-react';
import { animationStyles } from './animations';
import { getLeads, type Lead, type LeadsResponse } from '@/app/services/admin/dashboard.service';

const leadData = [
  {
    id: 'L001',
    source: 'Creator Video',
    creator: 'Creator Alpha',
    agent: 'Agent Smith',
    status: 'completed',
    amount: 500,
  },
  { id: 'L002', source: 'Search', creator: 'Creator Beta', agent: 'Agent Johnson', status: 'pending', amount: 350 },
  { id: 'L003', source: 'Referral', creator: 'Creator Gamma', agent: 'Unclaimed', status: 'unclaimed', amount: 400 },
  {
    id: 'L004',
    source: 'Creator Video',
    creator: 'Creator Delta',
    agent: 'Agent Smith',
    status: 'completed',
    amount: 500,
  },
  { id: 'L005', source: 'Search', creator: 'Creator Alpha', agent: 'Agent Williams', status: 'pending', amount: 350 },
];

const ITEMS_PER_PAGE = 5;

export function LeadOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadsStats, setLeadsStats] = useState({ totalLeads: 0, completed: 0, pending: 0, unclaimed: 0 });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeads();
        setLeads(data.leads);
        setLeadsStats(data.stats);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch leads';
        setError(errorMessage);
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    // Map lead status to filter status
    let leadStatus = 'pending';
    if (lead.status === 'New lead') leadStatus = 'pending';
    if (lead.status === 'Confirmed Claimed') leadStatus = 'completed';
    if (lead.status === 'Awaiting Call') leadStatus = 'pending';
    
    return matchesSearch && leadStatus === filterStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed Claimed':
        return 'bg-green-100 text-green-800';
      case 'New lead':
      case 'Awaiting Call':
        return 'bg-yellow-100 text-yellow-800';
      case 'unclaimed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="p-8 space-y-6 bg-[#F9F6F1]">
      <div>
        <h1 className="text-3xl font-bold text-black">Lead Overview</h1>
        <p className="text-black mt-2">Track all lead transactions between buyers, creators, and agents.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
            <p className="text-gray-600">Loading leads...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Total Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{leadsStats.totalLeads}</div>
            <p className="text-xs text-gray-600">Across all sources</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{leadsStats.completed}</div>
            <p className="text-xs text-gray-600">{leadsStats.totalLeads > 0 ? Math.round((leadsStats.completed / leadsStats.totalLeads) * 100) : 0}% conversion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{leadsStats.pending}</div>
            <p className="text-xs text-gray-600">Being processed</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Unclaimed</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{leadsStats.unclaimed}</div>
            <p className="text-xs text-gray-600">Awaiting assignment</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'completed', 'pending', 'unclaimed'].map((status) => (
          <Button
            key={status}
            onClick={() => {
              setFilterStatus(status);
              setCurrentPage(1);
            }}
            variant={filterStatus === status ? 'default' : 'outline'}
            className={
              filterStatus === status
                ? 'bg-[#6F8375] text-white border-[#6F8375]'
                : 'bg-white text-black border-gray-200 hover:bg-[#6F8375] hover:text-white hover:border-[#6F8375]'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 shadow-md">
            <Search size={18} className="text-gray-600" />
            <Input
              placeholder="Search by lead ID, creator, or agent..."
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
                  <th className="text-left py-3 px-4 font-semibold text-black">Lead ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Source</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Buyer</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Agent</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead, idx) => (
                  <tr key={`${lead.leadId}-${idx}`} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <td className="py-3 px-4 text-black font-mono">{lead.leadId}</td>
                    <td className="py-3 px-4 text-black capitalize">{lead.source}</td>
                    <td className="py-3 px-4 text-black">{lead.buyerName}</td>
                    <td className="py-3 px-4 text-black">{lead.agentName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-black font-semibold">{lead.amount}</td>
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
