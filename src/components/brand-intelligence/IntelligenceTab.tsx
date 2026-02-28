import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Persona = "dr-sami" | "ms-zain";

/**
 * Intelligence tab: Dual-Persona Chat + clinical tools → Gemini/Supabase Edge Functions.
 */
const TOOLS = [
  {
    id: "visual-skin-diagnostic",
    title: "Visual Skin Diagnostic",
    description: "Analyze skin condition from images and recommend product matches.",
  },
  {
    id: "ingredient-safety-shield",
    title: "Ingredient Safety Shield",
    description: "Check ingredients for safety, allergens, and compliance.",
  },
  {
    id: "multimodal-shelfie-audit",
    title: "Multimodal Shelfie Audit",
    description: "Audit shelf and display imagery for compliance and best practice.",
  },
] as const;

export function IntelligenceTab() {
  const [persona, setPersona] = useState<Persona>("dr-sami");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl font-semibold text-maroon">Intelligence</h2>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Chat with Dr. Sami or Ms. Zain, plus clinical tools: diagnostics, ingredient safety, and shelf audits.
        </p>
      </div>

      {/* Dual-Persona Chat */}
      <Card className="border-shiny-gold/30">
        <CardHeader>
          <CardTitle className="font-serif text-maroon">Dual-Persona Chat</CardTitle>
          <CardDescription className="font-sans">
            Dr. Sami (Clinical Authority) · Ms. Zain (Beauty Concierge). Connect to Edge Function for live responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="inline-flex rounded-full border border-shiny-gold/50 bg-white p-1">
            <button
              type="button"
              onClick={() => setPersona("dr-sami")}
              className={`rounded-full px-4 py-2 font-sans text-sm transition-all ${
                persona === "dr-sami" ? "bg-maroon text-white" : "text-dark-charcoal hover:text-maroon"
              }`}
            >
              Dr. Sami
            </button>
            <button
              type="button"
              onClick={() => setPersona("ms-zain")}
              className={`rounded-full px-4 py-2 font-sans text-sm transition-all ${
                persona === "ms-zain" ? "bg-maroon text-white" : "text-dark-charcoal hover:text-maroon"
              }`}
            >
              Ms. Zain
            </button>
          </div>
          <Textarea
            placeholder={persona === "dr-sami" ? "Ask Dr. Sami about clinical efficacy, ingredients, safety..." : "Ask Ms. Zain about routines, aesthetics, product pairing..."}
            className="min-h-[80px] font-sans resize-y border-shiny-gold/50"
          />
          <Button className="border-maroon bg-maroon text-white hover:bg-maroon/90">
            Send (connect to Edge Function)
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.id} className="border-shiny-gold/30 transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-maroon">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" size="sm" className="w-full border-maroon text-maroon hover:bg-maroon/10">
                Open (connect to Edge Function)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
