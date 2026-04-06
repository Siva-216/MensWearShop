import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  UserPlus,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  User,
  Settings2,
  RefreshCw
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { UserModal } from './UserModal';
import { BulkEmailModal } from './BulkEmailModal';

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.users.getAll(),
  });

  const isAdmin = currentUser?.role === 'admin';

  const createMutation = useMutation({
    mutationFn: (data: any) => api.users.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "User Created", description: "The new user has been added successfully." });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error Creating User", description: error.message || "Failed to create user.", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.users.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "User Updated", description: "The user information has been updated successfully." });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error Updating User", description: error.message || "Failed to update user.", variant: "destructive" });
    }
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string, role: string }) => api.users.update(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "Role Updated", description: "The user role has been changed successfully." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "User Deleted", description: "Account removed successfully." });
    }
  });

  const bulkEmailMutation = useMutation({
    mutationFn: (data: { role: string, subject: string, message: string }) => api.users.sendBulkEmail(data),
    onSuccess: (data: any) => {
      toast({ title: "Emails Sent", description: "The bulk notification has been broadcast successfully." });
      setIsBulkEmailModalOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error Sending Email", description: "Failed to broadcast bulk emails.", variant: "destructive" });
    }
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!isAdmin) return;
    roleMutation.mutate({ id: userId, role: newRole });
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setSelectedUser(user);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (user: any) => {
    setSelectedUser(user);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    if (modalType === 'add') {
      createMutation.mutate(data);
    } else if (modalType === 'edit' && selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data });
    }
  };

  const handleBulkEmailSubmit = (data: any) => {
    bulkEmailMutation.mutate(data);
  };

  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    return usersData.filter((user: any) => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [usersData, searchTerm, roleFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Users Management</h2>
          <p className="text-muted-foreground mt-1">Manage your team and customer accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsBulkEmailModalOpen(true)} className="h-10 gap-2">
            <Mail size={18} />
            Bulk Email
          </Button>
          <Button onClick={handleOpenAddModal} className="h-10 gap-2 shadow-lg shadow-primary/20">
            <UserPlus size={18} />
            Add New User
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b pb-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                placeholder="Search by name, email or role..." 
                className="pl-10 bg-card/50 border-muted focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-xl transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button 
                variant={roleFilter === 'all' ? "outline" : "ghost"} 
                size="sm" 
                className={`h-9 rounded-lg ${roleFilter === 'all' ? 'bg-primary/5 border-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                onClick={() => setRoleFilter('all')}
              >
                All Roles
              </Button>
              <Button 
                variant={roleFilter === 'admin' ? "outline" : "ghost"} 
                size="sm" 
                className={`h-9 rounded-lg ${roleFilter === 'admin' ? 'bg-primary/5 border-primary/20 text-primary font-bold' : 'text-muted-foreground hover:bg-muted'}`}
                onClick={() => setRoleFilter('admin')}
              >
                Admin
              </Button>
              <Button 
                variant={roleFilter === 'staff' ? "outline" : "ghost"} 
                size="sm" 
                className={`h-9 rounded-lg ${roleFilter === 'staff' ? 'bg-primary/5 border-primary/20 text-primary font-bold' : 'text-muted-foreground hover:bg-muted'}`}
                onClick={() => setRoleFilter('staff')}
              >
                Staff
              </Button>
              <Button 
                variant={roleFilter === 'user' ? "outline" : "ghost"} 
                size="sm" 
                className={`h-9 rounded-lg ${roleFilter === 'user' ? 'bg-primary/5 border-primary/20 text-primary font-bold' : 'text-muted-foreground hover:bg-muted'}`}
                onClick={() => setRoleFilter('user')}
              >
                Customer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/30 h-14 bg-muted/20">
                <TableHead className="w-[80px] pl-6"></TableHead>
                <TableHead className="font-bold text-foreground">User Name</TableHead>
                <TableHead className="font-bold text-foreground">Email</TableHead>
                <TableHead className="font-bold text-foreground">Role</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
                      <RefreshCw className="animate-spin" size={16} />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (filteredUsers).map((user: any) => (
                <TableRow key={user.id} className="group border-muted/20 transition-colors">
                  <TableCell className="pl-6">
                    <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                      <AvatarFallback className="font-bold bg-muted/50">{(user.name || 'U').split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground font-medium md:hidden">{user.email}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <Select 
                          defaultValue={user.role} 
                          onValueChange={(val) => handleRoleChange(user.id, val)}
                        >
                          <SelectTrigger className="h-9 w-[130px] bg-muted/30 border-none shadow-none font-semibold focus:ring-1 focus:ring-primary">
                            <div className="flex items-center gap-2 overflow-hidden truncate">
                               {user.role === 'admin' ? <ShieldCheck size={14} className="text-blue-500 shrink-0" /> : 
                                user.role === 'staff' ? <Shield size={14} className="text-amber-500 shrink-0" /> : 
                                <User size={14} className="text-slate-400 shrink-0" />}
                               <SelectValue placeholder="Role" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-muted-foreground/10">
                            <SelectItem value="admin" className="font-bold capitalize">Admin</SelectItem>
                            <SelectItem value="staff" className="font-bold capitalize text-amber-600">Staff</SelectItem>
                            <SelectItem value="user" className="font-bold capitalize text-slate-500">User</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg text-sm font-semibold opacity-80 cursor-not-allowed capitalize">
                          {user.role === 'admin' ? (
                            <ShieldCheck size={16} className="text-blue-500" />
                          ) : user.role === 'staff' ? (
                            <Shield size={16} className="text-amber-500" />
                          ) : (
                            <User size={16} className="text-slate-400" />
                          )}
                          <span className="font-medium">{user.role}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className="bg-green-100 text-green-700 hover:bg-green-200 border-none font-semibold px-3 py-1 rounded-full text-[11px] uppercase tracking-wide transition-colors"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleOpenViewModal(user)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-amber-600 hover:bg-amber-50"
                        onClick={() => handleOpenEditModal(user)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl px-8">
        <div>Showing {filteredUsers.length} of {usersData?.length || 0} users</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg h-9 w-20">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-lg h-9 w-20 bg-primary text-primary-foreground hover:bg-primary/90">Next</Button>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        user={selectedUser}
        isViewOnly={modalType === 'view'}
      />

      <BulkEmailModal 
        isOpen={isBulkEmailModalOpen}
        onClose={() => setIsBulkEmailModalOpen(false)}
        onSubmit={handleBulkEmailSubmit}
      />
    </div>
  );
};

export default UsersPage;
