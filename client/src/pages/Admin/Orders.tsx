import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical, 
  Truck, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ShoppingBag,
  CreditCard,
  MapPin,
  Smartphone,
  RefreshCw,
  CalendarDays
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.orders.getAll(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api.orders.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update order status");
    }
  });

  const handleStatusUpdate = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-1">Found {ordersData?.length || 0} orders in total.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 gap-2 border-dashed">
            <CalendarDays size={18} />
            Period
          </Button>
          <Button variant="outline" className="h-10 gap-2 border-dashed">
            <Download size={18} />
            Export Orders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: 'New Orders', value: ordersData?.filter((o: any) => o.status === 'Placed').length.toString() || '0', color: 'blue' },
          { icon: Truck, label: 'In Transit', value: ordersData?.filter((o: any) => o.status === 'Shipped').length.toString() || '0', color: 'amber' },
          { icon: PackageCheck, label: 'Completed', value: ordersData?.filter((o: any) => o.status === 'Delivered').length.toString() || '0', color: 'green' },
          { icon: XCircle, label: 'Cancelled', value: ordersData?.filter((o: any) => o.status === 'Cancelled').length.toString() || '0', color: 'red' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-4 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 border-b pb-6 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                placeholder="Search by Order ID, customer name or phone..." 
                className="pl-10 bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-xl transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Button variant="outline" size="sm" className="h-9 gap-2"><Filter size={16} /> Advanced Filter</Button>
              <div className="w-[1px] h-4 bg-muted mx-1"></div>
              <Button variant="ghost" size="sm" className="h-9 text-muted-foreground">This Week</Button>
              <Button variant="ghost" size="sm" className="h-9 text-muted-foreground">This Month</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/30 bg-muted/5 h-14">
                <TableHead className="w-[120px] pl-6 font-bold text-foreground uppercase text-[11px] tracking-widest">Order ID</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-[11px] tracking-widest">Customer</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-[11px] tracking-widest">Items</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-[11px] tracking-widest">Amount</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-[11px] tracking-widest">Method</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-[11px] tracking-widest">Status</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-[11px] tracking-widest">Date</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
                      <RefreshCw className="animate-spin" size={16} />
                      Loading orders...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (ordersData || []).map((order: any) => (
                <TableRow key={order.id} className="group border-muted/20 hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6 font-bold text-primary">#{order.orderId?.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{order.shippingAddress?.name || 'Customer'}</div>
                    <div className="text-[11px] text-muted-foreground font-medium">{order.shippingAddress?.email || 'No email'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <ShoppingBag size={14} className="text-foreground/40" />
                      {order.items?.length || 0} items
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-foreground">${order.totalAmount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <CreditCard size={14} className="text-foreground/40" />
                      {order.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                        order.status === 'Placed' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                        'bg-red-50 text-red-700 hover:bg-red-100'
                      } border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase shadow-sm transition-all`}
                    >
                      {order.status === 'Placed' && <Clock size={10} className="mr-1 inline" />}
                      {order.status === 'Shipped' && <Truck size={10} className="mr-1 inline" />}
                      {order.status === 'Delivered' && <CheckCircle2 size={10} className="mr-1 inline" />}
                      {order.status === 'Cancelled' && <XCircle size={10} className="mr-1 inline" />}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-xs">
                    {order.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt)) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                              < Truck size={16}/> Update Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-40">
                              <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Placed')}><Clock size={14}/> Placed</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Shipped')}><Truck size={14}/> Shipped</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Delivered')}><PackageCheck size={14}/> Delivered</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}><XCircle size={14}/> Cancelled</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem className="gap-2"><CheckCircle2 size={16}/> Mark as Paid</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><MapPin size={16}/> Track Location</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2"><Smartphone size={16}/> Contact Customer</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive gap-2 focus:text-destructive focus:bg-destructive/10"><XCircle size={16}/> Refund Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground p-6 bg-card rounded-2xl border shadow-sm">
        <p>Showing <span className="font-bold text-foreground">7</span> from <span className="font-bold text-foreground">1,240</span> orders</p>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="rounded-lg px-6 h-10 hover:bg-muted hover:text-foreground">Previous</Button>
           <Button variant="outline" size="sm" className="rounded-lg px-6 h-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
