
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, AlertCircle, CheckCircle, FileText, Users, TrendingUp, BarChart } from "lucide-react";
import RegulatoryCard from "@/components/RegulatoryCard";
import GapReviewScreen from "@/components/GapReviewScreen";
import AmendmentWorkbench from "@/components/AmendmentWorkbench";
import ExecutiveReport from "@/components/ExecutiveReport";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedRegulation, setSelectedRegulation] = useState<{ id: number; title: string } | null>(null);
  
  // Mock data for regulatory items
  const regulatoryItems = [
    {
      id: 1,
      title: "Consultation Paper on Proposed Amendments to Notice PSN01",
      publicationDate: "2024-06-10",
      closingDate: "2024-07-05",
      status: "Analysis in Progress",
      priority: "high",
      gapsFound: 3,
      type: "consultation"
    },
    {
      id: 2,
      title: "Technology Risk Management Guidelines Update",
      publicationDate: "2024-06-08",
      closingDate: "2024-06-25",
      status: "Gaps Identified",
      priority: "urgent",
      gapsFound: 5,
      type: "guideline"
    },
    {
      id: 3,
      title: "Digital Payment Token Services - Licensing Framework",
      publicationDate: "2024-05-28",
      closingDate: "2024-06-20",
      status: "Completed",
      priority: "medium",
      gapsFound: 0,
      type: "framework"
    },
    {
      id: 4,
      title: "AML/CFT Requirements for Money Service Businesses",
      publicationDate: "2024-06-15",
      closingDate: "2024-07-15",
      status: "New",
      priority: "medium",
      gapsFound: 0,
      type: "notice"
    }
  ];

  const stats = {
    totalDocuments: 24,
    pendingGaps: 8,
    completedReviews: 16,
    urgentItems: 2
  };

  const handleViewGaps = (item: { id: number; title: string }) => {
    setSelectedRegulation(item);
    setActiveTab("gaps");
  };

  const handleAmendPolicies = (item: { id: number; title: string }) => {
    setSelectedRegulation(item);
    setActiveTab("amendments");
  };

  const handleGenerateReport = (item: { id: number; title: string }) => {
    setSelectedRegulation(item);
    setActiveTab("reports");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CompliAgent-SG</h1>
                <p className="text-sm text-gray-500">Regulatory Change Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Users className="w-3 h-3 mr-1" />
                MPI Licensed
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Tana Chen</p>
                <p className="text-xs text-gray-500">Chief Risk & Compliance Officer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Regulatory Horizon</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Gap Review</span>
            </TabsTrigger>
            <TabsTrigger value="amendments" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Amendment Workbench</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart className="w-4 h-4" />
              <span>Executive Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Documents</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalDocuments}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Pending Gaps</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.pendingGaps}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Completed Reviews</p>
                      <p className="text-2xl font-bold text-green-900">{stats.completedReviews}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Urgent Items</p>
                      <p className="text-2xl font-bold text-red-900">{stats.urgentItems}</p>
                    </div>
                    <Clock className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regulatory Items Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Active Regulatory Items</h2>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Filter by Date
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {regulatoryItems.map((item) => (
                  <RegulatoryCard 
                    key={item.id} 
                    item={item} 
                    onViewGaps={() => handleViewGaps(item)}
                    onAmendPolicies={() => handleAmendPolicies(item)}
                    onGenerateReport={() => handleGenerateReport(item)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gaps">
            <GapReviewScreen regulation={selectedRegulation} />
          </TabsContent>

          <TabsContent value="amendments">
            <AmendmentWorkbench regulation={selectedRegulation} />
          </TabsContent>

          <TabsContent value="reports">
            {selectedRegulation ? (
              <ExecutiveReport 
                regulationTitle={selectedRegulation.title}
                regulationId={selectedRegulation.id.toString()}
              />
            ) : (
              <div className="text-center py-12">
                <BarChart className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">Select a regulation first</h3>
                <p className="text-gray-500">Please select a regulatory item to generate an executive report</p>
                <Button 
                  onClick={() => setActiveTab("dashboard")} 
                  variant="outline" 
                  className="mt-4"
                >
                  Go to Regulatory Horizon
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
