import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Layers, 
  ShoppingCart, 
  Star, 
  BarChart2, 
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Monitor, label: 'POS (In-Store)', path: '/admin/pos' },
  { icon: Users, label: 'Users Management', path: '/admin/users' },
  { icon: Package, label: 'Products Management', path: '/admin/products' },
  { icon: Layers, label: 'Categories', path: '/admin/categories' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Star, label: 'Reviews', path: '/admin/reviews' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-muted/30 font-body overflow-hidden">
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r flex flex-col transition-all duration-300 h-full ${
          isSidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-64 -translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className={`font-display font-bold text-xl tracking-tight transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
            FashionWorld Admin
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted-foreground"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon size={20} className={`${location.pathname === item.path ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className={`font-medium transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0 overflow-hidden`}>
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-muted-foreground shrink-0 h-10 w-10"
            >
              <Menu size={20} />
            </Button>
            <div className="relative w-40 sm:w-64 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search anything..." 
                className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-full w-full text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="relative group">
              <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`} />
                    <AvatarFallback>{user?.fullName?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold leading-none">{user?.fullName || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 overflow-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
