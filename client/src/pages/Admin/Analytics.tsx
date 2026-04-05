import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Search,
  Zap,
  Download,
  Calendar
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

const data = [
  { name: 'Week 1', revenue: 15000, users: 1200 },
  { name: 'Week 2', revenue: 22000, users: 1900 },
  { name: 'Week 3', revenue: 18000, users: 1500 },
  { name: 'Week 4', revenue: 35000, users: 2800 },
  { name: 'Week 5', revenue: 42000, users: 3400 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Business Analytics</h2>
          <p className="text-muted-foreground mt-1">Deep dive into your store's performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 gap-2">
            <Calendar size={18} />
            Jan 1 - Mar 20
          </Button>
          <Button className="h-10 gap-2 shadow-lg shadow-primary/10">
            <Download size={18} />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <p className="text-sm font-medium opacity-80 mb-2 uppercase tracking-widest">Gross Revenue</p>
          <h3 className="text-4xl font-black mb-4">$84,231.00</h3>
          <div className="flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <ArrowUpRight size={16} /> +12.4%
          </div>
        </Card>
        <Card className="border-none shadow-sm p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <p className="text-sm font-medium opacity-80 mb-2 uppercase tracking-widest">Active Sessions</p>
          <h3 className="text-4xl font-black mb-4">12,840</h3>
          <div className="flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <ArrowUpRight size={16} /> +18.7%
          </div>
        </Card>
        <Card className="border-none shadow-sm p-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <p className="text-sm font-medium opacity-80 mb-2 uppercase tracking-widest">Conversion Rate</p>
          <h3 className="text-4xl font-black mb-4">3.42%</h3>
          <div className="flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <ArrowUpRight size={16} /> +0.8%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm p-2 overflow-hidden">
          <CardHeader>
             <CardTitle className="text-xl font-bold">Revenue Growth</CardTitle>
             <CardDescription>Performance vs Previous Period</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm p-2 overflow-hidden">
          <CardHeader>
             <CardTitle className="text-xl font-bold">User Acquisition</CardTitle>
             <CardDescription>New Signups by Channel</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'}}
                  />
                  <Bar dataKey="users" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Globe, label: 'Direct', value: '45%', color: 'blue' },
          { icon: Search, label: 'Organic', value: '32%', color: 'green' },
          { icon: Zap, label: 'Social', value: '18%', color: 'amber' },
          { icon: Smartphone, label: 'Referral', value: '5%', color: 'purple' },
        ].map((source, i) => (
          <Card key={i} className="border-none shadow-sm hover:translate-y-[-4px] transition-transform">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <div className={`p-4 bg-${source.color}-100 text-${source.color}-600 rounded-2xl mb-4`}><source.icon size={28} /></div>
               <h4 className="font-bold text-lg mb-1">{source.label}</h4>
               <p className="text-3xl font-black text-foreground">{source.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
