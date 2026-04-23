import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
  CalendarDays,
  User,
  Phone,
  Mail,
  Hash,
  Receipt,
  Tag,
  ArrowLeft,
  ChevronLeft,
  Printer,
  Calendar,
  Box,
  BadgeDollarSign
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

type ViewMode = 'list' | 'detail';

const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { user: currentUser } = useAuth();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.orders.getAll(),
  });

  const getIsOfflineOrder = (order: any) => {
    return !!order.isOffline || !!order.offline || order.orderId?.startsWith('POS') || order.orderId?.startsWith('OFF');
  };

  const filteredOrders = (ordersData || []).filter((order: any) => {
    if (currentUser?.role === 'staff' && order.staffId !== currentUser.id) {
      return false;
    }
    const isOfflineOrder = getIsOfflineOrder(order);
    if (orderTypeFilter === 'online') return !isOfflineOrder;
    if (orderTypeFilter === 'offline') return !!isOfflineOrder;
    return true;
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api.orders.updateStatus(id, status),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order status updated successfully");
      if (selectedOrder) {
          setSelectedOrder((prev: any) => ({ ...prev, status: data?.status || prev.status }));
      }
    },
    onError: () => {
      toast.error("Failed to update order status");
    }
  });

  const handleStatusUpdate = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setViewMode('detail');
    window.scrollTo(0, 0);
  };

  const renderOrderList = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Orders Management</h2>
          <p className="text-muted-foreground mt-1">Found {filteredOrders.length} orders in total.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted p-1 rounded-xl border">
            <Button 
              variant={orderTypeFilter === 'online' ? 'default' : 'ghost'} 
              size="sm" 
              className={`rounded-lg px-4 ${orderTypeFilter === 'online' ? 'shadow-sm' : ''}`}
              onClick={() => setOrderTypeFilter('online')}
            >
              Online
            </Button>
            <Button 
              variant={orderTypeFilter === 'offline' ? 'default' : 'ghost'} 
              size="sm" 
              className={`rounded-lg px-4 ${orderTypeFilter === 'offline' ? 'shadow-sm' : ''}`}
              onClick={() => setOrderTypeFilter('offline')}
            >
              In-Store
            </Button>
            <Button 
              variant={orderTypeFilter === 'all' ? 'default' : 'ghost'} 
              size="sm" 
              className={`rounded-lg px-4 ${orderTypeFilter === 'all' ? 'shadow-sm' : ''}`}
              onClick={() => setOrderTypeFilter('all')}
            >
              All
            </Button>
          </div>
          <Button variant="outline" className="h-10 gap-2 border-dashed">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: 'New Orders', value: ordersData?.filter((o: any) => o.status === 'Placed').length.toString() || '0', color: 'blue' },
          { icon: Truck, label: 'In Transit', value: ordersData?.filter((o: any) => o.status === 'Shipped').length.toString() || '0', color: 'amber' },
          { icon: PackageCheck, label: 'Completed', value: ordersData?.filter((o: any) => o.status === 'Delivered' || o.status === 'Completed').length.toString() || '0', color: 'green' },
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
              ) : (filteredOrders).map((order: any) => {
                const isOfflineOrder = getIsOfflineOrder(order);
                return (
                <TableRow key={order.id} className="group border-muted/20 hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6 font-bold text-primary">#{order.orderId?.substring(0, 8)}</TableCell>
                  <TableCell>
                    {isOfflineOrder ? (
                      <>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {order.customerName || 'Store Customer'}
                          <Badge variant="outline" className="text-[9px] h-4 px-1 bg-muted/50 border-none font-bold uppercase">Store</Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium">{order.customerPhone || 'Walk-in'}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-foreground">{order.shippingAddress?.name || 'Customer'}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">{order.shippingAddress?.email || 'No email'}</div>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <ShoppingBag size={14} className="text-foreground/40" />
                      {order.items?.length || 0} items
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-foreground">₹{order.totalAmount?.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <CreditCard size={14} className="text-foreground/40" />
                      {order.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${
                        order.status === 'Delivered' || order.status === 'Completed' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                        order.status === 'Placed' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                        'bg-red-50 text-red-700 hover:bg-red-100'
                      } border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase shadow-sm transition-all`}
                    >
                      {(order.status === 'Delivered' || order.status === 'Completed') && <CheckCircle2 size={10} className="mr-1 inline" />}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-xs">
                    {order.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt)) : 'April 6, 2026'}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewDetails(order)}
                        className="h-8 w-8 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Order Placed')}>Mark as Order Placed</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Processing')}>Mark as Processing</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Out for Delivery')}>Mark as Out for Delivery</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleStatusUpdate(order.id, 'Delivered')}>Mark as Delivered</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrderDetail = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className="rounded-full h-12 w-12 hover:bg-muted group">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div>
            <h2 className="text-2xl font-display font-black tracking-tight">Order Details</h2>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Hash size={14} /> {selectedOrder.orderId}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="rounded-full px-6 h-11 gap-2 font-bold select-none border-2">
                <Printer size={18} /> Print Invoice
            </Button>
            <Button className="rounded-full px-6 h-11 font-black gap-2 bg-primary">
                Mark as Shipped
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary/5 py-6 px-8 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <ShoppingBag size={20} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-primary uppercase tracking-tight">Products ({selectedOrder.items?.length || 0})</h3>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-none font-black px-4">{selectedOrder.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-none h-12">
                                <TableHead className="pl-8 uppercase text-[10px] font-black tracking-widest opacity-50">Item Description</TableHead>
                                <TableHead className="text-center uppercase text-[10px] font-black tracking-widest opacity-50">Quantity</TableHead>
                                <TableHead className="text-right uppercase text-[10px] font-black tracking-widest opacity-50">Price</TableHead>
                                <TableHead className="text-right pr-8 uppercase text-[10px] font-black tracking-widest opacity-50">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedOrder.items?.map((item: any, idx: number) => (
                                <TableRow key={idx} className="border-muted/20 hover:bg-muted/5 group">
                                    <TableCell className="pl-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted border flex-shrink-0 group-hover:scale-105 transition-transform">
                                                <img src={item.image} className="w-full h-full object-cover" onError={(e: any) => e.target.src = 'https://placehold.co/100x100?text=Product'} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground">{item.productName}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Size: {item.selectedSize}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-muted-foreground">x{item.quantity}</TableCell>
                                    <TableCell className="text-right font-medium text-muted-foreground">₹{item.price.toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="text-right pr-8 font-black text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Customer Info</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/20 rounded-2xl border border-muted/50 space-y-3">
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Name</span>
                                <span className="font-bold text-foreground">{selectedOrder.customerName || selectedOrder.shippingAddress?.name || 'Walk-in'}</span>
                            </div>
                            <Separator className="opacity-50" />
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Phone</span>
                                <span className="font-bold text-foreground">{selectedOrder.customerPhone || selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                            </div>
                            <Separator className="opacity-50" />
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Email</span>
                                <span className="font-bold text-foreground text-xs">{selectedOrder.customerEmail || selectedOrder.shippingAddress?.email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Shipping Details</h4>
                    </div>
                    <div className="p-4 bg-muted/20 rounded-2xl border border-muted/50 min-h-[140px] flex flex-col justify-center">
                        {getIsOfflineOrder(selectedOrder) ? (
                            <div className="text-center opacity-40">
                                <MapPin size={24} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">In-Store Pickup</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="font-bold text-sm">{selectedOrder.shippingAddress?.addressLine1}</p>
                                <p className="text-muted-foreground text-xs">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>

        <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white space-y-6 sticky top-24">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <BadgeDollarSign size={20} />
                    </div>
                    <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[11px]">Payment Summary</h4>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Method</span>
                        <div className="flex items-center gap-2 font-black text-primary">
                            <CreditCard size={14} />
                            {selectedOrder.paymentMethod}
                        </div>
                    </div>
                    
                    <div className="bg-muted/10 p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">Subtotal</span>
                            <span className="font-bold text-foreground">₹{(selectedOrder.subTotal || selectedOrder.totalAmount).toLocaleString('en-IN')}</span>
                        </div>
                        {selectedOrder.tax > 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Tax</span>
                                <span className="font-bold text-foreground">+₹{selectedOrder.tax.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        {selectedOrder.discount > 0 && (
                            <div className="flex justify-between items-center text-sm text-red-500">
                                <span className="font-medium">Discount</span>
                                <span className="font-bold">-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <Separator className="opacity-50" />
                        <div className="flex justify-between items-end pt-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Grand Total</span>
                                <span className="text-3xl font-black tracking-tighter text-primary">₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black text-[10px] mb-2 uppercase tracking-widest">PAID</Badge>
                        </div>
                    </div>

                    {getIsOfflineOrder(selectedOrder) && (
                        <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-3">
                             <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-muted-foreground">CASH RECEIVED</span>
                                <span className="font-black">₹{selectedOrder.cashReceived?.toLocaleString('en-IN') || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-primary">
                                <span className="font-black uppercase tracking-widest text-[9px]">CHANGE GIVEAWAY</span>
                                <span className="font-black">₹{selectedOrder.balanceReturned?.toLocaleString('en-IN') || '0'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {viewMode === 'list' ? renderOrderList() : renderOrderDetail()}
    </div>
  );
};

export default OrdersPage;
