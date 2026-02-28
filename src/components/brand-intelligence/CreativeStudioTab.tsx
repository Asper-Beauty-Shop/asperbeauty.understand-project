import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TOOLS = [
  { id: "signature-packaging-studio", title: "Signature Packaging Studio", description: "Design and iterate on signature packaging concepts and mockups." },
  { id: "product-photography-concepts", title: "Product Photography Concepts", description: "Generate and refine product photography concepts and briefs." },
] as const;

export function CreativeStudioTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-maroon">Creative Studio</h2>
        <p className="mt-1 font-sans text-sm text-muted-foreground">Packaging design and product photography concepts.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.id} className="border-shiny-gold/30 transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-base text-maroon">{tool.title}</CardTitle>
              <CardDescription className="font-sans">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" size="sm" className="w-full border-maroon text-maroon hover:bg-maroon/10">Open (connect to Edge Function)</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
