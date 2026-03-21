import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import {
  useLoginRateLimiter,
  useMFARateLimiter,
  usePasswordResetRateLimiter,
  useSignupRateLimiter,
} from "@/hooks/useRateLimiter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  isStrongPassword,
  PasswordStrengthIndicator,
} from "@/components/PasswordStrengthIndicator";
import AsperLogo from "@/components/brand/AsperLogo";

// hCaptcha site key from environment
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "";

// Validation schemas
const emailSchema = z.string().trim().email("Invalid email address").max(255, "Email too long");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72, "Password too long");
const nameSchema = z.string().trim().max(100, "Name too long").optional();

const strongPasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long")
  .refine((val) => /[A-Z]/.test(val), "Must contain an uppercase letter")
  .refine((val) => /[a-z]/.test(val), "Must contain a lowercase letter")
  .refine((val) => /\d/.test(val), "Must contain a number")
  .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "Must contain a special character");

const loginSchema = z.object({ email: emailSchema, password: passwordSchema });
const signupSchema = z.object({ email: emailSchema, password: strongPasswordSchema, fullName: nameSchema });

const formatLockoutTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
};

/* ─── Social OAuth Icons ─── */
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const SocialLoginButtons = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading("google");
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/account`,
      });
      if (error) {
        toast.error("Google sign-in failed. Please try again.");
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  };

  const handleApple = async () => {
    setLoading("apple");
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: `${window.location.origin}/account`,
      });
      if (error) {
        toast.error("Apple sign-in failed. Please try again.");
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogle}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-sm bg-card hover:bg-secondary/50 transition-all duration-300 font-body text-sm tracking-wide text-foreground disabled:opacity-50"
      >
        {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>
      <button
        onClick={handleApple}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-sm bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 font-body text-sm tracking-wide disabled:opacity-50"
      >
        {loading === "apple" ? <Loader2 className="h-4 w-4 animate-spin" /> : <AppleIcon />}
        Continue with Apple
      </button>
    </div>
  );
};

/* ─── Divider ─── */
const OrDivider = () => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-accent/20" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-card px-4 text-muted-foreground tracking-[0.15em] font-body">or</span>
    </div>
  </div>
);

/* ─── Frosted Glass Card Wrapper ─── */
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full max-w-md bg-card/80 backdrop-blur-md border border-accent/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] p-8 ${className}`}>
    {children}
  </div>
);

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, mfaRequired, signIn, signUp, verifyMFA, factors } = useAuth();

  const loginRateLimiter = useLoginRateLimiter();
  const signupRateLimiter = useSignupRateLimiter();
  const passwordResetRateLimiter = usePasswordResetRateLimiter();
  const mfaRateLimiter = useMFARateLimiter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [mfaCode, setMfaCode] = useState("");
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (user && !loading && !mfaRequired) navigate("/");
  }, [user, loading, mfaRequired, navigate]);

  useEffect(() => {
    if (mfaRequired && factors.totp.length > 0 && !selectedFactorId) {
      setSelectedFactorId(factors.totp[0].id);
    }
  }, [mfaRequired, factors, selectedFactorId]);

  const verifyCaptcha = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-captcha", { body: { token } });
      if (error) return false;
      return data?.success === true;
    } catch { return false; }
  };

  const handleCaptchaVerify = async (token: string) => {
    setCaptchaToken(token);
    const isValid = await verifyCaptcha(token);
    setCaptchaVerified(isValid);
    if (!isValid) {
      toast.error("Captcha verification failed. Please try again.");
      captchaRef.current?.resetCaptcha();
    }
  };

  const handleCaptchaExpire = () => { setCaptchaToken(null); setCaptchaVerified(false); };
  const resetCaptcha = () => { setCaptchaToken(null); setCaptchaVerified(false); captchaRef.current?.resetCaptcha(); };

  const validateForm = (isLogin: boolean) => {
    try {
      if (isLogin) loginSchema.parse({ email, password });
      else signupSchema.parse({ email, password, fullName });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => { fieldErrors[error.path[0] as string] = error.message; });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    if (HCAPTCHA_SITE_KEY && !captchaVerified) { toast.error("Please complete the captcha verification"); return; }
    if (!loginRateLimiter.canAttempt) { toast.error(`Too many login attempts. Try again in ${formatLockoutTime(loginRateLimiter.lockoutRemaining)}`); return; }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      loginRateLimiter.recordAttempt();
      resetCaptcha();
      if (error.message.includes("Invalid login credentials")) {
        toast.error(`Invalid email or password. ${loginRateLimiter.remainingAttempts - 1} attempts remaining.`);
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please confirm your email before logging in");
      } else { toast.error(error.message); }
    } else {
      loginRateLimiter.recordSuccess();
      toast.success("Welcome back!");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;
    if (HCAPTCHA_SITE_KEY && !captchaVerified) { toast.error("Please complete the captcha verification"); return; }
    if (!signupRateLimiter.canAttempt) { toast.error(`Too many signup attempts. Try again in ${formatLockoutTime(signupRateLimiter.lockoutRemaining)}`); return; }

    setIsSubmitting(true);
    signupRateLimiter.recordAttempt();
    const { error } = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (error) {
      resetCaptcha();
      if (error.message.includes("already registered")) toast.error("An account with this email already exists");
      else toast.error(error.message);
    } else {
      signupRateLimiter.recordSuccess();
      toast.success("Account created! Check your email to verify.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try { emailSchema.parse(email); setErrors({}); }
    catch (err) { if (err instanceof z.ZodError) setErrors({ email: err.errors[0].message }); return; }
    if (!passwordResetRateLimiter.canAttempt) { toast.error(`Too many requests. Try again in ${formatLockoutTime(passwordResetRateLimiter.lockoutRemaining)}`); return; }

    setIsSubmitting(true);
    passwordResetRateLimiter.recordAttempt();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth?reset=true` });
    setIsSubmitting(false);

    if (error) toast.error(error.message);
    else { setResetEmailSent(true); toast.success("Password reset email sent!"); }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFactorId || !mfaCode) { toast.error("Please enter verification code"); return; }
    if (!mfaRateLimiter.canAttempt) { toast.error(`Too many attempts. Try again in ${formatLockoutTime(mfaRateLimiter.lockoutRemaining)}`); return; }

    setIsSubmitting(true);
    const { error } = await verifyMFA(selectedFactorId, mfaCode);
    setIsSubmitting(false);

    if (error) {
      mfaRateLimiter.recordAttempt();
      toast.error(`Invalid verification code. ${mfaRateLimiter.remainingAttempts - 1} attempts remaining.`);
      setMfaCode("");
    } else {
      mfaRateLimiter.recordSuccess();
      toast.success("Verification successful!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ─── Shared Input Styles ─── */
  const inputClass = "pl-10 bg-background/50 border-border/60 focus:border-accent/50 focus:ring-accent/20 font-body text-sm";
  const labelClass = "font-body text-xs uppercase tracking-[0.12em] text-muted-foreground";

  /* ═══ MFA Screen ═══ */
  if (mfaRequired) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-20 px-4">
          <GlassCard>
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-accent/30 flex items-center justify-center bg-accent/5">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <h1 className="font-heading text-2xl text-foreground tracking-tight">Two-Factor Authentication</h1>
              <p className="text-muted-foreground font-body text-sm mt-2">Enter the 6-digit code from your authenticator app</p>
            </div>
            <form onSubmit={handleMFAVerify} className="space-y-6">
              {!mfaRateLimiter.canAttempt && (
                <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>Too many attempts. Try again in {formatLockoutTime(mfaRateLimiter.lockoutRemaining)}</AlertDescription></Alert>
              )}
              <div className="space-y-2">
                <Label className={labelClass}>Verification Code</Label>
                <Input
                  type="text" inputMode="numeric" autoComplete="one-time-code"
                  value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000" className="text-center text-2xl tracking-[0.5em] font-body bg-background/50 border-border/60"
                  maxLength={6} disabled={!mfaRateLimiter.canAttempt}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body text-xs uppercase tracking-[0.2em] py-6" disabled={isSubmitting || mfaCode.length !== 6 || !mfaRateLimiter.canAttempt}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : "Verify"}
              </Button>
            </form>
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  /* ═══ Forgot Password Screen ═══ */
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-20 px-4">
          <GlassCard>
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-accent/30 flex items-center justify-center bg-accent/5">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <h1 className="font-heading text-2xl text-foreground tracking-tight">Reset Password</h1>
              <p className="text-muted-foreground font-body text-sm mt-2">
                {resetEmailSent ? "Check your email for a password reset link" : "Enter your email to receive a reset link"}
              </p>
            </div>

            {resetEmailSent ? (
              <div className="space-y-4">
                <div className="p-4 border border-accent/20 bg-accent/5 text-center">
                  <p className="text-sm text-muted-foreground font-body">We've sent a password reset link to <strong className="text-foreground">{email}</strong></p>
                </div>
                <Button variant="outline" className="w-full border-border/60 font-body text-xs uppercase tracking-[0.15em]" onClick={() => { setShowForgotPassword(false); setResetEmailSent(false); setEmail(""); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {!passwordResetRateLimiter.canAttempt && (
                  <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>Too many requests. Try again in {formatLockoutTime(passwordResetRateLimiter.lockoutRemaining)}</AlertDescription></Alert>
                )}
                <div className="space-y-2">
                  <Label className={labelClass}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={!passwordResetRateLimiter.canAttempt} />
                  </div>
                  {errors.email && <p className="text-xs text-destructive font-body">{errors.email}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body text-xs uppercase tracking-[0.2em] py-6" disabled={isSubmitting || !passwordResetRateLimiter.canAttempt}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Send Reset Link"}
                </Button>
                <button type="button" onClick={() => { setShowForgotPassword(false); setErrors({}); }} className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                  <ArrowLeft className="h-3.5 w-3.5" />Back to Sign In
                </button>
              </form>
            )}
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  /* ═══ Main Auth Screen ═══ */
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center py-16 md:py-20 px-4">
        <GlassCard>
          {/* ─── Branded Header ─── */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <AsperLogo size={96} animated />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-tight">
              Welcome to Asper
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-2 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Curated by Pharmacists. Powered by Intelligence.
            </p>
          </div>

          {/* ─── Social Login ─── */}
          <SocialLoginButtons />
          <OrDivider />

          {/* ─── Tabs ─── */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 border border-border/40">
              <TabsTrigger value="login" className="font-body text-xs uppercase tracking-[0.12em] data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-body text-xs uppercase tracking-[0.12em] data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
            </TabsList>

            {/* ─── Login Tab ─── */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {!loginRateLimiter.canAttempt && (
                  <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>Too many login attempts. Try again in {formatLockoutTime(loginRateLimiter.lockoutRemaining)}</AlertDescription></Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className={labelClass}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={!loginRateLimiter.canAttempt} />
                  </div>
                  {errors.email && <p className="text-xs text-destructive font-body">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className={labelClass}>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} disabled={!loginRateLimiter.canAttempt} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" disabled={!loginRateLimiter.canAttempt}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive font-body">{errors.password}</p>}
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-accent hover:text-accent/80 font-body tracking-wide transition-colors">
                    Forgot password?
                  </button>
                </div>

                {HCAPTCHA_SITE_KEY && (
                  <div className="flex flex-col items-center space-y-2">
                    <HCaptcha sitekey={HCAPTCHA_SITE_KEY} onVerify={handleCaptchaVerify} onExpire={handleCaptchaExpire} ref={captchaRef} />
                    {captchaVerified && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-body">
                        <ShieldCheck className="h-3.5 w-3.5" /><span>Verified</span>
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body text-xs uppercase tracking-[0.2em] py-6 transition-all duration-300" disabled={isSubmitting || !loginRateLimiter.canAttempt || (!!HCAPTCHA_SITE_KEY && !captchaVerified)}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* ─── Signup Tab ─── */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                {!signupRateLimiter.canAttempt && (
                  <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>Too many signup attempts. Try again in {formatLockoutTime(signupRateLimiter.lockoutRemaining)}</AlertDescription></Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className={labelClass}>Full Name <span className="normal-case tracking-normal text-muted-foreground/60">(optional)</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-name" type="text" placeholder="Your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} disabled={!signupRateLimiter.canAttempt} />
                  </div>
                  {errors.fullName && <p className="text-xs text-destructive font-body">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className={labelClass}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={!signupRateLimiter.canAttempt} />
                  </div>
                  {errors.email && <p className="text-xs text-destructive font-body">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className={labelClass}>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} disabled={!signupRateLimiter.canAttempt} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" disabled={!signupRateLimiter.canAttempt}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator password={password} />
                  {errors.password && <p className="text-xs text-destructive font-body">{errors.password}</p>}
                </div>

                {HCAPTCHA_SITE_KEY && (
                  <div className="flex flex-col items-center space-y-2">
                    <HCaptcha sitekey={HCAPTCHA_SITE_KEY} onVerify={handleCaptchaVerify} onExpire={handleCaptchaExpire} ref={captchaRef} />
                    {captchaVerified && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-body">
                        <ShieldCheck className="h-3.5 w-3.5" /><span>Verified</span>
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body text-xs uppercase tracking-[0.2em] py-6 transition-all duration-300" disabled={isSubmitting || !signupRateLimiter.canAttempt || (!!HCAPTCHA_SITE_KEY && !captchaVerified)}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* ─── Trust Footer ─── */}
          <div className="mt-8 pt-6 border-t border-accent/10 flex items-center justify-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-accent/60" />
            <span className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em]">
              Secure Clinical Authentication
            </span>
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  );
}
