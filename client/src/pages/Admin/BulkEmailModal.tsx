import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role: string, subject: string, message: string }) => void;
}

export const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      role: 'all',
      subject: '',
      message: '',
    }
  });

  const role = watch('role');

  const onFormSubmit = (data: any) => {
    if (!data.subject || !data.message) {
      toast({ title: "Missing Information", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Bulk Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Recipient Audience</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(val) => setValue('role', val)}
              className="flex items-center gap-4 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">All Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">Customers Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="staff" id="r3" />
                <Label htmlFor="r3" className="cursor-pointer">Staff Only</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input 
              id="subject" 
              {...register('subject', { required: true })} 
              placeholder="e.g. Important Maintenance Update" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message Body Content</Label>
            <Textarea 
              id="message" 
              {...register('message', { required: true })} 
              placeholder="Write your announcement or offer details here..." 
              className="min-h-[150px]"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Broadcast Email</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  function onOpenChangeHandler(open: boolean) {
    if (!open) onClose();
  }
};
