
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, UserPlus, Shield, Eye, Edit, Trash2, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  department: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "tana-chen",
      name: "Tana Chen",
      email: "tana.chen@company.com",
      role: "compliance_lead",
      status: "active",
      lastLogin: "2024-06-17T10:30:00Z",
      department: "Risk & Compliance"
    },
    {
      id: "sarah-wong",
      name: "Sarah Wong",
      email: "sarah.wong@company.com",
      role: "junior_analyst",
      status: "active",
      lastLogin: "2024-06-17T09:45:00Z",
      department: "Risk & Compliance"
    },
    {
      id: "marcus-tan",
      name: "Marcus Tan",
      email: "marcus.tan@company.com",
      role: "senior_analyst",
      status: "active",
      lastLogin: "2024-06-16T14:30:00Z",
      department: "Risk & Compliance"
    },
    {
      id: "external-auditor",
      name: "Jane Smith",
      email: "jane.smith@auditfirm.com",
      role: "external_auditor",
      status: "active",
      lastLogin: "2024-06-15T11:20:00Z",
      department: "External"
    }
  ]);

  const roles: UserRole[] = [
    {
      id: "compliance_lead",
      name: "Compliance Lead",
      description: "Full system access with approval authority",
      permissions: [
        "view_all_gaps",
        "acknowledge_gaps",
        "approve_amendments",
        "assign_tasks",
        "generate_reports",
        "manage_users",
        "view_audit_trail",
        "export_data"
      ]
    },
    {
      id: "senior_analyst",
      name: "Senior Analyst",
      description: "Advanced analysis capabilities with limited approval rights",
      permissions: [
        "view_all_gaps",
        "acknowledge_gaps",
        "suggest_amendments",
        "assign_tasks",
        "generate_reports",
        "view_audit_trail"
      ]
    },
    {
      id: "junior_analyst",
      name: "Junior Analyst",
      description: "Basic analysis and review capabilities",
      permissions: [
        "view_assigned_gaps",
        "comment_on_gaps",
        "suggest_amendments",
        "view_reports"
      ]
    },
    {
      id: "external_auditor",
      name: "External Auditor",
      description: "Read-only access for audit purposes",
      permissions: [
        "view_audit_trail",
        "view_reports",
        "export_audit_data"
      ]
    }
  ];

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: ""
  });

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const user: SystemUser = {
      id: newUser.name.toLowerCase().replace(/\s+/g, '-'),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastLogin: "",
      department: newUser.department
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "", department: "" });
    setIsAddUserOpen(false);
    
    toast({
      title: "User added successfully",
      description: `${user.name} has been added to the system`
    });
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "inactive" as const } : user
    ));
    toast({
      title: "User deactivated",
      description: "User access has been suspended"
    });
  };

  const getRoleBadgeColor = (roleId: string) => {
    switch (roleId) {
      case "compliance_lead": return "bg-purple-100 text-purple-800";
      case "senior_analyst": return "bg-blue-100 text-blue-800";
      case "junior_analyst": return "bg-green-100 text-green-800";
      case "external_auditor": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">User Management</CardTitle>
              <p className="text-gray-500">Manage user access and role-based permissions</p>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      Add User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>System Users ({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleName(user.role)}
                        </Badge>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      {user.status === "active" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          <Lock className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {user.lastLogin && (
                    <p className="text-xs text-gray-400 mt-2">
                      Last login: {new Date(user.lastLogin).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Role Definitions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-semibold">{role.name}</h4>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
