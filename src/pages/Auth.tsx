import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  useLoginRateLimiter,
  useMFARateLimiter,
  usePasswordResetRateLimiter,
  useSignupRateLimiter,
} from "@/hooks/useRateLimiter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  User,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  isStrongPassword,
  PasswordStrengthIndicator,
} from "@/components/PasswordStrengthIndicator";

// hCaptcha site key from environment
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "";

// Validation schemas
const emailSchema = z.string().trim().email("Invalid email address").max(
  255,
  "Email too long",
);
const passwordSchema = z.string().min(
  8,
  "Password must be at least 8 characters",
).max(72, "Password too long");
const nameSchema = z.string().trim().max(100, "Name too long").optional();

// Strong password schema for signup
const strongPasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long")
  .refine((val) => /[A-Z]/.test(val), "Must contain an uppercase letter")
  .refine((val) => /[a-z]/.test(val), "Must contain a lowercase letter")
  .refine((val) => /\d/.test(val), "Must contain a number")
  .refine(
    (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
    "Must contain a special character",
  );

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const signupSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
  fullName: nameSchema,
});

// Helper function to format lockout time
const formatLockoutTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ${remainingSeconds} second${
        remainingSeconds > 1 ? "s" : ""
      }`
      : `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${
      remainingMinutes > 1 ? "s" : ""
    }`
    : `${hours} hour${hours > 1 ? "s" : ""}`;
};

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, mfaRequired, signIn, signUp, verifyMFA, factors } =
    useAuth();

  // Rate limiters for brute force protection
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

  // MFA state
  const [mfaCode, setMfaCode] = useState("");
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);

  // hCaptcha state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (user && !loading && !mfaRequired) {
      navigate("/");
    }
  }, [user, loading, mfaRequired, navigate]);

  useEffect(() => {
    // Auto-select first TOTP factor if MFA is required
    if (mfaRequired && factors.totp.length > 0 && !selectedFactorId) {
      setSelectedFactorId(factors.totp[0].id);
    }
  }, [mfaRequired, factors, selectedFactorId]);

  // Verify captcha token with backend
  const verifyCaptcha = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-captcha",
        {
          body: { token },
        },
      );
      if (error) {
        console.error("Captcha verification error:", error);
        return false;
      }
      return data?.success === true;
    } catch (err) {
      console.error("Captcha verification failed:", err);
      return false;
    }
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

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    setCaptchaVerified(false);
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaVerified(false);
    captchaRef.current?.resetCaptcha();
  };

  const validateForm = (isLogin: boolean) => {
    try {
      if (isLogin) {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ email, password, fullName });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as string;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    // Check captcha (only if site key is configured)
    if (HCAPTCHA_SITE_KEY && !captchaVerified) {
      toast.error("Please complete the captcha verification");
      return;
    }

    // Check rate limit
    if (!loginRateLimiter.canAttempt) {
      toast.error(
        `Too many login attempts. Try again in ${
          formatLockoutTime(loginRateLimiter.lockoutRemaining)
        }`,
      );
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      loginRateLimiter.recordAttempt();
      resetCaptcha();
      if (error.message.includes("Invalid login credentials")) {
        toast.error(
          `Invalid email or password. ${
            loginRateLimiter.remainingAttempts - 1
          } attempts remaining.`,
        );
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please confirm your email before logging in");
      } else {
        toast.error(error.message);
      }
    } else {
      loginRateLimiter.recordSuccess();
      toast.success("Welcome back!");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    // Check captcha (only if site key is configured)
    if (HCAPTCHA_SITE_KEY && !captchaVerified) {
      toast.error("Please complete the captcha verification");
      return;
    }

    // Check rate limit
    if (!signupRateLimiter.canAttempt) {
      toast.error(
        `Too many signup attempts. Try again in ${
          formatLockoutTime(signupRateLimiter.lockoutRemaining)
        }`,
      );
      return;
    }

    setIsSubmitting(true);
    signupRateLimiter.recordAttempt();
    const { error } = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (error) {
      resetCaptcha();
      if (error.message.includes("already registered")) {
        toast.error("An account with this email already exists");
      } else {
        toast.error(error.message);
      }
    } else {
      signupRateLimiter.recordSuccess();
      toast.success("Account created successfully!");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ email: err.errors[0].message });
      }
      return;
    }

    // Check rate limit
    if (!passwordResetRateLimiter.canAttempt) {
      toast.error(
        `Too many password reset requests. Try again in ${
          formatLockoutTime(passwordResetRateLimiter.lockoutRemaining)
        }`,
      );
      return;
    }

    setIsSubmitting(true);
    passwordResetRateLimiter.recordAttempt();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      setResetEmailSent(true);
      toast.success("Password reset email sent!");
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFactorId || !mfaCode) {
      toast.error("Please enter verification code");
      return;
    }

    // Check rate limit
    if (!mfaRateLimiter.canAttempt) {
      toast.error(
        `Too many verification attempts. Try again in ${
          formatLockoutTime(mfaRateLimiter.lockoutRemaining)
        }`,
      );
      return;
    }

    setIsSubmitting(true);
    const { error } = await verifyMFA(selectedFactorId, mfaCode);
    setIsSubmitting(false);

    if (error) {
      mfaRateLimiter.recordAttempt();
      toast.error(
        `Invalid verification code. ${
          mfaRateLimiter.remainingAttempts - 1
        } attempts remaining.`,
      );
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

  // MFA Verification Screen
  if (mfaRequired) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-20 px-4">
          <Card className="w-full max-w-md border-gold/30">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Enter the 6-digit code from your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMFAVerify} className="space-y-6">
                {!mfaRateLimiter.canAttempt && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Too many attempts. Try again in{" "}
                      {formatLockoutTime(mfaRateLimiter.lockoutRemaining)}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="mfa-code">Verification Code</Label>
                  <Input
                    id="mfa-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={mfaCode}
                    onChange={(e) =>
                      setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    disabled={!mfaRateLimiter.canAttempt}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || mfaCode.length !== 6 ||
                    !mfaRateLimiter.canAttempt}
                >
                  {isSubmitting
                    ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    )
                    : (
                      "Verify"
                    )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Forgot Password Screen
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-20 px-4">
          <Card className="w-full max-w-md border-gold/30">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Reset Password
              </CardTitle>
              <CardDescription>
                {resetEmailSent
                  ? "Check your email for a password reset link"
                  : "Enter your email to receive a password reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resetEmailSent
                ? (
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground text-sm">
                      We've sent a password reset link to{" "}
                      <strong>{email}</strong>. Click the link in the email to
                      reset your password.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmailSent(false);
                        setEmail("");
                      }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </div>
                )
                : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    {!passwordResetRateLimiter.canAttempt && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Too many requests. Try again in {formatLockoutTime(
                            passwordResetRateLimiter.lockoutRemaining,
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          disabled={!passwordResetRateLimiter.canAttempt}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting ||
                        !passwordResetRateLimiter.canAttempt}
                    >
                      {isSubmitting
                        ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        )
                        : (
                          "Send Reset Link"
                        )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setErrors({});
                      }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </form>
                )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-md border-gold/30">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-3xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {!loginRateLimiter.canAttempt && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Too many login attempts. Try again in{" "}
                        {formatLockoutTime(loginRateLimiter.lockoutRemaining)}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={!loginRateLimiter.canAttempt}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={!loginRateLimiter.canAttempt}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={!loginRateLimiter.canAttempt}
                      >
                        {showPassword
                          ? <EyeOff className="h-4 w-4" />
                          : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* hCaptcha for login */}
                  {HCAPTCHA_SITE_KEY && (
                    <div className="flex flex-col items-center space-y-2">
                      <HCaptcha
                        sitekey={HCAPTCHA_SITE_KEY}
                        onVerify={handleCaptchaVerify}
                        onExpire={handleCaptchaExpire}
                        ref={captchaRef}
                      />
                      {captchaVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !loginRateLimiter.canAttempt ||
                      (HCAPTCHA_SITE_KEY && !captchaVerified)}
                  >
                    {isSubmitting
                      ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      )
                      : (
                        "Sign In"
                      )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {!signupRateLimiter.canAttempt && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Too many signup attempts. Try again in{" "}
                        {formatLockoutTime(signupRateLimiter.lockoutRemaining)}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name (optional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        disabled={!signupRateLimiter.canAttempt}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={!signupRateLimiter.canAttempt}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={!signupRateLimiter.canAttempt}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={!signupRateLimiter.canAttempt}
                      >
                        {showPassword
                          ? <EyeOff className="h-4 w-4" />
                          : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={password} />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* hCaptcha for signup */}
                  {HCAPTCHA_SITE_KEY && (
                    <div className="flex flex-col items-center space-y-2">
                      <HCaptcha
                        sitekey={HCAPTCHA_SITE_KEY}
                        onVerify={handleCaptchaVerify}
                        onExpire={handleCaptchaExpire}
                        ref={captchaRef}
                      />
                      {captchaVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !signupRateLimiter.canAttempt ||
                      (HCAPTCHA_SITE_KEY && !captchaVerified)}
                  >
                    {isSubmitting
                      ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      )
                      : (
                        "Create Account"
                      )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
