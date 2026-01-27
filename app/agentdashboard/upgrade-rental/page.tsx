"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronRight, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  submitRentalApplication,
  getUserRentalApplications,
} from "@/app/services/rental-application.service";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  currentAddress: string;
  desiredMoveInDate: string;
  monthlyIncome: string;
  employmentStatus: string;
  employerName: string;
  lengthOfEmployment: string;
  numAdults: string;
  numMinors: string;
  hasPets: boolean;
  petType: string;
  petBreed: string;
  petWeight: string;
  governmentId: File | null;
  proofOfIncomeType: string;
  proofOfIncomeFile: File | null;
  studentLetter: File | null;
  guarantorDocs: File | null;
  petVaccinationRecords: File | null;
}

export default function UpgradeRentalPage() {
  const user = useSelector((state: any) => state.auth.user);
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "",
    email: user?.email || "",
    phoneNumber: user?.contact || "",
    dateOfBirth: "",
    currentAddress: "",
    desiredMoveInDate: "",
    monthlyIncome: "",
    employmentStatus: "",
    employerName: "",
    lengthOfEmployment: "",
    numAdults: "",
    numMinors: "",
    hasPets: false,
    petType: "",
    petBreed: "",
    petWeight: "",
    governmentId: null,
    proofOfIncomeType: "",
    proofOfIncomeFile: null,
    studentLetter: null,
    guarantorDocs: null,
    petVaccinationRecords: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasPets: checked,
      ...(checked === false && { petType: "", petBreed: "", petWeight: "" }),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] || null,
    }));
  };

  const fetchUserApplications = async () => {
    setApplicationsLoading(true);
    try {
      const response = await getUserRentalApplications();
      const appsList = response.data || [];
      setApplications(appsList);
      
      if (appsList.length > 0) {
        toast.success(`Found ${appsList.length} application(s)`, {
          description: "Loaded your rental applications successfully.",
          duration: 3000,
        });
      } else {
        toast.info("No applications yet", {
          description: "Start by filling out the rental application form above.",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications", {
        description: "Please try again or contact support if the problem persists.",
        duration: 5000,
      });
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleViewApplications = () => {
    fetchUserApplications();
    setApplicationsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string } } = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      approved: { bg: "bg-green-100", text: "text-green-800" },
      rejected: { bg: "bg-red-100", text: "text-red-800" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.bg} ${config.text} border-0`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.dateOfBirth ||
      !formData.currentAddress ||
      !formData.desiredMoveInDate ||
      !formData.monthlyIncome ||
      !formData.employmentStatus ||
      !formData.employerName ||
      !formData.lengthOfEmployment ||
      !formData.numAdults ||
      !formData.governmentId ||
      !formData.proofOfIncomeType ||
      !formData.proofOfIncomeFile
    ) {
      toast.error("Please fill in all required fields and upload required documents");
      return;
    }

    if (formData.hasPets && (!formData.petType || !formData.petBreed || !formData.petWeight)) {
      toast.error("Please fill in all pet information");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare documents object
      const documents = {
        governmentId: formData.governmentId!,
        proofOfIncomeType: formData.proofOfIncomeType,
        proofOfIncomeFile: formData.proofOfIncomeFile!,
        studentLetter: formData.studentLetter || undefined,
        guarantorDocs: formData.guarantorDocs || undefined,
        petVaccinationRecords: formData.petVaccinationRecords || undefined,
      };

      // Call the service
      const response = await submitRentalApplication(
        {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          currentAddress: formData.currentAddress,
          desiredMoveInDate: formData.desiredMoveInDate,
          monthlyIncome: formData.monthlyIncome,
          employmentStatus: formData.employmentStatus,
          employerName: formData.employerName,
          lengthOfEmployment: formData.lengthOfEmployment,
          numAdults: formData.numAdults,
          numMinors: formData.numMinors,
          hasPets: formData.hasPets,
          petType: formData.petType || undefined,
          petBreed: formData.petBreed || undefined,
          petWeight: formData.petWeight || undefined,
        },
        documents
      );

      console.log("Application submitted:", response);
      toast.success("✓ Application submitted successfully!", {
        description: `${formData.fullName}, you will receive a confirmation email shortly.`,
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        currentAddress: "",
        desiredMoveInDate: "",
        monthlyIncome: "",
        employmentStatus: "",
        employerName: "",
        lengthOfEmployment: "",
        numAdults: "",
        numMinors: "",
        hasPets: false,
        petType: "",
        petBreed: "",
        petWeight: "",
        governmentId: null,
        proofOfIncomeType: "",
        proofOfIncomeFile: null,
        studentLetter: null,
        guarantorDocs: null,
        petVaccinationRecords: null,
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      
      // Handle different error types
      const errorMessage = error?.message || "Failed to submit application";
      const errorDetails = error?.details || "Please check your information and try again.";
      
      toast.error("✗ Submission Failed", {
        description: `${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white border border-[#D5D7DA] rounded-[12px] px-0 py-6 sm:px-2 lg:px-1">
      <div className="max-w-full mx-auto space-y-6 px-2 sm:px-4 lg:px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
              Rental Application Form
            </h1>
            <p className="text-sm text-gray-600">Please fill out all fields to complete your rental application</p>
          </div>
          <Button
            onClick={handleViewApplications}
            className="bg-[#968470] hover:bg-[#968470] text-white flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            My Applications
          </Button>
        </div>
        
        <Card className="border border-[#D5D7DA] shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Legal Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold">
                  Full Legal Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-base font-semibold">
                  Date of Birth (Required for screening) *
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Current Address */}
              <div className="space-y-2">
                <Label htmlFor="currentAddress" className="text-base font-semibold">
                  Current Address *
                </Label>
                <Textarea
                  id="currentAddress"
                  name="currentAddress"
                  placeholder="Street address, city, state, zip"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  required
                  rows={2}
                />
              </div>

              {/* Desired Move-in Date */}
              <div className="space-y-2">
                <Label htmlFor="desiredMoveInDate" className="text-base font-semibold">
                  Desired Move-in Date *
                </Label>
                <Input
                  id="desiredMoveInDate"
                  name="desiredMoveInDate"
                  type="date"
                  value={formData.desiredMoveInDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Monthly Income */}
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome" className="text-base font-semibold">
                  Monthly Income *
                </Label>
                <Input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  type="number"
                  placeholder="5000"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Employment Status */}
              <div className="space-y-2">
                <Label htmlFor="employmentStatus" className="text-base font-semibold">
                  Employment Status *
                </Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) =>
                    handleSelectChange("employmentStatus", value)
                  }
                >
                  <SelectTrigger id="employmentStatus">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employer Name */}
              <div className="space-y-2">
                <Label htmlFor="employerName" className="text-base font-semibold">
                  Employer Name *
                </Label>
                <Input
                  id="employerName"
                  name="employerName"
                  placeholder="Company name"
                  value={formData.employerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Length of Employment */}
              <div className="space-y-2">
                <Label htmlFor="lengthOfEmployment" className="text-base font-semibold">
                  Length of Employment *
                </Label>
                <Input
                  id="lengthOfEmployment"
                  name="lengthOfEmployment"
                  placeholder="e.g., 2 years"
                  value={formData.lengthOfEmployment}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Number of Occupants */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numAdults" className="text-base font-semibold">
                    Number of Adults *
                  </Label>
                  <Input
                    id="numAdults"
                    name="numAdults"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.numAdults}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numMinors" className="text-base font-semibold">
                    Number of Minors
                  </Label>
                  <Input
                    id="numMinors"
                    name="numMinors"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.numMinors}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Pets Section */}
              <div className="space-y-4 p-4 bg-white rounded-lg border border-[#D5D7DA]">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPets"
                    checked={formData.hasPets}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="hasPets"
                    className="text-base font-semibold cursor-pointer"
                  >
                    Do you have any pets? *
                  </Label>
                </div>

                {formData.hasPets && (
                  <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-300">
                    <div className="space-y-2">
                      <Label htmlFor="petType" className="text-base font-semibold">
                        Pet Type *
                      </Label>
                      <Input
                        id="petType"
                        name="petType"
                        placeholder="e.g., Dog, Cat"
                        value={formData.petType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="petBreed" className="text-base font-semibold">
                        Breed *
                      </Label>
                      <Input
                        id="petBreed"
                        name="petBreed"
                        placeholder="e.g., Golden Retriever"
                        value={formData.petBreed}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="petWeight" className="text-base font-semibold">
                        Weight (lbs) *
                      </Label>
                      <Input
                        id="petWeight"
                        name="petWeight"
                        type="number"
                        placeholder="e.g., 50"
                        value={formData.petWeight}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div className="space-y-6 pt-6 border-t border-[#D5D7DA]">
                <div>
                  <h3 className="text-lg font-semibold text-[#434342] mb-4">Required Documents</h3>
                </div>

                {/* Government ID */}
                <div className="space-y-2">
                  <Label htmlFor="governmentId" className="text-base font-semibold">
                    Government ID (Driver's License, Passport, etc.) *
                  </Label>
                  <Input
                    id="governmentId"
                    name="governmentId"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                  {formData.governmentId && (
                    <p className="text-xs text-green-600">✓ {formData.governmentId.name}</p>
                  )}
                </div>

                {/* Proof of Income */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-[#D5D7DA]">
                  <div className="space-y-2">
                    <Label htmlFor="proofOfIncomeType" className="text-base font-semibold">
                      Proof of Income (Choose one) *
                    </Label>
                    <Select
                      value={formData.proofOfIncomeType}
                      onValueChange={(value) =>
                        handleSelectChange("proofOfIncomeType", value)
                      }
                    >
                      <SelectTrigger id="proofOfIncomeType">
                        <SelectValue placeholder="Select proof of income type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paystubs">Pay Stubs (Last 2)</SelectItem>
                        <SelectItem value="offer-letter">Offer Letter</SelectItem>
                        <SelectItem value="bank-statements">Bank Statements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proofOfIncomeFile" className="text-base font-semibold">
                      Upload Document *
                    </Label>
                    <Input
                      id="proofOfIncomeFile"
                      name="proofOfIncomeFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required={formData.proofOfIncomeType !== ""}
                    />
                    <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                    {formData.proofOfIncomeFile && (
                      <p className="text-xs text-green-600">✓ {formData.proofOfIncomeFile.name}</p>
                    )}
                  </div>
                </div>

                {/* Optional Documents */}
                <div className="space-y-4 pt-4">
                  <div>
                    <h4 className="text-base font-semibold text-[#434342] mb-4">Optional Documents</h4>
                  </div>

                  {/* Student Letter */}
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-[#D5D7DA]">
                    <Label htmlFor="studentLetter" className="text-base font-semibold">
                      Student Enrollment Letter (Optional)
                    </Label>
                    <Input
                      id="studentLetter"
                      name="studentLetter"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500">For current students</p>
                    {formData.studentLetter && (
                      <p className="text-xs text-green-600">✓ {formData.studentLetter.name}</p>
                    )}
                  </div>

                  {/* Guarantor/Co-signer Docs */}
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-[#D5D7DA]">
                    <Label htmlFor="guarantorDocs" className="text-base font-semibold">
                      Guarantor/Co-signer Documents (Optional)
                    </Label>
                    <Input
                      id="guarantorDocs"
                      name="guarantorDocs"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500">If you have a guarantor or co-signer</p>
                    {formData.guarantorDocs && (
                      <p className="text-xs text-green-600">✓ {formData.guarantorDocs.name}</p>
                    )}
                  </div>

                  {/* Pet Vaccination Records */}
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-[#D5D7DA]">
                    <Label htmlFor="petVaccinationRecords" className="text-base font-semibold">
                      Pet Vaccination Records (Optional)
                    </Label>
                    <Input
                      id="petVaccinationRecords"
                      name="petVaccinationRecords"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500">If you have pets</p>
                    {formData.petVaccinationRecords && (
                      <p className="text-xs text-green-600">✓ {formData.petVaccinationRecords.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#968470] hover:bg-[#968470] text-white"
                  size="lg"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Your information is secure and will only be used for the rental application process.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Applications Dialog */}
      <Dialog open={applicationsDialogOpen} onOpenChange={setApplicationsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>My Rental Applications</DialogTitle>
            <DialogDescription>
              View the status of all your submitted rental applications
            </DialogDescription>
          </DialogHeader>

          {applicationsLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">No applications yet. Submit one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <Card key={app.id} className="border border-[#D5D7DA]">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{app.fullName}</CardTitle>
                        <CardDescription>{app.email}</CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-medium">Phone</p>
                        <p className="text-gray-900">{app.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Desired Move-in</p>
                        <p className="text-gray-900">
                          {new Date(app.desiredMoveInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Monthly Income</p>
                        <p className="text-gray-900">${Number(app.monthlyIncome).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Employment Status</p>
                        <p className="text-gray-900 capitalize">{app.employmentStatus}</p>
                      </div>
                    </div>
                    <div className="border-t border-[#D5D7DA] pt-3">
                      <p className="text-gray-600 font-medium mb-1">Current Address</p>
                      <p className="text-gray-900">{app.currentAddress}</p>
                    </div>
                    {app.hasPets && (
                      <div className="border-t border-[#D5D7DA] pt-3">
                        <p className="text-gray-600 font-medium mb-1">Pet Information</p>
                        <p className="text-gray-900">
                          {app.petType} ({app.petBreed}) - {app.petWeight} lbs
                        </p>
                      </div>
                    )}
                    <div className="border-t border-[#D5D7DA] pt-3 text-xs text-gray-500">
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

