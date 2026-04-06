import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user?: any;
  isViewOnly?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isViewOnly = false,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (user) {
      reset(user);
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'user',
        mobile: '',
      });
    }
  }, [user, reset]);

  const onFormSubmit = (data: any) => {
    if (isViewOnly) return;
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isViewOnly ? 'User Details' : user ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              {...register('name', { required: true })} 
              placeholder="e.g. John Doe" 
              disabled={isViewOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              {...register('email', { required: true })} 
              placeholder="e.g. john@example.com" 
              disabled={isViewOnly || !!user}
            />
          </div>

          {!user && !isViewOnly && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                {...register('password', { required: true })} 
                placeholder="Initial password" 
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input 
                id="mobile" 
                {...register('mobile')} 
                placeholder="e.g. +1234567890" 
                disabled={isViewOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                disabled={isViewOnly}
                onValueChange={(val) => setValue('role', val)}
                defaultValue={user?.role || 'user'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isViewOnly && (
              <Button type="submit">
                {user ? 'Update User' : 'Create User'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  function onOpenChangeHandler(open: boolean) {
    if (!open) onClose();
  }
};
