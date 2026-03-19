import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlertTriangle,
  ClipboardList,
  Loader2,
  LogOut,
  Mail,
  QrCode,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { OrderHistory } from "@/components/account/OrderHistory";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import AsperLogo from "@/components/brand/AsperLogo";

/* ─── Frosted Glass Section ─── */
const GlassSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card/80 backdrop-blur-md border border-accent/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, description, badge }: { icon: any; title: string; description: string; badge?: React.ReactNode }) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full border border-accent/30 flex items-center justify-center bg-accent/5 flex-shrink-0 mt-0.5">
        <Icon className="h-4.5 w-4.5 text-accent" />
      </div>
      <div>
        <h2 className="font-heading text-xl text-foreground tracking-tight">{title}</h2>
        <p className="text-muted-foreground font-body text-sm mt-0.5">{description}</p>
      </div>
    </div>
    {badge}
  </div>
);

export default function Account() {
  const navigate = useNavigate();
  const { user, loading, factors, signOut, enrollTOTP, verifyTOTPEnrollment, unenrollMFA, refreshFactors } = useAuth();

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [factorToDelete, setFactorToDelete] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) toast.error("Failed to sign out");
    else { toast.success("Signed out successfully"); navigate("/"); }
  };

  const handleEnrollMFA = async () => {
    setIsEnrolling(true);
    const { data, error } = await enrollTOTP("Asper Beauty");
    setIsEnrolling(false);
    if (error) { toast.error("Failed to start MFA enrollment"); return; }
    if (data) setEnrollmentData({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  };

  const handleVerifyEnrollment = async () => {
    if (!enrollmentData || !verifyCode) return;
    setIsVerifying(true);
    const { error } = await verifyTOTPEnrollment(enrollmentData.id, verifyCode);
    setIsVerifying(false);
    if (error) { toast.error("Invalid verification code"); setVerifyCode(""); }
    else { toast.success("MFA enabled successfully!"); setEnrollmentData(null); setVerifyCode(""); }
  };

  const handleCancelEnrollment = () => { setEnrollmentData(null); setVerifyCode(""); };

  const handleUnenrollMFA = async (factorId: string) => {
    const { error } = await unenrollMFA(factorId);
    setFactorToDelete(null);
    if (error) toast.error("Failed to remove authenticator");
    else toast.success("Authenticator removed");
  };

  const handleDeleteAccount = async () => {
    if (!user?.email) return;
    if (deleteEmail.toLowerCase() !== user.email.toLowerCase()) { toast.error("Email does not match your account email"); return; }
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { toast.error("Session expired. Please sign in again."); navigate("/auth"); return; }
      const { data, error } = await supabase.functions.invoke("delete-account", { body: { confirmEmail: deleteEmail } });
      if (error) { toast.error(error.message || "Failed to delete account"); return; }
      if (data?.success) { toast.success("Your account has been permanently deleted"); await signOut(); navigate("/"); }
      else toast.error(data?.error || "Failed to delete account");
    } catch { toast.error("An unexpected error occurred"); }
    finally { setIsDeleting(false); setShowDeleteConfirm(false); setDeleteEmail(""); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const allFactors = [...factors.totp, ...factors.phone];
  const hasMFAEnabled = allFactors.some((f) => f.status === "verified");
  const initials = user.user_metadata?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  const displayName = user.user_metadata?.full_name || "Beauty Enthusiast";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="luxury-container py-10 md:py-16">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ═══ Profile Hero ═══ */}
          <GlassSection>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-2 border-accent/30 flex items-center justify-center bg-accent/5 shadow-[0_0_20px_0_rgba(197,160,40,0.08)]">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-heading text-accent">{initials}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card border border-accent/30 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-accent" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-heading text-2xl text-foreground tracking-tight">{displayName}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">{user.email}</span>
                </div>
                {hasMFAEnabled && (
                  <Badge className="mt-3 bg-accent/10 text-accent border-accent/20 font-body text-[10px] uppercase tracking-[0.12em]">
                    <ShieldCheck className="mr-1 h-3 w-3" />2FA Protected
                  </Badge>
                )}
              </div>

              {/* Sign Out */}
              <Button variant="outline" onClick={handleSignOut} className="border-border/60 font-body text-xs uppercase tracking-[0.12em] hover:border-primary/30 hover:text-primary transition-all">
                <LogOut className="mr-2 h-3.5 w-3.5" />Sign Out
              </Button>
            </div>
          </GlassSection>

          {/* ═══ Two-Factor Authentication ═══ */}
          <GlassSection>
            <SectionHeader
              icon={Shield}
              title="Two-Factor Authentication"
              description="Add an extra layer of clinical-grade security"
              badge={hasMFAEnabled ? (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-body text-[10px] uppercase tracking-[0.1em]">
                  <ShieldCheck className="mr-1 h-3 w-3" />Active
                </Badge>
              ) : undefined}
            />

            {enrollmentData ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground font-body">Scan this QR code with your authenticator app</p>
                  <div className="flex justify-center">
                    <div className="p-3 border border-accent/20 bg-card inline-block">
                      <img src={enrollmentData.qr} alt="QR Code for MFA setup" className="w-44 h-44" />
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-3 border border-border/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-body mb-1">Manual Entry Code</p>
                    <code className="text-xs font-mono break-all text-foreground">{enrollmentData.secret}</code>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-body text-xs uppercase tracking-[0.12em] text-muted-foreground">Verification Code</Label>
                    <Input type="text" inputMode="numeric" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="text-center text-xl tracking-[0.5em] font-body bg-background/50 border-border/60" maxLength={6} />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleVerifyEnrollment} disabled={isVerifying || verifyCode.length !== 6} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-body text-xs uppercase tracking-[0.15em]">
                      {isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : "Verify & Enable"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEnrollment} className="border-border/60 font-body text-xs">Cancel</Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Existing Factors */}
                {allFactors.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {allFactors.map((factor) => (
                      <div key={factor.id} className="flex items-center justify-between p-4 border border-border/40 bg-background/30">
                        <div className="flex items-center gap-3">
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{factor.friendly_name || "Authenticator"}</p>
                            <p className="font-body text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{factor.factor_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={factor.status === "verified" ? "bg-green-500/10 text-green-600 border-green-500/20 text-[10px]" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[10px]"}>
                            {factor.status}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive/60 hover:text-destructive hover:bg-destructive/5 h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-accent/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-heading">Remove Authenticator</AlertDialogTitle>
                                <AlertDialogDescription className="font-body text-sm">Are you sure? You'll need to set up a new one to use 2FA.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-body text-xs">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleUnenrollMFA(factor.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body text-xs">Remove</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={handleEnrollMFA} disabled={isEnrolling} variant={allFactors.length > 0 ? "outline" : "default"} className={`w-full font-body text-xs uppercase tracking-[0.15em] ${allFactors.length > 0 ? "border-border/60" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}>
                  {isEnrolling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Setting up…</> : <><QrCode className="mr-2 h-4 w-4" />{allFactors.length > 0 ? "Add Another Authenticator" : "Set Up Authenticator App"}</>}
                </Button>

                {allFactors.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-3 font-body">Use Google Authenticator or Authy for enhanced security</p>
                )}
              </>
            )}
          </GlassSection>

          {/* ═══ Danger Zone — Account Deletion ═══ */}
          <GlassSection className="border-destructive/15">
            <SectionHeader icon={AlertTriangle} title="Delete Account" description="Permanently delete your account and all associated data" />

            {!showDeleteConfirm ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  This action is irreversible. All your data — including profile, preferences, consultation history, and authentication credentials — will be permanently deleted in accordance with GDPR regulations.
                </p>
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5 font-body text-xs uppercase tracking-[0.12em]" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="mr-2 h-3.5 w-3.5" />Delete My Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4 p-5 bg-destructive/5 border border-destructive/15">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body font-semibold text-sm text-destructive">This action cannot be undone</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">
                      To confirm, enter your email: <strong className="text-foreground">{user.email}</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-body text-xs uppercase tracking-[0.12em] text-muted-foreground">Confirm Email Address</Label>
                  <Input type="email" value={deleteEmail} onChange={(e) => setDeleteEmail(e.target.value)} placeholder="Enter your email to confirm" className="bg-background/50 border-destructive/20 focus:border-destructive/40 font-body text-sm" />
                </div>

                <div className="flex gap-3">
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting || deleteEmail.toLowerCase() !== user.email?.toLowerCase()} className="font-body text-xs uppercase tracking-[0.12em]">
                    {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting…</> : <><Trash2 className="mr-2 h-3.5 w-3.5" />Permanently Delete</>}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeleteEmail(""); }} className="font-body text-xs border-border/60">Cancel</Button>
                </div>
              </div>
            )}
          </GlassSection>

          {/* ─── Trust Footer ─── */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <ShieldCheck className="h-3.5 w-3.5 text-accent/50" />
            <span className="font-body text-[10px] text-muted-foreground/50 uppercase tracking-[0.15em]">
              Your data is protected with clinical-grade encryption
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
