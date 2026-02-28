import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Diagnostics & Logistics: supply chain and competitor analysis tools.
 * Design tokens: Soft Ivory, Maroon, Shiny Gold.
 */
const TOOLS = [
  {
    id: "batch-auditor",
    title: "Authentic Quality Batch Auditor",
    description:
      "Scan product batch codes or labels for Freshness Guarantee verification.",
  },
  {
    id: "competitive-auditor",
    title: "Competitive Aesthetic Auditor",
    description:
      "Upload competitor screenshots for a Visual Contrast Audit against our Ivory/Gold framework.",
  },
] as const;

export function DiagnosticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-maroon">
          Diagnostics & Logistics
        </h2>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Supply chain quality and competitor visual audit tools.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card
            key={tool.id}
            className="border-shiny-gold/30 transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-base text-maroon">
                {tool.title}
              </CardTitle>
              <CardDescription className="font-sans">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-maroon text-maroon hover:bg-maroon/10"
              >
                Open (connect to Edge Function)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
