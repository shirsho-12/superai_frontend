
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, AlertCircle, CheckCircle, FileText, Users, TrendingUp, BarChart, Globe, User, Shield, Activity, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import RegulatoryCard from "@/components/cards/RegulatoryCard";
import GapReviewScreen from "@/components/GapReviewScreen";
import AmendmentWorkbench from "@/components/AmendmentWorkbench";
import ExecutiveReport from "@/components/ExecutiveReport";
import MultiDocumentAnalysis from "@/components/MultiDocumentAnalysis";
import AuditTrail from "@/components/AuditTrail";
import UserManagement from "@/components/UserManagement";
import AutomatedIngestion from "@/components/AutomatedIngestion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

interface IndexProps {
  defaultTab?: string;
}

const Index = ({ defaultTab = "dashboard" }: IndexProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedRegulation, setSelectedRegulation] = useState<{ id: number; title: string } | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  
  // Mock data for regulatory items
  const regulatoryItems = [
    {
      id: 1,
      title: "1.1 Consultation Paper on Proposed Amendments to Notice PSN01 - Payment Services",
      publicationDate: "2024-06-10",
      closingDate: "2024-07-25",
      status: "Analysis in Progress",
      priority: "high",
      gapsFound: 3,
      type: "consultation"
    },
    {
      id: 2,
      title: "1.2 Technology Risk Management Guidelines Update for Payment Institutions",
      publicationDate: "2024-06-08",
      closingDate: "2024-06-25",
      status: "Gaps Identified",
      priority: "urgent",
      gapsFound: 5,
      type: "guideline"
    },
    {
      id: 3,
      title: "1.3 Digital Payment Token Services - Enhanced Licensing Framework",
      publicationDate: "2024-05-28",
      closingDate: "2024-07-20",
      status: "Completed",
      priority: "medium",
      gapsFound: 0,
      type: "framework"
    },
    {
      id: 4,
      title: "1.4 AML/CFT Requirements for Digital Payment Service Providers",
      publicationDate: "2024-06-15",
      closingDate: "2024-07-15",
      status: "New",
      priority: "medium",
      gapsFound: 0,
      type: "notice"
    },
    {
      id: 5,
      title: "1.5 Cybersecurity Standards for Payment Service Providers",
      publicationDate: "2024-06-12",
      closingDate: "2024-07-30",
      status: "Analysis in Progress",
      priority: "high",
      gapsFound: 2,
      type: "standard"
    },
    {
      id: 6,
      title: "1.6 Consumer Protection Measures for Digital Payment Services",
      publicationDate: "2024-06-05",
      closingDate: "2024-07-28",
      status: "Gaps Identified",
      priority: "medium",
      gapsFound: 4,
      type: "guideline"
    },
    {
      id: 7,
      title: "1.7 Cross-Border Payment Services Regulatory Framework",
      publicationDate: "2024-05-30",
      closingDate: "2024-07-22",
      status: "New",
      priority: "high",
      gapsFound: 0,
      type: "framework"
    },
    {
      id: 8,
      title: "1.8 Mobile Payment Security Guidelines for Financial Institutions",
      publicationDate: "2024-06-01",
      closingDate: "2024-07-18",
      status: "Completed",
      priority: "medium",
      gapsFound: 0,
      type: "guideline"
    },
    {
      id: 9,
      title: "1.9 Payment Service Provider Licensing Requirements Update",
      publicationDate: "2024-06-03",
      closingDate: "2024-07-26",
      status: "Analysis in Progress",
      priority: "high",
      gapsFound: 1,
      type: "framework"
    },
    {
      id: 10,
      title: "1.10 Digital Token Anti-Money Laundering Guidelines",
      publicationDate: "2024-06-07",
      closingDate: "2024-07-24",
      status: "New",
      priority: "urgent",
      gapsFound: 0,
      type: "guideline"
    }
  ];

  const filteredItems = useMemo(() => {
    if (!dateFilter) return regulatoryItems;
    
    return regulatoryItems.filter(item => {
      const itemDate = new Date(item.publicationDate);
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= filterDate;
    });
  }, [dateFilter]);

  const stats = {
    totalDocuments: regulatoryItems.length,
    pendingGaps: regulatoryItems.reduce((sum, item) => sum + item.gapsFound, 0),
    completedReviews: regulatoryItems.filter(item => item.status === "Completed").length,
    urgentItems: regulatoryItems.filter(item => item.priority === "urgent").length
  };

  const handleViewGaps = (item: { id: number; title: string }) => {
    setSelectedRegulation(item);
    setActiveTab("gaps");
  };

  const handleAmendPolicies = (item: { id: number; title: string }) => {
    setSelectedRegulation(item);
    setActiveTab("amendments");
  };

  const handleGenerateReport = async (item: { id: number; title: string }) => {
    setLoadingStates(prev => ({ ...prev, [`report-${item.id}`]: true }));
    
    // Simulate loading for 1-3 seconds
    const loadTime = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, loadTime));
    
    setLoadingStates(prev => ({ ...prev, [`report-${item.id}`]: false }));
    setSelectedRegulation(item);
    setActiveTab("reports");
    
    toast({
      title: "Report Generated",
      description: "Executive report has been generated successfully"
    });
  };

  const handleViewAnalysis = (item: { id: number; title: string }) => {
    setSelectedRegulation(item);
    setActiveTab("analysis");
  };

  const handleStartAnalysis = async (item: { id: number; title: string }) => {
    setLoadingStates(prev => ({ ...prev, [`analysis-${item.id}`]: true }));
    
    // Simulate loading for 1-3 seconds
    const loadTime = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, loadTime));
    
    setLoadingStates(prev => ({ ...prev, [`analysis-${item.id}`]: false }));
    
    toast({
      title: "Analysis Started",
      description: "Document analysis has been initiated"
    });
  };

  return (
    <div className="min-h-screen gradient-header">
      {/* Loading overlay */}
      {Object.values(loadingStates).some(loading => loading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-3">
            <LoadingSpinner size="lg" />
            <span className="text-lg font-medium">Processing...</span>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <a href="https://raw.githubusercontent.com/LuqDaMan/compliagent-horizon-view/refs/heads/main/logo.jpg">
                <img 
                  src="https://raw.githubusercontent.com/LuqDaMan/compliagent-horizon-view/refs/heads/main/logo.jpg" 
                  alt="CompliAgent Logo" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cntrl+Comply</h1>
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
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Gaps</span>
            </TabsTrigger>
            <TabsTrigger value="amendments" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Amendments</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart className="w-4 h-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Audit</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="ingestion" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Ingestion</span>
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
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {dateFilter ? format(dateFilter, "MMM dd, yyyy") : "Filter by Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                      {dateFilter && (
                        <div className="p-2 border-t">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDateFilter(undefined)}
                            className="w-full"
                          >
                            Clear Filter
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <RegulatoryCard 
                    key={item.id} 
                    item={item} 
                    onViewGaps={() => handleViewGaps(item)}
                    onAmendPolicies={() => handleAmendPolicies(item)}
                    onGenerateReport={() => handleGenerateReport(item)}
                    onViewAnalysis={() => handleViewAnalysis(item)}
                    onStartAnalysis={() => handleStartAnalysis(item)}
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
                  Go to Dashboard
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis">
            <MultiDocumentAnalysis />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="ingestion">
            <AutomatedIngestion onNavigateToDashboard={() => setActiveTab("dashboard")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
