
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X, AlertTriangle, FileText, Building } from "lucide-react";

const GapReviewScreen = () => {
  const [currentGapIndex, setCurrentGapIndex] = useState(0);
  const [reviewedGaps, setReviewedGaps] = useState<{ [key: number]: 'acknowledged' | 'dismissed' }>({});

  const gaps = [
    {
      id: 1,
      regulation: "Notice PSN01 - Section 3.2.1",
      regulationText: "Payment service providers must implement enhanced customer verification procedures for transactions exceeding S$5,000, including additional documentation requirements and real-time risk assessment protocols.",
      currentPolicy: "Customer Verification Policy - Section 2.4",
      policyText: "Verification procedures apply to transactions above S$10,000. Enhanced documentation is required for amounts exceeding S$20,000.",
      analysis: "Current policy threshold is too high (S$10,000 vs required S$5,000). Real-time risk assessment protocols are not explicitly mentioned in current procedures.",
      severity: "High",
      impactArea: "Customer Onboarding"
    },
    {
      id: 2,
      regulation: "Technology Risk Management Guidelines - Section 4.1.3",
      regulationText: "Financial institutions must conduct penetration testing at least bi-annually and maintain comprehensive vulnerability assessment documentation with quarterly reviews.",
      currentPolicy: "Information Security Policy - Section 7.2",
      policyText: "Penetration testing is conducted annually. Vulnerability assessments are performed semi-annually with documentation reviewed annually.",
      analysis: "Frequency of penetration testing needs to increase from annual to bi-annual. Vulnerability assessment documentation review frequency must change from annual to quarterly.",
      severity: "Medium",
      impactArea: "Technology Risk"
    },
    {
      id: 3,
      regulation: "AML/CFT Guidelines - Section 2.5.2",
      regulationText: "Enhanced due diligence measures must be applied to all cross-border transactions involving jurisdictions identified as high-risk by FATF, with ongoing monitoring requirements.",
      currentPolicy: "AML Policy - Section 4.1",
      policyText: "Enhanced due diligence applies to PEP transactions and transactions above S$50,000. High-risk jurisdiction monitoring is conducted on a risk-based approach.",
      analysis: "Policy does not explicitly require enhanced due diligence for ALL transactions involving FATF high-risk jurisdictions regardless of amount. Ongoing monitoring requirements need clarification.",
      severity: "High",
      impactArea: "AML/CFT Compliance"
    }
  ];

  const currentGap = gaps[currentGapIndex];

  const handleGapReview = (gapId: number, decision: 'acknowledged' | 'dismissed') => {
    setReviewedGaps(prev => ({ ...prev, [gapId]: decision }));
    
    // Move to next gap if available
    if (currentGapIndex < gaps.length - 1) {
      setCurrentGapIndex(currentGapIndex + 1);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const completedReviews = Object.keys(reviewedGaps).length;
  const acknowledgedGaps = Object.values(reviewedGaps).filter(decision => decision === 'acknowledged').length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Gap Review Progress</h2>
              <p className="text-blue-700 mt-1">
                Reviewing policy gaps identified by CompliAgent Analysis
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {completedReviews}/{gaps.length}
              </div>
              <p className="text-sm text-blue-600">Gaps Reviewed</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedReviews / gaps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentGapIndex < gaps.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MAS Regulation Panel */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">MAS Regulation</CardTitle>
              </div>
              <p className="text-sm text-blue-600 font-medium">{currentGap.regulation}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {currentGap.regulationText}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Policy Panel */}
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-lg text-orange-900">Current Policy</CardTitle>
              </div>
              <p className="text-sm text-orange-600 font-medium">{currentGap.currentPolicy}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {currentGap.policyText}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              All Gaps Reviewed!
            </h3>
            <p className="text-green-700 mb-4">
              You have successfully reviewed all {gaps.length} identified gaps.
            </p>
            <div className="bg-white rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{acknowledgedGaps}</span> gaps acknowledged for policy updates
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-600">{gaps.length - acknowledgedGaps}</span> gaps dismissed
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis and Actions */}
      {currentGapIndex < gaps.length && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">CompliAgent Analysis</CardTitle>
              <div className="flex items-center space-x-3">
                <Badge className={getSeverityColor(currentGap.severity)}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {currentGap.severity} Severity
                </Badge>
                <Badge variant="outline">
                  {currentGap.impactArea}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">
                {currentGap.analysis}
              </p>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Gap {currentGapIndex + 1} of {gaps.length}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleGapReview(currentGap.id, 'dismissed')}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Dismiss Gap</span>
                </Button>
                
                <Button
                  onClick={() => handleGapReview(currentGap.id, 'acknowledged')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Acknowledge Gap</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation for reviewed gaps */}
      {completedReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reviewed Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {gaps.slice(0, completedReviews).map((gap, index) => (
                <div
                  key={gap.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    reviewedGaps[gap.id] === 'acknowledged' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setCurrentGapIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gap {index + 1}</span>
                    {reviewedGaps[gap.id] === 'acknowledged' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {gap.impactArea}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GapReviewScreen;
