
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, CheckCircle, Eye, Edit, BarChart } from "lucide-react";
import { getStatusBadgeClass, getPriorityBorderClass, calculateDaysUntilDate, formatDate } from "@/lib/compliance-utils";
import { cn } from "@/lib/utils";

interface RegulatoryItem {
  id: number;
  title: string;
  publicationDate: string;
  closingDate: string;
  status: string;
  priority: string;
  gapsFound: number;
  type: string;
}

interface RegulatoryCardProps {
  item: RegulatoryItem;
  onViewGaps: () => void;
  onAmendPolicies: () => void;
  onGenerateReport: () => void;
  onViewAnalysis: () => void;
  onStartAnalysis: () => void;
}

const RegulatoryCard = ({ 
  item, 
  onViewGaps, 
  onAmendPolicies, 
  onGenerateReport, 
  onViewAnalysis,
  onStartAnalysis 
}: RegulatoryCardProps) => {
  const daysUntilClosing = calculateDaysUntilDate(item.closingDate);
  const isOverdue = daysUntilClosing < 0 && item.status !== "Completed";

  return (
    <Card className={cn("compliance-card", getPriorityBorderClass(item.priority))}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start space-x-3">
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {item.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {item.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status and Priority */}
        <div className="flex items-center justify-between">
          <Badge className={getStatusBadgeClass(item.status)}>
            {item.status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
            {item.status === "Gaps Identified" && <AlertTriangle className="w-3 h-3 mr-1" />}
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
          
          {daysUntilClosing <= 7 && daysUntilClosing > 0 && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {daysUntilClosing} days left
            </Badge>
          )}
          
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="font-medium">Published</p>
              <p>{formatDate(item.publicationDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <div>
              <p className="font-medium">Closes</p>
              <p>{formatDate(item.closingDate)}</p>
            </div>
          </div>
        </div>

        {/* Gaps Information */}
        {item.gapsFound > 0 && (
          <div className="info-section-alert">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {item.gapsFound} policy gap{item.gapsFound > 1 ? 's' : ''} identified
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {item.status === "Gaps Identified" && (
            <Button 
              onClick={onViewGaps}
              size="sm" 
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review Gaps
            </Button>
          )}
          
          {(item.status === "Gaps Identified" || item.status === "Analysis in Progress") && (
            <Button 
              onClick={onAmendPolicies}
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Amend Policies
            </Button>
          )}
          
          {item.status === "New" && (
            <Button onClick={onStartAnalysis} size="sm" className="flex-1">
              Start Analysis
            </Button>
          )}
          
          {item.status === "Completed" && (
            <Button onClick={onViewAnalysis} variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Analysis
            </Button>
          )}
          
          {(item.status === "Gaps Identified" || item.status === "Completed") && (
            <Button 
              onClick={onGenerateReport}
              variant="secondary" 
              size="sm" 
              className="flex-1"
            >
              <BarChart className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryCard;
