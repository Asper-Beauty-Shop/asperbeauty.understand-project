import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuarantinedItem {
  row: number;
  raw: Record<string, string>;
  errors: string[];
}

interface IngestionResult {
  total_received: number;
  valid: number;
  quarantined: number;
  inserted: number;
  batch_errors: string[];
  quarantine_details: QuarantinedItem[];
}

const TEMPLATE_CSV = `name,brand,category,price,description,image_url,handle,primary_concern,regimen_step,tags,key_ingredients,pharmacist_note,clinical_badge,availability_status,in_stock,is_hero,is_bestseller
"Vichy Minéral 89 Serum","Vichy","Skincare",25.500,"Hyaluronic acid fortifying serum","https://example.com/img.jpg","vichy-mineral-89","Concern_Hydration","Step_2_Treatment","hydration;serum","Hyaluronic Acid;Mineralizing Water","Excellent for dehydrated skin barrier repair","Dermatologist Tested","in_stock",true,false,true`;

export default function CatalogIngestion() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<IngestionResult | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setResult(null);
    }
  }, []);

  const handleIngest = async () => {
    if (!file) return;
    setIsUploading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in first");
        return;
      }

      const text = await file.text();
      const isJSON = file.name.endsWith(".json");

      const res = await supabase.functions.invoke("ingest-catalog", {
        body: isJSON ? text : text,
        headers: {
          "Content-Type": isJSON ? "application/json" : "text/csv",
        },
      });

      if (res.error) throw res.error;

      const data = res.data as IngestionResult;
      setResult(data);

      if (data.quarantined === 0 && data.batch_errors.length === 0) {
        toast.success(`Successfully ingested ${data.inserted} products!`);
      } else {
        toast.warning(
          `Ingested ${data.inserted} products. ${data.quarantined} quarantined.`,
        );
      }
    } catch (err: unknown) {
      console.error("Ingestion failed:", err);
      toast.error((err as { message?: string })?.message || "Ingestion failed");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asper-catalog-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-ivory to-white">
      <Header />
      <div className="container mx-auto px-4 max-w-4xl pt-28 pb-16">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-burgundy mb-2">
            Clinical Catalog Ingestion
          </h1>
          <p className="font-body text-muted-foreground">
            Upload CSV or JSON to batch-import products with strict validation, brand normalization, and quarantine for invalid rows.
          </p>
        </div>

        {/* Template Download */}
        <Card className="mb-6" style={{ border: "1px solid hsl(var(--polished-gold) / 0.2)" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-body uppercase tracking-widest text-burgundy flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              CSV Template
            </CardTitle>
            <CardDescription className="font-body text-xs">
              Download the template with all supported columns and valid enum values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-[10px] font-body">name*</Badge>
              <Badge variant="outline" className="text-[10px] font-body">brand*</Badge>
              <Badge variant="outline" className="text-[10px] font-body">category*</Badge>
              <Badge variant="outline" className="text-[10px] font-body">price*</Badge>
              <Badge variant="outline" className="text-[10px] font-body">description</Badge>
              <Badge variant="outline" className="text-[10px] font-body">image_url</Badge>
              <Badge variant="outline" className="text-[10px] font-body">handle</Badge>
              <Badge variant="outline" className="text-[10px] font-body">primary_concern</Badge>
              <Badge variant="outline" className="text-[10px] font-body">regimen_step</Badge>
              <Badge variant="outline" className="text-[10px] font-body">tags</Badge>
              <Badge variant="outline" className="text-[10px] font-body">key_ingredients</Badge>
              <Badge variant="outline" className="text-[10px] font-body">pharmacist_note</Badge>
              <Badge variant="outline" className="text-[10px] font-body">clinical_badge</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="font-body text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-2" />
              Download Template CSV
            </Button>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card
          className="mb-6"
          style={{ border: "1px solid hsl(var(--polished-gold) / 0.2)" }}
        >
          <CardContent className="pt-6">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-sm p-12 text-center transition-colors hover:border-burgundy/40 cursor-pointer"
              style={{ borderColor: "hsl(var(--polished-gold) / 0.3)" }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-body text-sm text-asper-ink mb-1">
                {file ? file.name : "Drop CSV or JSON file here, or click to browse"}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                Supports .csv, .json — max 5,000 products per upload
              </p>
              <input
                id="file-input"
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {file && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-polished-gold" />
                  <span className="font-body text-sm text-asper-ink">{file.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                <Button
                  onClick={handleIngest}
                  disabled={isUploading}
                  className="bg-burgundy text-white hover:bg-burgundy-dark font-body text-xs uppercase tracking-widest"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Ingesting...
                    </>
                  ) : (
                    "Start Clinical Ingestion"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card style={{ border: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Received</p>
                  <p className="font-heading text-2xl text-asper-ink">{result.total_received}</p>
                </CardContent>
              </Card>
              <Card style={{ border: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Valid</p>
                  <p className="font-heading text-2xl text-green-700">{result.valid}</p>
                </CardContent>
              </Card>
              <Card style={{ border: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Inserted</p>
                  <p className="font-heading text-2xl text-burgundy">{result.inserted}</p>
                </CardContent>
              </Card>
              <Card style={{ border: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Quarantined</p>
                  <p className="font-heading text-2xl text-destructive">{result.quarantined}</p>
                </CardContent>
              </Card>
            </div>

            {/* Batch Errors */}
            {result.batch_errors.length > 0 && (
              <Card className="border-destructive/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-body text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Batch Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs font-body text-destructive">
                    {result.batch_errors.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Quarantine Details */}
            {result.quarantine_details.length > 0 && (
              <Card style={{ border: "1px solid hsl(var(--polished-gold) / 0.2)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-body uppercase tracking-widest text-burgundy flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Quarantined Products ({result.quarantined})
                  </CardTitle>
                  <CardDescription className="font-body text-xs">
                    These rows failed validation. Fix the data and re-upload.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-3">
                      {result.quarantine_details.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-sm text-xs"
                          style={{
                            backgroundColor: "hsl(var(--destructive) / 0.04)",
                            border: "1px solid hsl(var(--destructive) / 0.15)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="destructive" className="text-[10px]">Row {item.row}</Badge>
                            <span className="font-body text-asper-ink font-medium">
                              {item.raw.name || item.raw.title || "Unknown"}
                            </span>
                          </div>
                          <ul className="space-y-0.5 text-destructive font-body">
                            {item.errors.map((err, j) => (
                              <li key={j}>↳ {err}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Success State */}
            {result.quarantined === 0 && result.batch_errors.length === 0 && (
              <Card style={{ border: "1px solid hsl(var(--polished-gold) / 0.3)" }}>
                <CardContent className="pt-6 pb-6 text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-600" />
                  <p className="font-heading text-lg text-asper-ink">
                    Clinical Ingestion Complete
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    All {result.inserted} products passed strict validation and are now live.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
