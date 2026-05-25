import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to request password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 md:p-10 border border-border shadow-sm bg-card animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
        
        {!submitted ? (
          <>
            <h1 className="font-display text-3xl font-bold mb-2 text-center">Forgot Password</h1>
            <p className="text-sm font-body text-muted-foreground mb-8 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-body font-bold tracking-widest uppercase mb-2 text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors font-body text-sm"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-hero py-4 text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-muted-foreground transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-fade-in">
            <div className="mx-auto w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Check Your Email</h1>
            <p className="text-sm font-body text-muted-foreground mb-8">
              We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folders.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-xs font-body font-bold text-foreground hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-body font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
