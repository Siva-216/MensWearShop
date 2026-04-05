import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
            <Routes>
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin Routes */}
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
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
