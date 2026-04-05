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
  MoreVertical
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

const data = [
  { name: 'Jan', revenue: 4000, orders: 2400 },
  { name: 'Feb', revenue: 3000, orders: 1398 },
  { name: 'Mar', revenue: 2000, orders: 9800 },
  { name: 'Apr', revenue: 2780, orders: 3908 },
  { name: 'May', revenue: 1890, orders: 4800 },
  { name: 'Jun', revenue: 2390, orders: 3800 },
  { name: 'Jul', revenue: 3490, orders: 4300 },
];

const pieData = [
  { name: 'Men', value: 400 },
  { name: 'Women', value: 300 },
  { name: 'Accessories', value: 300 },
  { name: 'Footwear', value: 200 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', product: 'Premium Slim Fit Suit', amount: '$299.00', status: 'Delivered', date: '2024-03-20' },
  { id: 'ORD-002', customer: 'Jane Smith', product: 'Cotton Oxford Shirt', amount: '$59.00', status: 'Shipped', date: '2024-03-19' },
  { id: 'ORD-003', customer: 'Mike Johnson', product: 'Leather Brogues', amount: '$120.00', status: 'Processing', date: '2024-03-18' },
  { id: 'ORD-004', customer: 'Emily Brown', product: 'Denim Jacket', amount: '$85.00', status: 'Delivered', date: '2024-03-17' },
  { id: 'ORD-005', customer: 'Chris Wilson', product: 'Silk Tie', amount: '$35.00', status: 'Cancelled', date: '2024-03-16' },
];

const Dashboard: React.FC = () => {
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
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              +20.1% from last month
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
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              +180.1% from last month
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
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-red-600 flex items-center mt-1 font-medium">
              <ArrowDownRight size={14} className="mr-1" />
              -2.1% from last month
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
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              +12.2% from yesterday
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
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                <Area type="monotone" dataKey="orders" stroke="#fbbf24" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
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
        <CardContent>
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
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="group border-muted/50 transition-colors">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{order.product}</TableCell>
                  <TableCell className="font-semibold">{order.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={`${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      } border-none font-medium px-2.5 py-0.5 rounded-full`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
