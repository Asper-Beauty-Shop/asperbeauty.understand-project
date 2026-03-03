import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import asperLogo from "@/assets/asper-lotus-logo.png";

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setDisplayName(data.display_name ?? "");
        setPhone(data.phone ?? "");
      } else {
        // Pre-fill from Google metadata
        setDisplayName(user.user_metadata?.full_name ?? "");
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const initials = (displayName || user.user_metadata?.full_name || user.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: user.id, display_name: displayName, phone, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Back nav */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ms-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-3">
          <img src={asperLogo} alt="Asper" className="h-10 w-auto mx-auto" />
          <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
          <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </div>

        {/* Avatar section */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20 border-2 border-accent/30">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-heading">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground font-body">{user.email}</p>
        </div>

        {/* Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {loadingProfile ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="font-body">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-body">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 ..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-body text-muted-foreground">Email</Label>
                  <Input value={user.email ?? ""} disabled className="opacity-60" />
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sign out */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
