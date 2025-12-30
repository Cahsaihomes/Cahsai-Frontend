'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Zap, DollarSign, Loader2 } from 'lucide-react';
import { animationStyles } from './animations';
import { getAdminDashboardStats, getAgentActivityWeekly, getTopPerformers, formatCurrency, isPositiveChange, type AdminDashboardStats, type AgentActivityWeekly, type TopPerformersResponse } from '@/app/services/admin/dashboard.service';

const kpiData = [
  { label: 'Total Buyers', value: '12,543', change: '+12.5%', icon: Users, id: 'buyers' },
  { label: 'Total Agents', value: '3,100', change: '+8.2%', icon: Users, id: 'agents' },
  { label: 'Total Creators', value: '4,243', change: '+23.1%', icon: Zap, id: 'creators' },
  { label: 'Pending Payouts', value: '$45,230', change: '-2.4%', icon: DollarSign, id: 'payouts' },
];

const topCreatorsData = [
  { name: 'Creator A', videos: 245, leads: 1203, earnings: 12500 },
  { name: 'Creator B', videos: 198, leads: 987, earnings: 10200 },
  { name: 'Creator C', videos: 176, leads: 856, earnings: 8900 },
  { name: 'Creator D', videos: 154, leads: 723, earnings: 7500 },
  { name: 'Creator E', videos: 132, leads: 612, earnings: 6300 },
];

const agentActivityData = [
  { name: 'Mon', leads: 120, tours: 45, conversions: 32 },
  { name: 'Tue', leads: 145, tours: 52, conversions: 38 },
  { name: 'Wed', leads: 132, tours: 48, conversions: 35 },
  { name: 'Thu', leads: 168, tours: 61, conversions: 44 },
  { name: 'Fri', leads: 195, tours: 72, conversions: 52 },
  { name: 'Sat', leads: 142, tours: 54, conversions: 39 },
  { name: 'Sun', leads: 98, tours: 38, conversions: 28 },
];

const userDistributionData = [
  { name: 'Buyers', value: 5200, color: '#6F8375' },
  { name: 'Agents', value: 3100, color: '#8FA89F' },
  { name: 'Creators', value: 4243, color: '#5A6B64' },
];

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [agentActivity, setAgentActivity] = useState<AgentActivityWeekly | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformersResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'creators' | 'agents'>('creators');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stats, agent activity, and top performers in parallel
        const [statsData, activityData, performersData] = await Promise.all([
          getAdminDashboardStats(),
          getAgentActivityWeekly(),
          getTopPerformers(),
        ]);
        
        setStats(statsData);
        setAgentActivity(activityData);
        setTopPerformers(performersData);
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message || 
          err.message || 
          'Failed to fetch dashboard data';
        setError(errorMessage);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Build dynamic KPI data from API response
  const kpiData = stats ? [
    {
      label: 'Total Buyers',
      value: stats.totalBuyers.toLocaleString(),
      change: stats.monthlyChange.buyers,
      icon: Users,
      id: 'buyers'
    },
    {
      label: 'Total Agents',
      value: stats.totalAgents.toLocaleString(),
      change: stats.monthlyChange.agents,
      icon: Users,
      id: 'agents'
    },
    {
      label: 'Total Creators',
      value: stats.totalCreators.toLocaleString(),
      change: stats.monthlyChange.creators,
      icon: Zap,
      id: 'creators'
    },
    {
      label: 'Total Earning',
      value: formatCurrency(stats.totalEarning),
      change: stats.monthlyChange.earning,
      icon: DollarSign,
      id: 'payouts'
    },
  ] : [];

  // Dynamic user distribution data
  const dynamicUserDistribution = stats ? [
    { name: 'Buyers', value: stats.totalBuyers, color: '#6F8375' },
    { name: 'Agents', value: stats.totalAgents, color: '#8FA89F' },
    { name: 'Creators', value: stats.totalCreators, color: '#5A6B64' },
  ] : userDistributionData;

  // Build top creators data from API response
  const displayTopCreators = topPerformers?.topCreators ? topPerformers.topCreators.map(creator => ({
    name: creator.name,
    videos: creator.totalVideos,
    leads: creator.leads,
    earnings: creator.earning,
  })) : topCreatorsData;

  // Build top agents data from API response
  const displayTopAgents = topPerformers?.topAgents ? topPerformers.topAgents.map(agent => ({
    name: agent.name,
    videos: agent.totalVideos,
    leads: agent.leads,
    earnings: agent.earning,
  })) : [];

  // Build chart data from agent activity
  const chartActivityData = agentActivity ? [
    {
      name: 'Weekly',
      leads: agentActivity.weekly.leads,
      tours: agentActivity.weekly.tours,
      conversions: agentActivity.weekly.conversions,
    },
    {
      name: 'Total',
      leads: agentActivity.total.leads,
      tours: agentActivity.total.tours,
      conversions: agentActivity.total.conversions,
    },
  ] : agentActivityData;

  // Show loading state
  if (loading) {
    return (
      <div className="p-8 bg-[#F9F6F1] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#6F8375] animate-spin" />
          <p className="text-gray-600">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 bg-[#F9F6F1] min-h-screen flex items-center justify-center">
        <Card className="bg-white rounded-2xl shadow-md border-0 p-6 max-w-md">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div className="p-8 space-y-8 bg-[#F9F6F1] min-h-screen">
        <div className="animate-slide-in-left">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-black mt-2">Welcome back! Here's your platform overview.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change.startsWith('+');
            return (
              <div
                key={index}
                className={`animate-scale-in kpi-card-${index}`}
              >
                <Card
                  className="bg-white cursor-pointer hover:shadow-xl transition-all p-6 rounded-2xl border-0 shadow-md"
                  onClick={() => onNavigate?.(kpi.id)}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 p-0">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-gray-600">{kpi.label}</CardTitle>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-black mb-3">{kpi.value}</div>
                    <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Activity Chart */}
          <div className="animate-scale-in chart-card-0">
            <Card className="bg-white p-6 rounded-2xl border-0 shadow-md h-full">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-black">Agent Activity (Weekly)</CardTitle>
                <CardDescription>Leads, tours, and conversions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#000000' }} />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#6F8375" strokeWidth={2} />
                    <Line type="monotone" dataKey="tours" stroke="#8FA89F" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#5A6B64" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Distribution */}
          <div className="animate-scale-in chart-card-1">
            <Card className="bg-white p-6 rounded-2xl border-0 shadow-md h-full">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-black">User Distribution</CardTitle>
                <CardDescription>Total users by type</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dynamicUserDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dynamicUserDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="animate-scale-in table-card">
          <Card className="bg-white p-6 rounded-2xl border-0 shadow-md">
            <CardHeader className="p-0 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-black">
                    Top {activeTab === 'creators' ? 'Creators' : 'Agents'}
                  </CardTitle>
                  <CardDescription>
                    Best performing {activeTab === 'creators' ? 'creators' : 'agents'} this month
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('creators')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'creators'
                        ? 'bg-[#6F8375] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Creators
                  </button>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'agents'
                        ? 'bg-[#6F8375] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Agents
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="">
                      <th className="text-left py-3 px-4 font-semibold text-black">
                        {activeTab === 'creators' ? 'Creator' : 'Agent'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Videos</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Leads</th>
                      <th className="text-left py-3 px-4 font-semibold text-black">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'creators' ? displayTopCreators : displayTopAgents).map((item, index) => (
                      <tr key={index} className="hover:bg-muted/10 transition-colors border-t border-gray-100">
                        <td className="py-3 px-4 text-black">{item.name}</td>
                        <td className="py-3 px-4 text-black">{item.videos}</td>
                        <td className="py-3 px-4 text-black">{item.leads}</td>
                        <td className="py-3 px-4 text-black font-semibold">
                          {formatCurrency(item.earnings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
