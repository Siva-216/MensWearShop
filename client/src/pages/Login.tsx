import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profile";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      toast.success("Successfully logged in!");
      navigate(from, { replace: true });
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 md:p-10 border border-border shadow-sm bg-card animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
        <h1 className="font-display text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-sm font-body text-muted-foreground mb-8 text-center">Sign in to access your account</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded-none border-border accent-foreground" />
              <span className="text-xs font-body text-muted-foreground">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-body font-bold text-foreground hover:underline underline-offset-4">Forgot Password?</Link>
          </div>

          <button type="submit" className="w-full btn-hero py-4 text-xs">
            Log In
          </button>
        </form>

        <p className="text-center mt-8 text-xs font-body text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-foreground font-bold hover:underline underline-offset-4 pl-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
