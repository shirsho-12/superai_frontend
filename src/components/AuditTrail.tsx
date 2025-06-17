
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, FileText, Edit, CheckCircle, X, Download, Filter } from "lucide-react";

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  details: string;
  ipAddress: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

const AuditTrail: React.FC = () => {
  const [filterBy, setFilterBy] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7d");

  const auditEvents: AuditEvent[] = [
    {
      id: "ae1",
      timestamp: "2024-06-17T10:30:00Z",
      userId: "tana-chen",
      userName: "Tana Chen",
      userRole: "Chief Risk & Compliance Officer",
      action: "GAP_ACKNOWLEDGED",
      resourceType: "compliance_gap",
      resourceId: "gap-001",
      resourceName: "Customer identification requirements enhancement",
      details: "Acknowledged compliance gap for PSN01 amendments",
      ipAddress: "192.168.1.101",
      sessionId: "sess_abc123",
      metadata: { regulationId: "reg-001", severity: "high" }
    },
    {
      id: "ae2",
      timestamp: "2024-06-17T09:45:00Z",
      userId: "sarah-wong",
      userName: "Sarah Wong",
      userRole: "Junior Analyst",
      action: "TASK_ASSIGNED",
      resourceType: "analysis_task",
      resourceId: "task-002",
      resourceName: "Transaction monitoring threshold analysis",
      details: "Task assigned by Tana Chen with high priority",
      ipAddress: "192.168.1.102",
      sessionId: "sess_def456",
      metadata: { assignedBy: "tana-chen", priority: "high", dueDate: "2024-06-20" }
    },
    {
      id: "ae3",
      timestamp: "2024-06-17T09:15:00Z",
      userId: "tana-chen",
      userName: "Tana Chen",
      userRole: "Chief Risk & Compliance Officer",
      action: "AMENDMENT_APPROVED",
      resourceType: "policy_amendment",
      resourceId: "amend-003",
      resourceName: "AML/CFT Policy Section 3.2 update",
      details: "Approved policy amendment for enhanced due diligence requirements",
      ipAddress: "192.168.1.101",
      sessionId: "sess_abc123",
      metadata: { policyId: "aml-cft-001", sectionModified: "3.2" }
    },
    {
      id: "ae4",
      timestamp: "2024-06-16T16:20:00Z",
      userId: "system",
      userName: "System",
      userRole: "System",
      action: "GAP_DETECTED",
      resourceType: "compliance_gap",
      resourceId: "gap-004",
      resourceName: "Data retention period mismatch",
      details: "Automated gap detection found policy mismatch with new regulations",
      ipAddress: "127.0.0.1",
      sessionId: "sys_automated",
      metadata: { confidence: 0.95, aiModel: "gap-detector-v2" }
    },
    {
      id: "ae5",
      timestamp: "2024-06-16T14:30:00Z",
      userId: "marcus-tan",
      userName: "Marcus Tan",
      userRole: "Senior Analyst",
      action: "REPORT_GENERATED",
      resourceType: "executive_report",
      resourceId: "report-005",
      resourceName: "PSN01 Impact Summary Report",
      details: "Generated executive summary report for board presentation",
      ipAddress: "192.168.1.103",
      sessionId: "sess_ghi789",
      metadata: { reportType: "executive", regulationCount: 2, policyChanges: 5 }
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "GAP_ACKNOWLEDGED": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "GAP_DETECTED": return <FileText className="w-4 h-4 text-orange-600" />;
      case "AMENDMENT_APPROVED": return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "AMENDMENT_REJECTED": return <X className="w-4 h-4 text-red-600" />;
      case "TASK_ASSIGNED": return <User className="w-4 h-4 text-purple-600" />;
      case "REPORT_GENERATED": return <FileText className="w-4 h-4 text-indigo-600" />;
      default: return <Edit className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const baseClasses = "text-xs font-medium";
    switch (action) {
      case "GAP_ACKNOWLEDGED": return `${baseClasses} bg-green-100 text-green-800`;
      case "GAP_DETECTED": return `${baseClasses} bg-orange-100 text-orange-800`;
      case "AMENDMENT_APPROVED": return `${baseClasses} bg-blue-100 text-blue-800`;
      case "AMENDMENT_REJECTED": return `${baseClasses} bg-red-100 text-red-800`;
      case "TASK_ASSIGNED": return `${baseClasses} bg-purple-100 text-purple-800`;
      case "REPORT_GENERATED": return `${baseClasses} bg-indigo-100 text-indigo-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredEvents = auditEvents.filter(event => {
    if (filterBy === "all") return true;
    return event.action === filterBy;
  });

  const exportAuditLog = () => {
    // In a real implementation, this would generate a CSV/PDF export
    console.log("Exporting audit log...", filteredEvents);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Compliance Audit Trail</CardTitle>
          <p className="text-gray-500">Complete immutable record of all system actions and user activities</p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter & Export</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="GAP_DETECTED">Gap Detection</SelectItem>
                  <SelectItem value="GAP_ACKNOWLEDGED">Gap Acknowledgment</SelectItem>
                  <SelectItem value="AMENDMENT_APPROVED">Amendment Approval</SelectItem>
                  <SelectItem value="TASK_ASSIGNED">Task Assignment</SelectItem>
                  <SelectItem value="REPORT_GENERATED">Report Generation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={exportAuditLog} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getActionIcon(event.action)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getActionBadge(event.action)}>
                          {event.action.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-medium">{event.resourceName}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.details}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{event.userName} ({event.userRole})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                        <div>
                          <span>IP: {event.ipAddress}</span>
                        </div>
                        <div>
                          <span>Session: {event.sessionId.substring(0, 8)}...</span>
                        </div>
                      </div>
                      {event.metadata && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Metadata: </span>
                          {JSON.stringify(event.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
