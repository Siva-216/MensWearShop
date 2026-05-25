import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing password reset token.");
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword({ token, password });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 md:p-10 border border-border shadow-sm bg-card animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />

        {!success ? (
          <>
            <h1 className="font-display text-3xl font-bold mb-2 text-center">Reset Password</h1>
            <p className="text-sm font-body text-muted-foreground mb-8 text-center">
              Please enter and confirm your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                    placeholder="Enter new password"
                    disabled={loading}
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

              <div>
                <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                    placeholder="Repeat new password"
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-hero py-4 text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-muted-foreground transition-colors disabled:opacity-50 mt-2"
                disabled={loading || !token}
              >
                {loading ? "Resetting password..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-fade-in">
            <div className="mx-auto w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Password Reset</h1>
            <p className="text-sm font-body text-muted-foreground mb-8">
              Your password has been successfully updated. You can now use your new password to sign in.
            </p>
            <Link 
              to="/login" 
              className="w-full btn-hero py-4 text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-muted-foreground transition-colors flex items-center justify-center gap-2"
            >
              Go to Log In <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
