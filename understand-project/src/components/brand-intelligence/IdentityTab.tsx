import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LogoToggle } from "./LogoToggle";

/**
 * Identity tab: Brand & Marketing Operations.
 * Logo toggle, SKU Growth Engine, Brand Voice Validator, Strategic Campaign Architect.
 * Design tokens: Soft Ivory, Maroon, Shiny Gold; Playfair + Montserrat.
 */
export function IdentityTab() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-xl font-semibold text-maroon">Identity</h2>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Brand marks, SKU generation, voice validation, and campaign planning.
        </p>
      </div>

      {/* Logo Toggle Showcase */}
      <section>
        <LogoToggle />
      </section>

      {/* SKU Growth Engine */}
      <section>
        <Card className="border-shiny-gold/30">
          <CardHeader>
            <CardTitle className="font-serif text-maroon">SKU Growth Engine</CardTitle>
            <CardDescription className="font-sans">
              Enter raw product data to generate SEO-ready Shopify SKUs and dual-voice descriptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sku-input" className="font-sans text-maroon">Product data (name, category, key attributes)</Label>
              <Textarea
                id="sku-input"
                placeholder="e.g. Hydrating Serum, Face, Hyaluronic Acid, 30ml"
                className="min-h-[100px] font-sans resize-y border-shiny-gold/50 focus:ring-maroon"
              />
            </div>
            <Button className="border-maroon bg-maroon text-white hover:bg-maroon/90">
              Generate SKU & copy (connect to Edge Function)
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Brand Voice Validator */}
      <section>
        <Card className="border-shiny-gold/30">
          <CardHeader>
            <CardTitle className="font-serif text-maroon">Brand Voice Validator</CardTitle>
            <CardDescription className="font-sans">
              Paste draft marketing copy; the AI evaluates Clinical vs Aesthetic tone accuracy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-input" className="font-sans text-maroon">Draft copy</Label>
              <Textarea
                id="voice-input"
                placeholder="Paste your marketing or product copy here..."
                className="min-h-[120px] font-sans resize-y border-shiny-gold/50 focus:ring-maroon"
              />
            </div>
            <Button variant="outline" className="w-full border-maroon text-maroon hover:bg-maroon/10">
              Validate tone (connect to Edge Function)
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Strategic Campaign Architect */}
      <section>
        <Card className="border-shiny-gold/30">
          <CardHeader>
            <CardTitle className="font-serif text-maroon">Strategic Campaign Architect</CardTitle>
            <CardDescription className="font-sans">
              Generate omnichannel (Instagram, WhatsApp, SMS) marketing blast inputs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-brief" className="font-sans text-maroon">Campaign brief or theme</Label>
              <Input
                id="campaign-brief"
                placeholder="e.g. Summer Glow, New Arrival, Flash Sale"
                className="font-sans border-shiny-gold/50 focus:ring-maroon"
              />
            </div>
            <Button variant="outline" className="w-full border-maroon text-maroon hover:bg-maroon/10">
              Generate campaign copy (connect to Edge Function)
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

