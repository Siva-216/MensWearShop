import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Index from "./pages/Index";
import TheCollections from "./pages/TheCollections";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import TrackOrder from "./pages/TrackOrder";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";

import AdminLayout from "./pages/Admin/layout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminProducts from "./pages/Admin/Products";
import AdminCategories from "./pages/Admin/Categories";
import AdminOrders from "./pages/Admin/Orders";
import AdminReviews from "./pages/Admin/Reviews";
import AdminAnalytics from "./pages/Admin/Analytics";
import AdminSettings from "./pages/Admin/Settings";
import AdminPOS from "./pages/Admin/POS";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider, useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

// Seperate component to use hooks
const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
          <p className="text-sm font-medium animate-pulse text-muted-foreground">Initializing FashionWorld...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth routes are always accessible */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {isAdmin ? (
          <>
            {/* If admin, redirect root to admin dashboard */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            {/* Catch-all for regular routes -> redirect to admin */}
            <Route path="/collections" element={<Navigate to="/admin" replace />} />
            <Route path="/collection" element={<Navigate to="/admin" replace />} />
            <Route path="/cart" element={<Navigate to="/admin" replace />} />
            <Route path="/wishlist" element={<Navigate to="/admin" replace />} />
            <Route path="/checkout" element={<Navigate to="/admin" replace />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <>
            {/* Regular User Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<TheCollections />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
          </>
        )}

        {/* Admin Routes (Keep protected in case guest tries to access) */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="pos" element={<AdminPOS />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
