import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlertTriangle,
  Loader2,
  LogOut,
  QrCode,
  Shield,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Account() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    factors,
    signOut,
    enrollTOTP,
    verifyTOTPEnrollment,
    unenrollMFA,
    refreshFactors,
  } = useAuth();

  // MFA enrollment state
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<
    { id: string; qr: string; secret: string } | null
  >(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [factorToDelete, setFactorToDelete] = useState<string | null>(null);

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleEnrollMFA = async () => {
    setIsEnrolling(true);
    const { data, error } = await enrollTOTP("Asper Beauty");
    setIsEnrolling(false);

    if (error) {
      toast.error("Failed to start MFA enrollment");
      return;
    }

    if (data) {
      setEnrollmentData({
        id: data.id,
        qr: data.totp.qr_code,
        secret: data.totp.secret,
      });
    }
  };

  const handleVerifyEnrollment = async () => {
    if (!enrollmentData || !verifyCode) return;

    setIsVerifying(true);
    const { error } = await verifyTOTPEnrollment(enrollmentData.id, verifyCode);
    setIsVerifying(false);

    if (error) {
      toast.error("Invalid verification code");
      setVerifyCode("");
    } else {
      toast.success("MFA enabled successfully!");
      setEnrollmentData(null);
      setVerifyCode("");
    }
  };

  const handleCancelEnrollment = () => {
    setEnrollmentData(null);
    setVerifyCode("");
  };

  const handleUnenrollMFA = async (factorId: string) => {
    const { error } = await unenrollMFA(factorId);
    setFactorToDelete(null);

    if (error) {
      toast.error("Failed to remove authenticator");
    } else {
      toast.success("Authenticator removed");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.email) return;

    if (deleteEmail.toLowerCase() !== user.email.toLowerCase()) {
      toast.error("Email does not match your account email");
      return;
    }

    setIsDeleting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error("Session expired. Please sign in again.");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "delete-account",
        {
          body: { confirmEmail: deleteEmail },
        },
      );

      if (error) {
        console.error("Delete account error:", error);
        toast.error(error.message || "Failed to delete account");
        return;
      }

      if (data?.success) {
        toast.success("Your account has been permanently deleted");
        // Sign out and redirect
        await signOut();
        navigate("/");
      } else {
        toast.error(data?.error || "Failed to delete account");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteEmail("");
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="luxury-container py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Section */}
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <Separator />
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* MFA Section */}
          <Card className="border-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-2xl flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </div>
                {hasMFAEnabled && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 border-green-500/30"
                  >
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Enabled
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enrollment Flow */}
              {enrollmentData
                ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Scan this QR code with your authenticator app (Google
                        Authenticator, Authy, etc.)
                      </p>
                      <div className="flex justify-center">
                        <img
                          src={enrollmentData.qr}
                          alt="QR Code for MFA setup"
                          className="w-48 h-48 border rounded-lg"
                        />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Or enter this code manually:
                        </p>
                        <code className="text-sm font-mono break-all">
                          {enrollmentData.secret}
                        </code>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="verify-code">
                          Enter Verification Code
                        </Label>
                        <Input
                          id="verify-code"
                          type="text"
                          inputMode="numeric"
                          value={verifyCode}
                          onChange={(e) =>
                            setVerifyCode(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )}
                          placeholder="000000"
                          className="text-center text-xl tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleVerifyEnrollment}
                          disabled={isVerifying || verifyCode.length !== 6}
                          className="flex-1"
                        >
                          {isVerifying
                            ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            )
                            : (
                              "Verify & Enable"
                            )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEnrollment}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )
                : (
                  <>
                    {/* Existing Factors List */}
                    {allFactors.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">
                          Your Authenticators
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allFactors.map((factor) => (
                              <TableRow key={factor.id}>
                                <TableCell className="font-medium">
                                  {factor.friendly_name || "Authenticator"}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className="uppercase text-xs"
                                  >
                                    {factor.factor_type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={factor.status === "verified"
                                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                                      : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"}
                                  >
                                    {factor.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Remove Authenticator
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to remove this
                                          authenticator? You'll need to set up a
                                          new one to use two-factor
                                          authentication.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleUnenrollMFA(factor.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Remove
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {/* Add New Authenticator Button */}
                    <Button
                      onClick={handleEnrollMFA}
                      disabled={isEnrolling}
                      variant={allFactors.length > 0 ? "outline" : "default"}
                      className="w-full"
                    >
                      {isEnrolling
                        ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Setting up...
                          </>
                        )
                        : (
                          <>
                            <QrCode className="mr-2 h-4 w-4" />
                            {allFactors.length > 0
                              ? "Add Another Authenticator"
                              : "Set Up Authenticator App"}
                          </>
                        )}
                    </Button>

                    {allFactors.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Use an authenticator app like Google Authenticator or
                        Authy for enhanced security
                      </p>
                    )}
                  </>
                )}
            </CardContent>
          </Card>

          {/* Account Deletion Section */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="font-display text-2xl flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDeleteConfirm
                ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      This action is irreversible. All your data including
                      profile information, preferences, and authentication
                      credentials will be permanently deleted in accordance with
                      GDPR regulations.
                    </p>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete My Account
                    </Button>
                  </>
                )
                : (
                  <div className="space-y-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-destructive">
                          This action cannot be undone
                        </p>
                        <p className="text-sm text-muted-foreground">
                          To confirm deletion, please enter your email address:
                          {" "}
                          <strong>{user.email}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-email">
                        Confirm Email Address
                      </Label>
                      <Input
                        id="confirm-email"
                        type="email"
                        value={deleteEmail}
                        onChange={(e) => setDeleteEmail(e.target.value)}
                        placeholder="Enter your email to confirm"
                        className="border-destructive/30"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting ||
                          deleteEmail.toLowerCase() !==
                            user.email?.toLowerCase()}
                      >
                        {isDeleting
                          ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          )
                          : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Permanently Delete Account
                            </>
                          )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteEmail("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
