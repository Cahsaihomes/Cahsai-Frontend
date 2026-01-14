'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, X, Check, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { animationStyles } from './animations';
import { getAdminConfig, updateAdminConfig, type AdminConfig } from '@/app/services/admin/dashboard.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RootState } from '@/app/redux';
import {
  fetchAllAdmins,
  createAdmin as createAdminAPI,
  deleteAdmin as deleteAdminAPI,
  type AdminData,
} from '@/app/services/admin/admin.service';

// Helper function to get admin name
const getAdminName = (admin: AdminData): string => {
  if (admin.first_name && admin.last_name) {
    return `${admin.first_name} ${admin.last_name}`;
  }
  if (admin.first_name) {
    return admin.first_name;
  }
  if (admin.last_name) {
    return admin.last_name;
  }
  // Fallback: extract name from email
  const emailName = admin.email?.split('@')[0] || 'Admin User';
  return emailName.replace(/[._-]/g, ' ').toUpperCase();
};

// Helper function to format role display - now uses description from API
const formatRoleDisplay = (role: any): string => {
  if (typeof role === 'object' && role?.description) {
    return role.description;
  }
  // Fallback for string roles
  const roleMap: { [key: string]: string } = {
    'admin': 'Finance Admin',
    'finance': 'Finance Admin',
    'finance_admin': 'Finance Admin',
    'creator': 'Creator Manager',
    'creator_manager': 'Creator Manager',
    'content_moderator': 'Content Moderator',
    'moderator': 'Content Moderator',
    'super_admin': 'Super Admin',
  };
  return roleMap[(role?.name || role)?.toLowerCase()] || role?.name || role;
};

// Helper function to get role badge colors
const getRoleBadgeColor = (role: any): string => {
  const roleName = (role?.name || role || '').toLowerCase();
  if (roleName === 'finance' || roleName.includes('finance')) {
    return 'bg-green-100 text-green-800';
  } else if (roleName === 'content_moderator' || roleName.includes('moderator') || roleName.includes('content')) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (roleName === 'super_admin' || roleName.includes('super')) {
    return 'bg-blue-100 text-blue-800';
  }
  return 'bg-gray-100 text-gray-800';
};

export function Settings() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
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

  // Add Admin States
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // Admin Data Structure
  const [adminStats, setAdminStats] = useState({
    currentAdmin: null as AdminData | null,
    allOtherAdmins: [] as AdminData[],
    totalAdminsCount: 0,
  });

  // Reusable function to fetch admins
  const refetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      // Pass current user id to fetch admins for that user
      const userId = currentUser?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      const response = await fetchAllAdmins(userId);
      
      console.log('Admin Response:', response);
      
      // Use response data directly - it already has currentAdmin and allOtherAdmins
      const currentAdmin = response.currentAdmin || null;
      const otherAdmins = response.allOtherAdmins || [];
      const totalCount = response.totalAdminsCount || 0;

      console.log('Current Admin:', currentAdmin);
      console.log('Other Admins:', otherAdmins);
      console.log('Total Admin Count:', totalCount);

      const allAdmins = [currentAdmin, ...otherAdmins].filter(Boolean) as AdminData[];
      setAdmins(allAdmins);
      
      // Set admin stats
      setAdminStats({
        currentAdmin,
        allOtherAdmins: otherAdmins,
        totalAdminsCount: totalCount,
      });
    } catch (err: any) {
      console.error('Error fetching admins:', err);
      // Set Super Admin as fallback
      if (currentUser) {
        const superAdmin: AdminData = {
          id: currentUser.id,
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          role: {
            id: 1,
            name: 'super_admin',
            description: 'Super Administrator',
          },
          is_admin: true,
        };
        setAdmins([superAdmin]);
        setAdminStats({
          currentAdmin: superAdmin,
          allOtherAdmins: [],
          totalAdminsCount: 1,
        });
      }
    } finally {
      setLoadingAdmins(false);
    }
  };

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
    refetchAdmins();
  }, [currentUser]);

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

  const handleAddAdmin = async () => {
    if (!adminForm.firstName.trim() || !adminForm.lastName.trim() || !adminForm.email.trim() || !adminForm.role) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSubmittingAdmin(true);
      const newAdmin = await createAdminAPI({
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        role: adminForm.role as 'Finance Admin' | 'Content Moderator' | 'Super Admin',
        sendEmail: true,
      });

      setAdminForm({ firstName: '', lastName: '', email: '', role: '' });
      setIsAddAdminOpen(false);
      toast.success('Admin created successfully');
      
      // Refetch admins to show updated list
      await refetchAdmins();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create admin');
      console.error('Error creating admin:', err);
    } finally {
      setSubmittingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (id: number) => {
    try {
      await deleteAdminAPI(id);
      toast.success('Admin removed successfully');
      
      // Refetch admins to show updated list
      await refetchAdmins();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove admin');
      console.error('Error removing admin:', err);
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
          <CardTitle className="text-black">Admin Management</CardTitle>
          <CardDescription className="text-gray-600">Manage administrator access and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          {loadingAdmins ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={32} className="animate-spin text-[#6F8375]" />
            </div>
          ) : (
            <>
              {/* Current Admin - Super Admin */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-blue-600" />
                  Current Administrator
                </h3>
                {adminStats.currentAdmin ? (
                  <div className="p-4 bg-blue-50 rounded-lg shadow-md border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-black text-lg">{getAdminName(adminStats.currentAdmin)}</p>
                        <p className="text-sm text-gray-600">{adminStats.currentAdmin.email}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
                        {formatRoleDisplay(adminStats.currentAdmin.role?.name || 'Super Admin')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No current admin</p>
                )}
              </div>

              {/* All Other Admins */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">
                  Other Administrators ({adminStats.allOtherAdmins.length})
                </h3>
                {adminStats.allOtherAdmins && adminStats.allOtherAdmins.length > 0 ? (
                  <div className="space-y-3">
                    {adminStats.allOtherAdmins.map((admin) => (
                      <div key={admin.id} className="p-4 bg-gray-50 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">{admin.email}</p>
                          <p className="font-bold text-black text-base mb-2">
                            {admin.first_name} {admin.last_name}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${getRoleBadgeColor(admin.role)}`}>
                              {admin.role?.name || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin.id || 0)}
                          className="ml-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No other administrators</p>
                )}
              </div>

            
            </>
          )}

          <Button 
            onClick={() => setIsAddAdminOpen(true)}
            className="w-full mt-4 bg-[#6F8375] text-white hover:bg-[#5b6c62]"
          >
            Add New Admin
          </Button>
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-black">Add New Administrator</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new admin account with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-black font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={adminForm.firstName}
                onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                className="bg-white border-gray-200 text-black placeholder:text-gray-400"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-black font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={adminForm.lastName}
                onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                className="bg-white border-gray-200 text-black placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                className="bg-white border-gray-200 text-black placeholder:text-gray-400"
              />
            </div>

            {/* Admin Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-black font-medium">
                Admin Role
              </Label>
              <Select value={adminForm.role} onValueChange={(value) => setAdminForm({ ...adminForm, role: value })}>
                <SelectTrigger className="bg-white border-gray-200 text-black">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Finance Admin" className="text-black">
                    Finance Admin
                  </SelectItem>
                  <SelectItem value="Content Moderator" className="text-black">
                    Content Moderator
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                {adminForm.role === 'Finance Admin' && 'Manage payouts, financial reports, and commission settings'}
                {adminForm.role === 'Content Moderator' && 'Review and moderate user-generated content and reports'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsAddAdminOpen(false)}
              disabled={submittingAdmin}
              className="border-gray-200 text-white hover:bg-gray-50 hover:text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              disabled={submittingAdmin}
              className="bg-[#6F8375] text-white hover:bg-[#5b6c62]"
            >
              {submittingAdmin ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  Create Admin
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
      </div>
    </>
  );
}
