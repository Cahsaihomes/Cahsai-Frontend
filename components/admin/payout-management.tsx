'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, CheckCircle, Clock, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { animationStyles } from './animations';
import { getPayouts, type Payout, type PayoutsResponse } from '@/app/services/admin/dashboard.service';

const payoutData = [
  {
    id: 'P001',
    recipient: 'Creator Alpha',
    type: 'creator',
    amount: 2500,
    method: 'Bank Transfer',
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: 'P002',
    recipient: 'Agent Smith',
    type: 'agent',
    amount: 1200,
    method: 'PayPal',
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: 'P003',
    recipient: 'Creator Beta',
    type: 'creator',
    amount: 1800,
    method: 'Bank Transfer',
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: 'P004',
    recipient: 'Agent Johnson',
    type: 'agent',
    amount: 950,
    method: 'Bank Transfer',
    status: 'on-hold',
    date: '2024-01-13',
  },
  {
    id: 'P005',
    recipient: 'Creator Gamma',
    type: 'creator',
    amount: 600,
    method: 'PayPal',
    status: 'completed',
    date: '2024-01-12',
  },
];

const ITEMS_PER_PAGE = 5;

export function PayoutManagement() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutStats, setPayoutStats] = useState({ totalPayouts: 0, completed: 0, successfullyPaid: 0, pending: 0, onHold: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPayouts();
        setPayouts(data.data);
        setPayoutStats(data.stats);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch payouts';
        setError(errorMessage);
        console.error('Error fetching payouts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && payout.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const totalPages = Math.ceil(filteredPayouts.length / ITEMS_PER_PAGE);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'successfully paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'on hold':
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
        <h1 className="text-3xl font-bold text-black">Payout Management</h1>
        <p className="text-black mt-2">Monitor and manage payouts to agents and creators.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
            <p className="text-gray-600">Loading payouts...</p>
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
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Total Payouts</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{payoutStats.totalPayouts}</div>
            <p className="text-xs text-gray-600">All payouts</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Successfully Paid</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{payoutStats.successfullyPaid}</div>
            <p className="text-xs text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{payoutStats.pending}</div>
            <p className="text-xs text-gray-600">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">On Hold</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{payoutStats.onHold}</div>
            <p className="text-xs text-gray-600">Awaiting resolution</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-black">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold text-black">{payoutStats.completed}</div>
            <p className="text-xs text-gray-600">Total completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'Pending', 'Successfully paid', 'On Hold'].map((status) => (
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
            {status === 'on-hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 shadow-md">
            <Search size={18} className="text-gray-600" />
            <Input
              placeholder="Search by recipient or payout ID..."
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
                  <th className="text-left py-3 px-4 font-semibold text-black">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Recipient</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayouts.map((payout, idx) => (
                  <tr
                    key={`${payout.id}-${idx}`}
                    className={`hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer animate-scale-in table-row-${idx % 5}`}
                    onClick={() => setSelectedPayout(payout)}
                  >
                    <td className="py-3 px-4 text-black font-mono">{payout.id}</td>
                    <td className="py-3 px-4 text-black">{payout.recipient}</td>
                    <td className="py-3 px-4 text-black capitalize">{payout.type}</td>
                    <td className="py-3 px-4 text-black font-semibold">{payout.amount}</td>
                    <td className="py-3 px-4 text-black capitalize">{payout.method}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-black">{payout.date}</td>
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
