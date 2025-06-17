
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, CheckCircle, Eye, Edit } from "lucide-react";

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
}

const RegulatoryCard = ({ item, onViewGaps, onAmendPolicies }: RegulatoryCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Analysis in Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Gaps Identified": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-4 border-l-red-500";
      case "high": return "border-l-4 border-l-orange-500";
      case "medium": return "border-l-4 border-l-yellow-500";
      default: return "border-l-4 border-l-gray-300";
    }
  };

  const getDaysUntilClosing = (closingDate: string) => {
    const today = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClosing = getDaysUntilClosing(item.closingDate);

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${getPriorityBorder(item.priority)}`}>
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
          <Badge className={getStatusColor(item.status)}>
            {item.status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
            {item.status === "Gaps Identified" && <AlertTriangle className="w-3 h-3 mr-1" />}
            {item.status}
          </Badge>
          
          {daysUntilClosing <= 7 && daysUntilClosing > 0 && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {daysUntilClosing} days left
            </Badge>
          )}
          
          {daysUntilClosing <= 0 && (
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
              <p>{new Date(item.publicationDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <div>
              <p className="font-medium">Closes</p>
              <p>{new Date(item.closingDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Gaps Information */}
        {item.gapsFound > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
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
        <div className="flex space-x-2 pt-2">
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
            <Button size="sm" className="flex-1">
              Start Analysis
            </Button>
          )}
          
          {item.status === "Completed" && (
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Summary
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryCard;
