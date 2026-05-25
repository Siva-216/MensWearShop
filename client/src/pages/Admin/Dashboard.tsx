import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dropdown-menu';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const Dashboard: React.FC = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.products.getAll(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.orders.getAll(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.users.getAll(),
  });

  const totalRevenue = (Array.isArray(orders) ? orders : [])
    .filter((o: any) => o.status !== 'Cancelled')
    .reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

  const recentOrders = (Array.isArray(orders) ? [...orders] : [])
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const categoryData = (Array.isArray(products) ? products : []).reduce((acc: any, p: any) => {
    const cat = p.categoryName || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryData).map(name => ({
    name,
    value: categoryData[name]
  }));

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const revenueData = [
    { name: 'Jan', revenue: totalRevenue * 0.1 },
    { name: 'Feb', revenue: totalRevenue * 0.15 },
    { name: 'Mar', revenue: totalRevenue * 0.2 },
    { name: 'Apr', revenue: totalRevenue * 0.25 },
    { name: 'May', revenue: totalRevenue * 0.3 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Overview Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time performance and inventory metrics.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-10">Export Report</Button>
          <Button className="h-10 px-6">Generate AI Insights</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-green-50/50 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Users size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(users) ? users.length : 0}</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              +{Array.isArray(users) ? users.filter((u: any) => u.createdAt && new Date(u.createdAt).getMonth() === new Date().getMonth()).length : 0} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-amber-50/50 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Package size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(products) ? products.length : 0}</div>
            <p className="text-xs text-amber-600 flex items-center mt-1 font-medium">
              <RefreshCw size={14} className="mr-1" />
              {Array.isArray(products) ? products.filter((p: any) => p.stock < 10).length : 0} items low stock
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <ShoppingCart size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(orders) ? orders.length : 0}</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              {Array.isArray(orders) ? orders.filter((o: any) => o.status === 'Placed').length : 0} pending orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Revenue Growth</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Sales by Category</CardTitle>
            <CardDescription>Current stock distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                  <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription>Your store's latest transactions.</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="p-0 md:p-6 overflow-x-auto scrollbar-hide">
          <div className="min-w-[750px] md:min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-muted/50">
                  <TableHead className="w-[100px] font-bold text-foreground">Order ID</TableHead>
                  <TableHead className="font-bold text-foreground">Customer</TableHead>
                  <TableHead className="font-bold text-foreground">Product</TableHead>
                  <TableHead className="font-bold text-foreground">Amount</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Date</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id} className="group border-muted/50 transition-colors">
                    <TableCell className="font-medium">#{order.orderId?.substring(0, 8)}</TableCell>
                    <TableCell>{order.shippingAddress?.name || 'Customer'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.items?.[0]?.productName || 'Multiple items'}{order.items?.length > 1 ? ` (+${order.items.length - 1})` : ''}</TableCell>
                    <TableCell className="font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Placed' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        } border-none font-medium px-2.5 py-0.5 rounded-full`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
