
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserPlus, Calendar, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TaskAssignmentModalProps {
  gapId: number;
  gapDescription: string;
  onAssign: (assignment: TaskAssignment) => void;
}

interface TaskAssignment {
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  notes: string;
}

const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({ gapId, gapDescription, onAssign }) => {
  const [open, setOpen] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [notes, setNotes] = useState("");

  const analysts = [
    { id: "1", name: "Sarah Wong", role: "Junior Analyst" },
    { id: "2", name: "Marcus Tan", role: "Senior Analyst" },
    { id: "3", name: "Lisa Chen", role: "Junior Analyst" }
  ];

  const handleAssign = () => {
    if (!assignee || !dueDate) {
      toast({
        title: "Missing information",
        description: "Please select an assignee and due date",
        variant: "destructive"
      });
      return;
    }

    const selectedAnalyst = analysts.find(a => a.id === assignee);
    if (!selectedAnalyst) return;

    const assignment: TaskAssignment = {
      assigneeId: assignee,
      assigneeName: selectedAnalyst.name,
      dueDate,
      priority,
      notes
    };

    onAssign(assignment);
    setOpen(false);
    toast({
      title: "Task assigned successfully",
      description: `Gap analysis assigned to ${selectedAnalyst.name}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Gap Analysis Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Gap Description:</p>
            <p className="text-sm text-gray-700 mt-1">{gapDescription}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignee">Assign to</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select analyst" />
              </SelectTrigger>
              <SelectContent>
                {analysts.map((analyst) => (
                  <SelectItem key={analyst.id} value={analyst.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{analyst.name}</span>
                      <Badge variant="outline" className="ml-2">{analyst.role}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific instructions or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              Assign Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;
