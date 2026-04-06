import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength += 25;
    if (pass.length > 7) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!terms) {
      toast.error("You must accept the terms and conditions.");
      return;
    }

    const success = await signup({
      name: fullName,
      email,
      password
    });

    if (success) {
      toast.success("Account created successfully!");
      navigate(from, { replace: true });
    } else {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 md:p-10 border border-border bg-card animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
        <h1 className="font-display text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-sm font-body text-muted-foreground mb-8 text-center">Join our exclusive fashion community</p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
              placeholder="John Doe"
            />
          </div>

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
                placeholder="Create a strong password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Password Strength */}
            {password && (
              <div className="mt-2 h-1 w-full bg-muted overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-300 ${strength > 50 ? (strength > 75 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-red-500'}`} 
                  style={{ width: `${strength}%` }} 
                />
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
              placeholder="Repeat password"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 rounded-none border-border accent-foreground cursor-pointer" 
            />
            <span className="text-xs font-body text-muted-foreground">
              I agree to the <a href="#" className="font-bold text-foreground hover:underline">Terms of Service</a> & <a href="#" className="font-bold text-foreground hover:underline">Privacy Policy</a>
            </span>
          </div>

          <button type="submit" className="w-full btn-hero py-4 text-xs mt-4">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-8 text-xs font-body text-muted-foreground">
          Already have an account? <Link to="/login" className="text-foreground font-bold hover:underline underline-offset-4 pl-1">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
