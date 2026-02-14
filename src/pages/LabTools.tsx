import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, Atom, Zap, PenTool, Send, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

const LAB_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lab-tools`;

function useLabStream() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (tool: string, input: string) => {
    setResult("");
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(LAB_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ tool, input }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setResult(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult("");
    setError(null);
  }, []);

  return { result, loading, error, run, reset };
}

function DeepDiveTab() {
  const [ingredient, setIngredient] = useState("");
  const { result, loading, error, run, reset } = useLabStream();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Molecular Deep-Dive</h3>
        <p className="text-sm text-muted-foreground font-body">
          Enter any ingredient to get a dual-perspective analysis — pharmacology from Dr. Sami and beauty ritual from Ms. Zain.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ingredient.trim()) run("deep-dive", ingredient.trim());
        }}
        className="flex gap-2"
      >
        <Input
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="e.g., Retinol, Niacinamide, Centella Asiatica..."
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !ingredient.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
        {result && (
          <Button type="button" variant="ghost" size="icon" onClick={() => { reset(); setIngredient(""); }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </form>

      {error && <p className="text-sm text-destructive font-body">⚠️ {error}</p>}

      {result && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <ScrollArea className="max-h-[500px]">
              <div className="prose prose-sm max-w-none dark:prose-invert font-body">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SynergyTab() {
  const [ingredientA, setIngredientA] = useState("");
  const [ingredientB, setIngredientB] = useState("");
  const { result, loading, error, run, reset } = useLabStream();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Routine Synergy Checker</h3>
        <p className="text-sm text-muted-foreground font-body">
          Check if two ingredients or products work in synergy or conflict.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ingredientA.trim() && ingredientB.trim())
            run("synergy", `Ingredient A: ${ingredientA.trim()}\nIngredient B: ${ingredientB.trim()}`);
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            value={ingredientA}
            onChange={(e) => setIngredientA(e.target.value)}
            placeholder="Ingredient / Product A"
            disabled={loading}
          />
          <Input
            value={ingredientB}
            onChange={(e) => setIngredientB(e.target.value)}
            placeholder="Ingredient / Product B"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !ingredientA.trim() || !ingredientB.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Check Synergy
          </Button>
          {result && (
            <Button type="button" variant="ghost" onClick={() => { reset(); setIngredientA(""); setIngredientB(""); }}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          )}
        </div>
      </form>

      {error && <p className="text-sm text-destructive font-body">⚠️ {error}</p>}

      {result && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <ScrollArea className="max-h-[500px]">
              <div className="prose prose-sm max-w-none dark:prose-invert font-body">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CopywriterTab() {
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const { result, loading, error, run, reset } = useLabStream();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Dynamic Copywriter</h3>
        <p className="text-sm text-muted-foreground font-body">
          Generate marketing copy in both the Clinical and Aesthetic voices instantly.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (productName.trim())
            run(
              "copywriter",
              `Product: ${productName.trim()}${ingredients.trim() ? `\nKey Ingredients: ${ingredients.trim()}` : ""}`
            );
        }}
        className="space-y-3"
      >
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product name (e.g., Vitamin C Brightening Serum)"
          disabled={loading}
        />
        <Input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Key ingredients (optional, e.g., 15% L-Ascorbic Acid, Ferulic Acid, Vitamin E)"
          disabled={loading}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !productName.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PenTool className="h-4 w-4 mr-2" />}
            Generate Copy
          </Button>
          {result && (
            <Button type="button" variant="ghost" onClick={() => { reset(); setProductName(""); setIngredients(""); }}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          )}
        </div>
      </form>

      {error && <p className="text-sm text-destructive font-body">⚠️ {error}</p>}

      {result && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <ScrollArea className="max-h-[500px]">
              <div className="prose prose-sm max-w-none dark:prose-invert font-body">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function LabTools() {
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
            <FlaskConical className="h-5 w-5 text-primary" />
            <span className="font-heading text-xl font-bold text-primary">Asper Lab</span>
            <Badge variant="outline" className="border-accent text-accent text-[10px] tracking-[0.2em]">
              AI TOOLS
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-4">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-accent">Powered by Gemini</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            The <span className="text-primary">Intelligence</span> Behind the Shelf
          </h1>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Deep-research tools that leverage AI to analyze ingredients, check product compatibility,
            and generate brand copy — all through the lens of your dual-persona identity.
          </p>
        </section>

        {/* Gold divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Tool Tabs */}
        <Tabs defaultValue="deep-dive">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deep-dive" className="text-xs tracking-wider gap-1.5">
              <Atom className="h-3.5 w-3.5" />
              Deep-Dive
            </TabsTrigger>
            <TabsTrigger value="synergy" className="text-xs tracking-wider gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Synergy
            </TabsTrigger>
            <TabsTrigger value="copywriter" className="text-xs tracking-wider gap-1.5">
              <PenTool className="h-3.5 w-3.5" />
              Copywriter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deep-dive" className="mt-8">
            <DeepDiveTab />
          </TabsContent>
          <TabsContent value="synergy" className="mt-8">
            <SynergyTab />
          </TabsContent>
          <TabsContent value="copywriter" className="mt-8">
            <CopywriterTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-background mt-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-6" />
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Asper Beauty Shop · Lab Tools v1.0 · Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
