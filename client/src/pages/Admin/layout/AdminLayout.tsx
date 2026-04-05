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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users Management', path: '/admin/users' },
  { icon: Package, label: 'Products Management', path: '/admin/products' },
  { icon: Layers, label: 'Categories', path: '/admin/categories' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Star, label: 'Reviews', path: '/admin/reviews' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-muted/30 font-body">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-card border-r flex flex-col fixed h-full z-50`}
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
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96 max-w-[50%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search anything..." 
              className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative group">
              <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold leading-none">Admin</p>
                    <p className="text-xs text-muted-foreground">admin@fashionworld.com</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
