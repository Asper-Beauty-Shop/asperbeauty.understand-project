import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AsperLogo from "@/components/brand/AsperLogo";

const colorSwatches = [
  { name: "Soft Ivory", hex: "#F8F8FF", hsl: "240 100% 99.2%", token: "--background", role: "Canvas" },
  { name: "Deep Maroon", hex: "#800020", hsl: "345 100% 25%", token: "--primary", role: "Primary Action" },
  { name: "Shiny Gold", hex: "#C5A028", hsl: "43 69% 46%", token: "--accent", role: "Accent / Trust" },
  { name: "Pure White", hex: "#FFFFFF", hsl: "0 0% 100%", token: "--card", role: "Digital Tray" },
  { name: "Warm Muted", hex: "#EFEBE4", hsl: "30 20% 94%", token: "--muted", role: "Secondary Surface" },
  { name: "Text Dark", hex: "#333333", hsl: "0 0% 20%", token: "--foreground", role: "Body Text" },
];

const typographyScale = [
  { label: "Display", font: "Playfair Display", weight: "700", size: "3.5rem", sample: "Curated by Pharmacists. Powered by Intelligence." },
  { label: "Heading 1", font: "Playfair Display", weight: "600", size: "2.25rem", sample: "Where Science Meets Soul" },
  { label: "Heading 2", font: "Playfair Display", weight: "600", size: "1.875rem", sample: "Intelligent. Authentic. Eternal." },
  { label: "Subtitle", font: "Montserrat", weight: "500", size: "1.125rem", sample: "Curated by Pharmacists. Built for Trust. Designed for Elegance." },
  { label: "Body", font: "Montserrat", weight: "400", size: "1rem", sample: "We are not just selling cosmetics; we are dispensing beauty through intelligence." },
  { label: "Caption", font: "Montserrat", weight: "300", size: "0.75rem", sample: "PHARMACIST VERIFIED â€¢ BATCH TESTED" },
];

export default function BrandShowcase() {
  const [logoVariant, setLogoVariant] = useState<"seal" | "bloom">("seal");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-primary">Asper</span>
            <Badge variant="outline" className="border-accent text-accent text-[10px] tracking-[0.2em]">
              BRAND IDENTITY
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Logo Showcase */}
        <section className="text-center space-y-8">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-2">Logo Design System</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
              Two Marks, <span className="text-primary">One Voice</span>
            </h1>
            <p className="mt-4 text-muted-foreground font-body max-w-xl mx-auto">
              Toggle between the Architectural Seal and the Molecular Bloom â€” 
              two expressions of the same pharmacist-grade integrity.
            </p>
          </div>

          {/* Logo toggle */}
          <div className="flex justify-center gap-3">
            <Button
              variant={logoVariant === "seal" ? "default" : "outline"}
              size="sm"
              onClick={() => setLogoVariant("seal")}
              className="text-xs tracking-wider"
            >
              Architectural Seal
            </Button>
            <Button
              variant={logoVariant === "bloom" ? "default" : "outline"}
              size="sm"
              onClick={() => setLogoVariant("bloom")}
              className="text-xs tracking-wider"
            >
              Molecular Bloom
            </Button>
          </div>

          {/* Logo display on tray cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Light background */}
            <Card className="border-border/50">
              <CardContent className="p-10 flex flex-col items-center gap-4">
                <AsperLogo variant={logoVariant} size={140} animated />
                <p className="text-xs text-muted-foreground font-body">On Ivory Canvas</p>
              </CardContent>
            </Card>
            {/* Dark background */}
            <Card className="bg-foreground border-foreground">
              <CardContent className="p-10 flex flex-col items-center gap-4">
                <div className="[&_text]:fill-[hsl(40,33%,96%)] [&_circle]:stroke-[hsl(40,33%,96%)] [&_path]:fill-[hsl(40,33%,96%)] [&_polygon]:fill-[hsl(345,80%,55%)] [&_polygon:nth-child(odd)]:fill-[hsl(345,70%,60%)]">
                  <AsperLogo variant={logoVariant} size={140} animated />
                </div>
                <p className="text-xs text-muted font-body">On Dark Surface</p>
              </CardContent>
            </Card>
            {/* Gold background */}
            <Card className="bg-accent border-accent">
              <CardContent className="p-10 flex flex-col items-center gap-4">
                <div className="[&_text]:fill-white [&_circle[stroke]]:stroke-white [&_path]:fill-white [&_line]:stroke-white [&_polygon]:fill-white [&_polygon]:opacity-80">
                  <AsperLogo variant={logoVariant} size={140} animated />
                </div>
                <p className="text-xs text-accent-foreground/80 font-body">On Gold</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs: Colors / Typography / Usage */}
        <Tabs defaultValue="colors" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="colors" className="text-xs tracking-wider">Palette</TabsTrigger>
            <TabsTrigger value="typography" className="text-xs tracking-wider">Typography</TabsTrigger>
            <TabsTrigger value="elements" className="text-xs tracking-wider">Elements</TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors" className="mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {colorSwatches.map((c) => (
                <Card key={c.token} className="overflow-hidden border-border/50">
                  <div
                    className="h-24"
                    style={{ backgroundColor: c.hex }}
                  />
                  <CardContent className="p-3 space-y-1">
                    <p className="font-body text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="font-body text-[10px] text-muted-foreground tracking-wide">{c.hex}</p>
                    <Badge variant="secondary" className="text-[9px]">{c.role}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="mt-10 space-y-6">
            {typographyScale.map((t) => (
              <div key={t.label} className="border-b border-border/30 pb-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <Badge variant="outline" className="text-[9px] tracking-wider shrink-0">{t.label}</Badge>
                  <span className="text-[10px] text-muted-foreground font-body">
                    {t.font} Â· {t.weight} Â· {t.size}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: t.font === "Playfair Display" ? "var(--font-heading)" : "var(--font-body)",
                    fontWeight: Number(t.weight),
                    fontSize: t.size,
                  }}
                  className="text-foreground leading-tight"
                >
                  {t.sample}
                </p>
              </div>
            ))}
          </TabsContent>

          {/* UI Elements */}
          <TabsContent value="elements" className="mt-10 space-y-10">
            {/* Digital Tray Pattern */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Digital Tray Pattern</h3>
              <p className="text-muted-foreground font-body text-sm mb-6">
                Products sit on "pure white trays" over the ivory canvas, featuring the signature Gold Stitch hover effect.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {["Cleanser", "Serum", "SPF Shield"].map((name) => (
                  <Card
                    key={name}
                    className="group border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded-md mb-4 flex items-center justify-center relative">
                        <span className="text-muted-foreground font-body text-xs uppercase tracking-wider">Product Image</span>
                        {/* Gold Seal */}
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full border border-accent flex items-center justify-center">
                          <span className="text-accent text-[6px] font-bold">âœ“</span>
                        </div>
                      </div>
                      <p className="font-heading text-lg font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground font-body mt-1">Pharmacist Verified</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Button Styles */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Button Vocabulary</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest text-xs uppercase">
                  Primary Action
                </Button>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground tracking-widest text-xs uppercase">
                  Gold Outline
                </Button>
                <Button variant="secondary" className="tracking-widest text-xs uppercase">
                  Secondary
                </Button>
                <Button variant="ghost" className="text-primary tracking-widest text-xs uppercase">
                  Ghost
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Gold Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Persona Cards */}
        <section className="text-center space-y-8">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Dual-Persona <span className="text-primary">Visual Language</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-primary/20 overflow-hidden">
              <div className="h-1 bg-primary" />
              <CardContent className="p-8 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm">
                    DS
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">Dr. Sami Mode</p>
                    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Clinical Authority</p>
                  </div>
                </div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Deep Maroon dominates. Typography is precise and structured. 
                  Gold is used sparingly for verification seals and trust markers.
                </p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded bg-primary" />
                  <div className="h-8 w-8 rounded bg-card border border-border" />
                  <div className="h-8 w-8 rounded bg-muted" />
                  <div className="h-8 w-3 rounded bg-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 overflow-hidden">
              <div className="h-1 bg-accent" />
              <CardContent className="p-8 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-heading font-bold text-sm">
                    MZ
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">Ms. Zain Mode</p>
                    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Beauty Concierge</p>
                  </div>
                </div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Gold takes the lead with warmer tones. Typography becomes more editorial 
                  and flowing. Maroon recedes to accents only.
                </p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded bg-accent" />
                  <div className="h-8 w-8 rounded bg-card border border-border" />
                  <div className="h-8 w-8 rounded bg-secondary" />
                  <div className="h-8 w-3 rounded bg-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-background">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-6" />
          <p className="text-xs text-muted-foreground font-body">
            Â© {new Date().getFullYear()} Asper Beauty Shop Â· Brand Identity Guide v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
