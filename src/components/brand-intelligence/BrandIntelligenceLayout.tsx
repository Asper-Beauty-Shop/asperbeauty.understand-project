import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { IntelligenceTab } from "./IntelligenceTab";
import { IdentityTab } from "./IdentityTab";
import { CreativeStudioTab } from "./CreativeStudioTab";
import { DiagnosticsTab } from "./DiagnosticsTab";

export function BrandIntelligenceLayout() {
  const [activeTab, setActiveTab] = useState("intelligence");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-soft-ivory">
      <header className="sticky top-0 z-10 border-b border-shiny-gold/30 bg-soft-ivory/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-maroon">Asper Beauty</span>
            <span className="font-sans text-sm text-muted-foreground">Brand Intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/products">Admin</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start border-b border-border bg-transparent p-0 h-auto">
            <TabsTrigger
              value="intelligence"
              className="rounded-t-md border-b-2 border-transparent data-[state=active]:border-maroon data-[state=active]:text-maroon"
            >
              Intelligence
            </TabsTrigger>
            <TabsTrigger
              value="identity"
              className="rounded-t-md border-b-2 border-transparent data-[state=active]:border-maroon data-[state=active]:text-maroon"
            >
              Identity
            </TabsTrigger>
            <TabsTrigger
              value="creative"
              className="rounded-t-md border-b-2 border-transparent data-[state=active]:border-maroon data-[state=active]:text-maroon"
            >
              Creative Studio
            </TabsTrigger>
            <TabsTrigger
              value="diagnostics"
              className="rounded-t-md border-b-2 border-transparent data-[state=active]:border-maroon data-[state=active]:text-maroon"
            >
              Diagnostics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence" className="mt-0">
            <IntelligenceTab />
          </TabsContent>
          <TabsContent value="identity" className="mt-0">
            <IdentityTab />
          </TabsContent>
          <TabsContent value="creative" className="mt-0">
            <CreativeStudioTab />
          </TabsContent>
          <TabsContent value="diagnostics" className="mt-0">
            <DiagnosticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

