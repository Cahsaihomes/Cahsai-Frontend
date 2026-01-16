'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, ChevronRight, Loader2, Download, Check, X, Eye } from 'lucide-react';
import { animationStyles } from './animations';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllRentalApplications, updateApplicationStatus } from '@/app/services/rental-application.service';

const ITEMS_PER_PAGE = 10;

interface RentalApplication {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  currentAddress: string;
  desiredMoveInDate: string;
  monthlyIncome: number;
  employmentStatus: string;
  employerName: string;
  lengthOfEmployment: string;
  numAdults: number;
  numMinors: number;
  hasPets: boolean;
  petType?: string;
  petBreed?: string;
  petWeight?: string;
  governmentId: string;
  proofOfIncomeType: string;
  proofOfIncomeFile: string;
  studentLetter?: string;
  guarantorDocs?: string;
  petVaccinationRecords?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export function RentalApplicationsAdmin() {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<RentalApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllRentalApplications();
        const applicationsData = data.data || data.applications || [];
        setApplications(applicationsData);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch applications';
        setError(errorMessage);
        console.error('Error fetching applications:', err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phoneNumber.includes(searchTerm);
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && app.status === activeTab;
  });

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleStatusUpdate = async (appId: number, newStatus: 'approved' | 'rejected') => {
    setStatusUpdateLoading(true);
    try {
      await updateApplicationStatus(appId, newStatus);

      // Update local state
      setApplications(apps =>
        apps.map(app =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );

      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }

      toast.success(
        `Application ${newStatus}!`,
        {
          description: `Application has been ${newStatus} successfully.`,
        }
      );
    } catch (err: any) {
      toast.error('Failed to update status', {
        description: err.message || 'An error occurred',
      });
      console.error('Error updating status:', err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={`${statusConfig[status]} border-0 capitalize`}>
        {status}
      </Badge>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
  ];

  return (
    <>
      <style>{animationStyles}</style>
      <div className="p-8 space-y-6 bg-[#F9F6F1]">
        <div>
          <h1 className="text-3xl font-bold text-black">Rental Applications</h1>
          <p className="text-black mt-2">Review and manage rental company applications.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#968470] text-[#968470]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-white text-black border-gray-200"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#968470] animate-spin" />
              <p className="text-gray-600">Loading applications...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : selectedApplication ? (
          // Detail View
          <Card className="bg-white p-6 rounded-2xl shadow-md border-0">
            <CardHeader className="p-0 mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedApplication(null)}
                className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-white py-2 px-2 h-auto"
              >
                ← Back to List
              </Button>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-black">{selectedApplication.fullName}</CardTitle>
                  <CardDescription>{selectedApplication.email}</CardDescription>
                </div>
                {getStatusBadge(selectedApplication.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.fullName}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.phoneNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-base font-semibold text-black">
                      {new Date(selectedApplication.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-600">Current Address</p>
                  <p className="text-base font-semibold text-black">{selectedApplication.currentAddress}</p>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Employment Status</p>
                    <p className="text-base font-semibold text-black capitalize">{selectedApplication.employmentStatus}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Employer</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.employerName}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Length of Employment</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.lengthOfEmployment}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Income</p>
                    <p className="text-base font-semibold text-black">${Number(selectedApplication.monthlyIncome).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Occupancy & Pets */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Occupancy Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Adults</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.numAdults}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Minors</p>
                    <p className="text-base font-semibold text-black">{selectedApplication.numMinors}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Desired Move-in Date</p>
                    <p className="text-base font-semibold text-black">
                      {new Date(selectedApplication.desiredMoveInDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedApplication.hasPets && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Pet Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-black">{selectedApplication.petType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Breed</p>
                        <p className="font-semibold text-black">{selectedApplication.petBreed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-semibold text-black">{selectedApplication.petWeight} lbs</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D5D7DA]">
                    <p className="text-sm text-gray-600 mb-3">Government ID</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewDoc({ url: selectedApplication.governmentId, name: 'Government ID' })}
                        className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <a
                        href={selectedApplication.governmentId}
                        download
                        className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-[#D5D7DA]">
                    <p className="text-sm text-gray-600 mb-3">Proof of Income</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewDoc({ url: selectedApplication.proofOfIncomeFile, name: 'Proof of Income' })}
                        className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <a
                        href={selectedApplication.proofOfIncomeFile}
                        download
                        className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>

                  {selectedApplication.studentLetter && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#D5D7DA]">
                      <p className="text-sm text-gray-600 mb-3">Student Letter</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewDoc({ url: selectedApplication.studentLetter!, name: 'Student Letter' })}
                          className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        <a
                          href={selectedApplication.studentLetter}
                          download
                          className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedApplication.guarantorDocs && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#D5D7DA]">
                      <p className="text-sm text-gray-600 mb-3">Guarantor Docs</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewDoc({ url: selectedApplication.guarantorDocs!, name: 'Guarantor Docs' })}
                          className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        <a
                          href={selectedApplication.guarantorDocs}
                          download
                          className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedApplication.petVaccinationRecords && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#D5D7DA]">
                      <p className="text-sm text-gray-600 mb-3">Pet Vaccination Records</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewDoc({ url: selectedApplication.petVaccinationRecords!, name: 'Pet Vaccination Records' })}
                          className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        <a
                          href={selectedApplication.petVaccinationRecords}
                          download
                          className="inline-flex items-center gap-2 px-3 py-2 text-[#968470] hover:bg-[#968470] hover:text-white rounded-md transition-colors text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="bg-[#F9F6F1] p-6 rounded-lg border border-[#D5D7DA]">
                  <p className="text-sm text-black mb-4 font-semibold">Update Application Status</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                      disabled={statusUpdateLoading}
                      className="flex-1 bg-[#968470] hover:bg-[#5a6b63] text-white"
                    >
                      {statusUpdateLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Approve Application
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                      disabled={statusUpdateLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {statusUpdateLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Reject Application
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                <p>Submitted: {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                {selectedApplication.updatedAt && (
                  <p>Last Updated: {new Date(selectedApplication.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          // List View
          <div className="space-y-4">
            {paginatedApplications.length === 0 ? (
              <Card className="bg-white rounded-2xl shadow-md border-0 p-6">
                <CardContent>
                  <p className="text-gray-600">No applications found.</p>
                </CardContent>
              </Card>
            ) : (
              paginatedApplications.map((app) => (
                <Card
                  key={app.id}
                  className="bg-white rounded-2xl shadow-md border-0 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedApplication(app)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-black">{app.fullName}</h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{app.email}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-semibold text-black">{app.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Income</p>
                            <p className="font-semibold text-black">${Number(app.monthlyIncome).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Employment</p>
                            <p className="font-semibold text-black capitalize">{app.employmentStatus}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Occupants</p>
                            <p className="font-semibold text-black">{app.numAdults} adults, {app.numMinors} minors</p>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-black border-gray-300 hover:bg-gray-100"
                >
                  ← Previous
                </Button>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-black border-gray-300 hover:bg-gray-100"
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDoc && (
          <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{previewDoc.name}</DialogTitle>
                <DialogDescription className="mt-2">
                  Document preview
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 w-full">
                {previewDoc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.name}
                    className="w-full h-auto rounded-lg"
                  />
                ) : previewDoc.url.match(/\.pdf$/i) ? (
                  <iframe
                    src={previewDoc.url}
                    className="w-full h-[600px] rounded-lg border border-gray-300"
                    title={previewDoc.name}
                  />
                ) : (
                  <div className="bg-gray-100 p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">Cannot preview this file type</p>
                    <a
                      href={previewDoc.url}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#968470] text-white rounded-lg hover:bg-[#5a6b63] transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
