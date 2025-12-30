'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { animationStyles } from './animations';
import { getAgents, type Agent, type AgentsResponse } from '@/app/services/admin/dashboard.service';

const agentData = [
  {
    id: 1,
    name: 'Agent Smith',
    email: 'smith@example.com',
    license: 'LIC-001',
    leads: 45,
    subscription: 'premium',
    status: 'active',
  },
  {
    id: 2,
    name: 'Agent Johnson',
    email: 'johnson@example.com',
    license: 'LIC-002',
    leads: 32,
    subscription: 'standard',
    status: 'active',
  },
  {
    id: 3,
    name: 'Agent Williams',
    email: 'williams@example.com',
    license: 'LIC-003',
    leads: 0,
    subscription: 'pending',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Agent Brown',
    email: 'brown@example.com',
    license: 'LIC-004',
    leads: 28,
    subscription: 'premium',
    status: 'suspended',
  },
];

const ITEMS_PER_PAGE = 5;

export function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAgents();
        setAgents(data.agents);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch agents';
        setError(errorMessage);
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && agent.status === activeTab;
  });

  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const paginatedAgents = filteredAgents.slice(
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
          <h1 className="text-3xl font-bold text-black">Agent Management</h1>
          <p className="text-black mt-2">Manage agents, verify licenses, and monitor performance.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
              <p className="text-gray-600">Loading agents...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : selectedAgent ? (
          <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
          <CardHeader className="p-0 mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedAgent(null)}
              className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-white py-2 px-2 h-auto"
            >
              ← Back to List
            </Button>
            <CardTitle className="text-black">{selectedAgent.name}</CardTitle>
            <CardDescription>{selectedAgent.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">License</p>
                <p className="text-lg font-bold text-black">{selectedAgent.license}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Leads Claimed</p>
                <p className="text-2xl font-bold text-black">{selectedAgent.leads}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Subscription</p>
                <p className="text-lg font-bold text-black capitalize">{selectedAgent.subscription}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Lead Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg shadow-md">
                  <span className="text-black">Leads Claimed</span>
                  <span className="font-semibold text-black">{selectedAgent.leadPerformance.leadsClaimed}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg shadow-md">
                  <span className="text-black">Conversion Rate</span>
                  <span className="font-semibold text-black">{selectedAgent.leadPerformance.conversionRate}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg shadow-md">
                  <span className="text-black">Avg Response Time</span>
                  <span className="font-semibold text-black">{selectedAgent.leadPerformance.avgResponseTime}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Financial Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg shadow-md">
                  <span className="text-black">Total Earnings</span>
                  <span className="font-semibold text-black">{selectedAgent.financialOverview.totalEarnings}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg shadow-md">
                  <span className="text-black">Pending Payout</span>
                  <span className="font-semibold text-black">{selectedAgent.financialOverview.pendingPayout}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'active', 'pending', 'suspended'].map((tab) => (
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
                  placeholder="Search agents..."
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
                      <th className="text-left py-3 px-4 font-semibold text-black">License</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Leads</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Subscription</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-black"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAgents.map((agent, idx) => (
                      <tr key={`${agent.name}-${idx}`} className={`hover:bg-gray-50 transition-colors border-b border-gray-100 animate-scale-in table-row-${idx % 5}`}>
                        <td className="py-3 px-4 text-black">{agent.name}</td>
                        <td className="py-3 px-4 text-black">{agent.license}</td>
                        <td className="py-3 px-4 text-black">{agent.leads}</td>
                        <td className="py-3 px-4 text-black capitalize">{agent.subscription}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              agent.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : agent.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedAgent(agent)}
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
