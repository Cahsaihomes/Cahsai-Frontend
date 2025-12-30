'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { animationStyles } from './animations';
import { getAdminConfig, updateAdminConfig, type AdminConfig } from '@/app/services/admin/dashboard.service';

export function Settings() {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [leadPrice, setLeadPrice] = useState('');
  const [creatorCommission, setCreatorCommission] = useState('');
  const [agentCommission, setAgentCommission] = useState('');
  const [autoApprove, setAutoApprove] = useState(false);
  const [creatorVerification, setCreatorVerification] = useState(true);
  const [leadExpiration, setLeadExpiration] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminConfig();
        setConfig(data);
        // Handle both tourPrice and LeadClaimPrice field names
        const priceValue = data.tourPrice || data.LeadClaimPrice || 0;
        setLeadPrice(priceValue.toString());
        setCreatorCommission(data.creatorCommission.toString());
        setAgentCommission(data.agentCommission.toString());
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch config';
        setError(errorMessage);
        console.error('Error fetching config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      const updatedConfig = await updateAdminConfig({
        tourPrice: Number(leadPrice),
        creatorCommission: Number(creatorCommission),
        agentCommission: Number(agentCommission),
      });

      // Update config state with new values
      setConfig(updatedConfig);

      toast.success("Configuration updated successfully");
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update configuration';
      toast.error(errorMessage);
      console.error('Error updating config:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="p-8 space-y-8 bg-[#F9F6F1]">
      <div>
        <h1 className="text-3xl font-bold text-black">Settings</h1>
        <p className="text-black mt-2">Configure platform settings and manage admin roles.</p>
      </div>

      {loading ? (
        <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
          <div className="flex items-center justify-center h-96">
            <Loader2 size={32} className="animate-spin text-[#6F8375]" />
          </div>
        </Card>
      ) : error ? (
        <Card className="bg-white p-6 rounded-2xl shadow-md border-0 border-red-200">
          <CardHeader className="p-0">
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* Pricing Settings */}
      <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-black">Pricing Configuration</CardTitle>
          <CardDescription className="text-gray-600">Set lead claim prices and commission rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Lead Claim Price ($)</label>
            <Input
              type="number"
              value={leadPrice}
              onChange={(e) => setLeadPrice(e.target.value)}
              className="bg-white border-gray-200 text-black"
            />
            <p className="text-xs text-gray-600 mt-1">Price agents pay to claim a lead</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Creator Commission (%)</label>
            <Input
              type="number"
              value={creatorCommission}
              onChange={(e) => setCreatorCommission(e.target.value)}
              className="bg-white border-gray-200 text-black"
            />
            <p className="text-xs text-gray-600 mt-1">Percentage of lead value paid to creators</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Agent Commission (%)</label>
            <Input
              type="number"
              value={agentCommission}
              onChange={(e) => setAgentCommission(e.target.value)}
              className="bg-white border-gray-200 text-black"
            />
            <p className="text-xs text-gray-600 mt-1">Percentage of lead value paid to agents</p>
          </div>

          <Button 
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-[#6F8375] text-white hover:bg-gray-900 disabled:bg-gray-400"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-black">Feature Toggles</CardTitle>
          <CardDescription className="text-gray-600">Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
            <div>
              <p className="font-medium text-black">Auto-Approve Payouts</p>
              <p className="text-sm text-gray-600">Automatically approve pending payouts</p>
            </div>
            <button
              onClick={() => setAutoApprove(!autoApprove)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoApprove ? 'bg-[#6F8375]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoApprove ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
            <div>
              <p className="font-medium text-black">Creator Verification Required</p>
              <p className="text-sm text-gray-600">Require verification before creator can upload</p>
            </div>
            <button
              onClick={() => setCreatorVerification(!creatorVerification)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                creatorVerification ? 'bg-[#6F8375]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  creatorVerification ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
            <div>
              <p className="font-medium text-black">Lead Expiration</p>
              <p className="text-sm text-gray-600">Automatically expire unclaimed leads after 30 days</p>
            </div>
            <button
              onClick={() => setLeadExpiration(!leadExpiration)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                leadExpiration ? 'bg-[#6F8375]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  leadExpiration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Roles */}
      <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-black">Admin Roles</CardTitle>
          <CardDescription className="text-gray-600">Manage administrator access and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-black">Super Admin</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Full Access</span>
            </div>
            <p className="text-sm text-gray-600">Complete platform access and control</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-black">Finance Admin</p>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Limited</span>
            </div>
            <p className="text-sm text-gray-600">Manage payouts and financial reports</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-black">Content Moderator</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Limited</span>
            </div>
            <p className="text-sm text-gray-600">Review and moderate user-generated content</p>
          </div>

          <Button variant="outline" className="w-full mt-4 bg-white text-black border-gray-200 hover:bg-[#6F8375]">
            Add New Admin
          </Button>
        </CardContent>
      </Card>
        </>
      )}
      </div>
    </>
  );
}
