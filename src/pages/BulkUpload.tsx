import { useCallback, useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Image,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Settings,
  ShoppingBag,
  Sparkles,
  Square,
  Table,
  Upload,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ExcelJS from "exceljs";
import { QueueItem, useImageQueue } from "@/lib/imageGenerationQueue";

interface ProcessedProduct {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  costPrice: number;
  imagePrompt: string;
  imageUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

interface UploadSummary {
  total: number;
  categories: Record<string, number>;
  brands: Record<string, number>;
}

interface RawProduct {
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
}

// Column name mappings for Arabic Excel files
const COLUMN_MAPPINGS = {
  sku: ["Ø§Ù„Ø±Ù…Ø²", "Ø±Ù…Ø²", "SKU", "Code", "Barcode", "Ø§Ù„Ø¨Ø§Ø±ÙƒÙˆØ¯"],
  name: ["Ø§Ø³Ù… Ø§Ù„Ù…Ø§Ø¯Ø©", "Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬", "Product Name", "Name", "Ø§Ù„Ù…Ù†ØªØ¬", "Ø§Ù„Ø§Ø³Ù…"],
  costPrice: ["Ø§Ù„ÙƒÙ„ÙØ©", "Ø³Ø¹Ø± Ø§Ù„Ø´Ø±Ø§Ø¡", "Cost", "Cost Price", "Ø§Ù„ØªÙƒÙ„ÙØ©"],
  sellingPrice: ["Ø³Ø¹Ø± Ø§Ù„Ø¨ÙŠØ¹", "Ø§Ù„Ø³Ø¹Ø±", "Price", "Selling Price", "Sale Price"],
};

// Find the matching column name from the headers
function findColumn(headers: string[], possibleNames: string[]): string | null {
  for (const name of possibleNames) {
    const found = headers.find((h) =>
      h.toLowerCase().trim() === name.toLowerCase().trim() ||
      h.includes(name) ||
      name.includes(h)
    );
    if (found) return found;
  }
  return null;
}

export default function BulkUpload() {
  const [step, setStep] = useState<
    "upload" | "categorize" | "images" | "review" | "shopify"
  >("upload");
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });
  const [rawData, setRawData] = useState<RawProduct[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");
  const [previewData, setPreviewData] = useState<RawProduct[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Use the queue system for image generation
  const {
    stats: queueStats,
    items: queueItems,
    status: queueStatus,
    config: queueConfig,
    addItems: addToQueue,
    start: startQueue,
    pause: pauseQueue,
    resume: resumeQueue,
    stop: stopQueue,
    clear: clearQueue,
    retryFailed: retryFailedItems,
    updateConfig,
  } = useImageQueue();

  // Sync queue items back to products state
  useEffect(() => {
    if (queueItems.length > 0) {
      setProducts((prev) =>
        prev.map((p) => {
          const queueItem = queueItems.find((q) => q.sku === p.sku);
          if (queueItem) {
            return {
              ...p,
              status: queueItem.status === "queued"
                ? "pending" as const
                : queueItem.status === "retrying"
                ? "processing" as const
                : queueItem.status as "pending" | "processing" | "completed" | "failed",
              imageUrl: queueItem.imageUrl,
              error: queueItem.error,
            };
          }
          return p;
        })
      );
    }
  }, [queueItems]);

  // Format time remaining
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // Parse Excel/CSV file using exceljs library
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setParseError("");
      setFileName(file.name);
      toast.info(`Parsing ${file.name}...`);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        // Get the first sheet
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error("No worksheet found in the Excel file");
        }

        // Get headers from the first row
        const headerRow = worksheet.getRow(1);
        const headers: string[] = [];
        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          headers[colNumber - 1] = String(cell.value || "").trim();
        });

        if (headers.length === 0) {
          throw new Error("No headers found in the Excel file");
        }

        console.log("Found headers:", headers);

        // Find matching columns
        const skuColIdx = headers.findIndex((h) =>
          COLUMN_MAPPINGS.sku.some((m) =>
            h.toLowerCase().trim() === m.toLowerCase().trim() ||
            h.includes(m) || m.includes(h)
          )
        );
        const nameColIdx = headers.findIndex((h) =>
          COLUMN_MAPPINGS.name.some((m) =>
            h.toLowerCase().trim() === m.toLowerCase().trim() ||
            h.includes(m) || m.includes(h)
          )
        );
        const costColIdx = headers.findIndex((h) =>
          COLUMN_MAPPINGS.costPrice.some((m) =>
            h.toLowerCase().trim() === m.toLowerCase().trim() ||
            h.includes(m) || m.includes(h)
          )
        );
        const priceColIdx = headers.findIndex((h) =>
          COLUMN_MAPPINGS.sellingPrice.some((m) =>
            h.toLowerCase().trim() === m.toLowerCase().trim() ||
            h.includes(m) || m.includes(h)
          )
        );

        console.log("Mapped columns:", {
          skuColIdx,
          nameColIdx,
          costColIdx,
          priceColIdx,
        });

        if (nameColIdx === -1) {
          throw new Error(
            `Could not find product name column. Found columns: ${
              headers.join(", ")
            }`,
          );
        }

        // Parse products from rows (skip header row)
        const parsedProducts: RawProduct[] = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row

          const getCellValue = (colIdx: number): string => {
            if (colIdx === -1) return "";
            const cell = row.getCell(colIdx + 1);
            return String(cell.value || "").trim();
          };

          const name = getCellValue(nameColIdx);
          if (!name) return;

          parsedProducts.push({
            sku: getCellValue(skuColIdx) || `SKU-${rowNumber}`,
            name,
            costPrice:
              parseFloat(getCellValue(costColIdx).replace(/[^0-9.]/g, "")) || 0,
            sellingPrice:
              parseFloat(getCellValue(priceColIdx).replace(/[^0-9.]/g, "")) ||
              0,
          });
        });

        if (parsedProducts.length === 0) {
          throw new Error("No valid products found in the file");
        }

        setRawData(parsedProducts);
        setPreviewData(parsedProducts.slice(0, 10));
        toast.success(
          `Successfully loaded ${parsedProducts.length} products from ${file.name}`,
        );
        setStep("categorize");
      } catch (error: unknown) {
        console.error("Parse error:", error);
        const msg = error instanceof Error ? error.message : String(error);
        setParseError(msg || "Failed to parse file");
        toast.error(`Failed to parse file: ${msg}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  // Load the bundled Excel file
  const loadBundledFile = useCallback(async () => {
    setIsProcessing(true);
    setParseError("");
    setFileName("products-data.xlsx");
    toast.info("Loading product data...");

    try {
      const response = await fetch("/data/products-data.xlsx");
      if (!response.ok) throw new Error("Failed to fetch file");

      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error("No worksheet found in the Excel file");
      }

      // Get headers from the first row
      const headerRow = worksheet.getRow(1);
      const headers: string[] = [];
      headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        headers[colNumber - 1] = String(cell.value || "").trim();
      });

      if (headers.length === 0) {
        throw new Error("No headers found in the Excel file");
      }

      console.log("Found headers:", headers);

      const skuColIdx = headers.findIndex((h) =>
        COLUMN_MAPPINGS.sku.some((m) =>
          h.toLowerCase().trim() === m.toLowerCase().trim() || h.includes(m) ||
          m.includes(h)
        )
      );
      const nameColIdx = headers.findIndex((h) =>
        COLUMN_MAPPINGS.name.some((m) =>
          h.toLowerCase().trim() === m.toLowerCase().trim() || h.includes(m) ||
          m.includes(h)
        )
      );
      const costColIdx = headers.findIndex((h) =>
        COLUMN_MAPPINGS.costPrice.some((m) =>
          h.toLowerCase().trim() === m.toLowerCase().trim() || h.includes(m) ||
          m.includes(h)
        )
      );
      const priceColIdx = headers.findIndex((h) =>
        COLUMN_MAPPINGS.sellingPrice.some((m) =>
          h.toLowerCase().trim() === m.toLowerCase().trim() || h.includes(m) ||
          m.includes(h)
        )
      );

      if (nameColIdx === -1) {
        throw new Error(
          `Could not find product name column. Found columns: ${
            headers.join(", ")
          }`,
        );
      }

      const parsedProducts: RawProduct[] = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const getCellValue = (colIdx: number): string => {
          if (colIdx === -1) return "";
          const cell = row.getCell(colIdx + 1);
          return String(cell.value || "").trim();
        };

        const name = getCellValue(nameColIdx);
        if (!name) return;

        parsedProducts.push({
          sku: getCellValue(skuColIdx) || `SKU-${rowNumber}`,
          name,
          costPrice:
            parseFloat(getCellValue(costColIdx).replace(/[^0-9.]/g, "")) || 0,
          sellingPrice:
            parseFloat(getCellValue(priceColIdx).replace(/[^0-9.]/g, "")) || 0,
        });
      });

      if (parsedProducts.length === 0) {
        throw new Error("No valid products found in the file");
      }

      setRawData(parsedProducts);
      setPreviewData(parsedProducts.slice(0, 10));
      toast.success(`Successfully loaded ${parsedProducts.length} products`);
      setStep("categorize");
    } catch (error: unknown) {
      console.error("Load error:", error);
      const msg = error instanceof Error ? error.message : String(error);
      setParseError(msg || "Failed to load file");
      toast.error(`Failed to load file: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Categorize products using edge function
  const categorizeProducts = useCallback(async () => {
    setIsProcessing(true);
    setProgress({
      current: 0,
      total: rawData.length,
      stage: "Categorizing products...",
    });

    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error("Please log in as an admin to use bulk upload");
        setIsProcessing(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "bulk-product-upload",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: { action: "categorize", products: rawData },
        },
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setProducts(data.products);
      setSummary(data.summary);
      toast.success(
        `Categorized ${data.products.length} products into ${
          Object.keys(data.summary.categories).length
        } categories`,
      );
      setStep("images");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      if (msg?.includes("401") || msg?.includes("Unauthorized")) {
        toast.error("Authentication required. Please log in.");
      } else if (msg?.includes("403") || msg?.includes("Forbidden")) {
        toast.error("Admin access required for bulk operations.");
      } else {
        toast.error("Failed to categorize products");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [rawData]);

  // Initialize queue with products and start generation
  const startImageGeneration = useCallback(() => {
    // Clear any existing queue
    clearQueue();

    // Add all pending products to the queue
    const pendingProducts = products.filter((p) =>
      p.status === "pending" || p.status === "failed"
    );

    const queueItems = pendingProducts.map((p) => ({
      id: p.sku,
      sku: p.sku,
      name: p.name,
      category: p.category,
      imagePrompt: p.imagePrompt,
    }));

    addToQueue(queueItems);
    startQueue();

    toast.success(
      `Started generating images for ${pendingProducts.length} products`,
    );
  }, [products, clearQueue, addToQueue, startQueue]);

  // Handle queue completion
  useEffect(() => {
    if (
      queueStats.total > 0 && queueStats.completed === queueStats.total &&
      !queueStatus.isProcessing
    ) {
      toast.success(`Generated ${queueStats.completed} images`);
      if (queueStats.failed === 0) {
        setStep("review");
      }
    }
  }, [queueStats, queueStatus.isProcessing]);

  // Shopify upload state
  const [shopifyProgress, setShopifyProgress] = useState({
    current: 0,
    total: 0,
    succeeded: 0,
    failed: 0,
    stage: "",
    currentProduct: "",
  });
  const [shopifyErrors, setShopifyErrors] = useState<
    Array<{ sku: string; name: string; error: string }>
  >([]);
  const [isShopifyUploading, setIsShopifyUploading] = useState(false);

  // Upload to Shopify using the edge function
  const uploadToShopify = useCallback(async () => {
    // Get current session for authentication
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      toast.error("Please log in as an admin to upload to Shopify");
      return;
    }

    setIsShopifyUploading(true);
    setShopifyErrors([]);
    const readyProducts = products.filter((p) =>
      p.status === "completed" && p.imageUrl
    );
    setShopifyProgress({
      current: 0,
      total: readyProducts.length,
      succeeded: 0,
      failed: 0,
      stage: "Preparing upload...",
      currentProduct: "",
    });

    const BATCH_SIZE = 5; // Process 5 products at a time
    const errors: Array<{ sku: string; name: string; error: string }> = [];
    let succeeded = 0;

    // Process in batches
    for (let i = 0; i < readyProducts.length; i += BATCH_SIZE) {
      const batch = readyProducts.slice(i, i + BATCH_SIZE);

      // Process each product in the batch sequentially to avoid rate limits
      for (let j = 0; j < batch.length; j++) {
        const product = batch[j];
        const currentIndex = i + j + 1;

        setShopifyProgress((prev) => ({
          ...prev,
          current: currentIndex,
          stage: `Creating product ${currentIndex} of ${readyProducts.length}`,
          currentProduct: product.name,
        }));

        try {
          // Call edge function to create Shopify product
          const { data, error } = await supabase.functions.invoke(
            "bulk-product-upload",
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
              body: {
                action: "create-shopify-product",
                product: {
                  title: product.name,
                  body: `${product.brand} - ${product.category}`,
                  vendor: product.brand,
                  product_type: product.category,
                  tags: `${product.category}, ${product.brand}, bulk-upload`,
                  price: product.price.toFixed(2),
                  sku: product.sku,
                  imageUrl: product.imageUrl,
                },
              },
            },
          );

          if (error) throw new Error(error.message);
          if (data?.error) throw new Error(data.error);

          succeeded++;
          setShopifyProgress((prev) => ({
            ...prev,
            succeeded,
          }));

          // Add small delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error: unknown) {
          console.error(`Failed to create ${product.name}:`, error);
          const msg = error instanceof Error ? error.message : String(error);

          // Check for auth errors and stop if unauthorized
          if (
            msg?.includes("401") || msg?.includes("403") ||
            msg?.includes("Unauthorized") || msg?.includes("Forbidden")
          ) {
            toast.error("Authorization failed. Please log in as an admin.");
            setIsShopifyUploading(false);
            return;
          }

          errors.push({
            sku: product.sku,
            name: product.name,
            error: msg || "Unknown error",
          });
          setShopifyProgress((prev) => ({
            ...prev,
            failed: prev.failed + 1,
          }));
        }
      }
    }

    setShopifyErrors(errors);
    setIsShopifyUploading(false);

    if (succeeded > 0) {
      toast.success(`Successfully created ${succeeded} products in Shopify!`);
    }
    if (errors.length > 0) {
      toast.error(`${errors.length} products failed to upload`);
    }
  }, [products]);

  const getStatusIcon = (status: ProcessedProduct["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return;
        <div className="w-4 h-4 rounded-full border-2 border-taupe/30" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-serif text-charcoal mb-4">
                Bulk Product Upload
              </h1>
              <p className="text-taupe">
                Upload, categorize, and generate images for your products
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {[
                { id: "upload", icon: Upload, label: "Upload" },
                { id: "categorize", icon: Sparkles, label: "Categorize" },
                { id: "images", icon: Image, label: "Generate Images" },
                { id: "review", icon: FileSpreadsheet, label: "Review" },
                {
                  id: "shopify",
                  icon: ShoppingBag,
                  label: "Upload to Shopify",
                },
              ].map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      step === s.id
                        ? "bg-burgundy text-cream"
                        : products.length > 0 &&
                            ["upload", "categorize"].includes(s.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-taupe/10 text-taupe"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  {i < 4 && <div className="w-8 h-px bg-taupe/20 mx-2" />}
                </div>
              ))}
            </div>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === "upload" && "Upload Product Data"}
                  {step === "categorize" && "Auto-Categorize Products"}
                  {step === "images" && "Generate Product Images"}
                  {step === "review" && "Review Products"}
                  {step === "shopify" && "Upload to Shopify"}
                </CardTitle>
                <CardDescription>
                  {step === "upload" &&
                    "Upload an Excel or CSV file with your product data"}
                  {step === "categorize" &&
                    "AI will automatically categorize products and extract brands"}
                  {step === "images" &&
                    "Generate professional product images using AI"}
                  {step === "review" &&
                    "Review categorized products before uploading"}
                  {step === "shopify" && "Final upload to your Shopify store"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Step */}
                {step === "upload" && (
                  <div className="space-y-8">
                    <div className="text-center py-8">
                      <div className="border-2 border-dashed border-taupe/30 rounded-xl p-12 hover:border-burgundy/50 transition-colors">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-taupe" />
                        <p className="text-charcoal mb-4">
                          Drop your Excel or CSV file here
                        </p>
                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button asChild disabled={isProcessing}>
                            <span>
                              {isProcessing
                                ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                )
                                : (
                                  <>
                                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                                    Choose File
                                  </>
                                )}
                            </span>
                          </Button>
                        </label>
                        <p className="text-sm text-taupe mt-4">
                          Supports Arabic columns: Ø§Ù„Ø±Ù…Ø²ØŒ Ø§Ø³Ù… Ø§Ù„Ù…Ø§Ø¯Ø©ØŒ Ø³Ø¹Ø± Ø§Ù„Ø¨ÙŠØ¹ØŒ
                          Ø§Ù„ÙƒÙ„ÙØ©
                        </p>
                      </div>

                      {parseError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          {parseError}
                        </div>
                      )}
                    </div>

                    {/* Quick Load Options */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={loadBundledFile}
                        disabled={isProcessing}
                        className="h-auto py-6 flex-col gap-2"
                      >
                        <Download className="w-6 h-6" />
                        <span className="font-medium">
                          Load Your Product Data
                        </span>
                        <span className="text-xs text-taupe">
                          1,526 products from ÙƒØ´Ù Ø§Ù„Ù…ÙˆØ§Ø¯
                        </span>
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          const sampleData: RawProduct[] = [
                            {
                              sku: "777284",
                              name: "BLACK HAIR PINS",
                              costPrice: 0.259,
                              sellingPrice: 0.500,
                            },
                            {
                              sku: "737383722396",
                              name: "PALMERS OLIVE OIL COND 400 ML",
                              costPrice: 4.487,
                              sellingPrice: 9.750,
                            },
                            {
                              sku: "737383722622",
                              name:
                                "PALMER-S OLIVE OIL BODY LOTION PUMP (400ML)",
                              costPrice: 6.840,
                              sellingPrice: 10.000,
                            },
                            {
                              sku: "737383743893",
                              name:
                                "PALMERS COCOA BUTTER FORMULA BODY LOTION 400 ML",
                              costPrice: 10.310,
                              sellingPrice: 14.950,
                            },
                            {
                              sku: "737383772223",
                              name:
                                "PALMERS SKINSUCCESS FADE CREAM (OILY SKIN) (75GM)",
                              costPrice: 8.836,
                              sellingPrice: 15.950,
                            },
                            {
                              sku: "737383787772",
                              name:
                                "PALMERS SKIN SUCCESS DEEP CLEANSING (250 ML)",
                              costPrice: 4.333,
                              sellingPrice: 9.500,
                            },
                            {
                              sku: "737768773629",
                              name: "SUNDOWN PAPAYA ENZYME (100 CHEWABLE TAB)",
                              costPrice: 9.600,
                              sellingPrice: 12.900,
                            },
                            {
                              sku: "764642727334",
                              name:
                                "JAMIESON VIT C 500 CHEWABLE (100+20TABLETS)",
                              costPrice: 9.418,
                              sellingPrice: 13.900,
                            },
                            {
                              sku: "722277947238",
                              name: "SPEED STICK OCEAN SURF (51G)",
                              costPrice: 1.650,
                              sellingPrice: 2.750,
                            },
                            {
                              sku: "7447477",
                              name: "ARTELAC ADVANCED E/D (30*0.5ML)",
                              costPrice: 5.672,
                              sellingPrice: 8.630,
                            },
                          ];
                          setRawData(sampleData);
                          setPreviewData(sampleData);
                          setFileName("sample-data");
                          toast.success("Loaded 10 sample products");
                          setStep("categorize");
                        }}
                        className="h-auto py-6 flex-col gap-2"
                      >
                        <Sparkles className="w-6 h-6" />
                        <span className="font-medium">Use Sample Data</span>
                        <span className="text-xs text-taupe">
                          10 products for testing
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Categorize Step */}
                {step === "categorize" && (
                  <div className="space-y-6">
                    <div className="bg-taupe/5 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-charcoal">
                            Products Loaded: {rawData.length}
                          </h3>
                          {fileName && (
                            <p className="text-sm text-taupe">
                              From: {fileName}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          <Table className="w-3 h-3 mr-1" />
                          {rawData.length} rows
                        </Badge>
                      </div>

                      {/* Data Preview Table */}
                      <div className="bg-white rounded-lg border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-taupe/10">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-charcoal">
                                  SKU
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-charcoal">
                                  Product Name
                                </th>
                                <th className="px-4 py-2 text-right font-medium text-charcoal">
                                  Cost
                                </th>
                                <th className="px-4 py-2 text-right font-medium text-charcoal">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-taupe/10">
                              {previewData.map((product, i) => (
                                <tr
                                  key={product.sku + i}
                                  className="hover:bg-taupe/5"
                                >
                                  <td className="px-4 py-2 text-taupe font-mono text-xs">
                                    {product.sku}
                                  </td>
                                  <td className="px-4 py-2 text-charcoal">
                                    {product.name}
                                  </td>
                                  <td className="px-4 py-2 text-right text-taupe">
                                    ${product.costPrice.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 text-right font-medium text-gold">
                                    ${product.sellingPrice.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {rawData.length > 10 && (
                          <div className="px-4 py-2 bg-taupe/5 text-center text-sm text-taupe">
                            Showing 10 of {rawData.length} products
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep("upload")}
                      >
                        â† Back
                      </Button>
                      <Button
                        onClick={categorizeProducts}
                        disabled={isProcessing}
                        size="lg"
                        className="flex-1"
                      >
                        {isProcessing
                          ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Categorizing...
                            </>
                          )
                          : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Auto-Categorize {rawData.length} Products
                            </>
                          )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Images Step */}
                {step === "images" && (
                  <div className="space-y-6">
                    {/* Category Summary */}
                    {summary && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(summary.categories).map((
                          [category, count],
                        ) => (
                          <div
                            key={category}
                            className="bg-taupe/5 rounded-lg p-4"
                          >
                            <p className="text-sm text-taupe">{category}</p>
                            <p className="text-2xl font-serif text-charcoal">
                              {count}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Queue Stats Dashboard */}
                    {queueStats.total > 0 && (
                      <div className="bg-gradient-to-r from-burgundy/5 to-gold/5 rounded-xl p-6 border border-burgundy/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-charcoal flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gold" />
                            Queue Status
                          </h3>
                          <div className="flex items-center gap-2">
                            {queueStatus.isPaused && (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-300"
                              >
                                <Pause className="w-3 h-3 mr-1" />
                                Paused
                              </Badge>
                            )}
                            {queueStatus.isProcessing &&
                              !queueStatus.isPaused && (
                              <Badge className="bg-green-100 text-green-700">
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Processing
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-taupe">
                              {queueStats.completed} of {queueStats.total}{" "}
                              completed
                            </span>
                            <span className="text-charcoal font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{formatTime(queueStats.estimatedTimeRemaining)}
                              {" "}
                              remaining
                            </span>
                          </div>
                          <Progress
                            value={(queueStats.completed / queueStats.total) *
                              100}
                            className="h-3"
                          />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-serif text-blue-600">
                              {queueStats.queued}
                            </p>
                            <p className="text-xs text-taupe">Queued</p>
                          </div>
                          <div>
                            <p className="text-2xl font-serif text-amber-600">
                              {queueStats.processing + queueStats.retrying}
                            </p>
                            <p className="text-xs text-taupe">Processing</p>
                          </div>
                          <div>
                            <p className="text-2xl font-serif text-green-600">
                              {queueStats.completed}
                            </p>
                            <p className="text-xs text-taupe">Completed</p>
                          </div>
                          <div>
                            <p className="text-2xl font-serif text-red-600">
                              {queueStats.failed}
                            </p>
                            <p className="text-xs text-taupe">Failed</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Queue Settings */}
                    {showSettings && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Queue Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-sm text-taupe mb-2 block">
                              Concurrent Requests: {queueConfig.batchSize}
                            </label>
                            <Slider
                              value={[queueConfig.batchSize]}
                              onValueChange={([value]) =>
                                updateConfig({ batchSize: value })}
                              min={1}
                              max={5}
                              step={1}
                              className="w-full"
                            />
                            <p className="text-xs text-taupe mt-1">
                              Higher = faster but more likely to hit rate limits
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-taupe mb-2 block">
                              Delay Between Requests:{" "}
                              {queueConfig.requestDelay / 1000}s
                            </label>
                            <Slider
                              value={[queueConfig.requestDelay]}
                              onValueChange={([value]) =>
                                updateConfig({ requestDelay: value })}
                              min={500}
                              max={5000}
                              step={500}
                              className="w-full"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      {!queueStatus.isProcessing
                        ? (
                          <Button
                            onClick={startImageGeneration}
                            size="lg"
                            className="flex-1"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Generating Images
                          </Button>
                        )
                        : (
                          <>
                            {queueStatus.isPaused
                              ? (
                                <Button
                                  onClick={resumeQueue}
                                  size="lg"
                                  className="flex-1"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Resume
                                </Button>
                              )
                              : (
                                <Button
                                  onClick={pauseQueue}
                                  variant="outline"
                                  size="lg"
                                  className="flex-1"
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </Button>
                              )}
                            <Button
                              onClick={stopQueue}
                              variant="destructive"
                              size="lg"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop
                            </Button>
                          </>
                        )}

                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>

                      {queueStats.failed > 0 && (
                        <Button variant="outline" onClick={retryFailedItems}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Retry Failed ({queueStats.failed})
                        </Button>
                      )}
                    </div>

                    {/* Product Preview Grid */}
                    <ScrollArea className="h-[400px] rounded-lg border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {products.slice(0, 40).map((product) => (
                          <div
                            key={product.sku}
                            className="bg-white rounded-lg p-3 border"
                          >
                            <div className="aspect-square bg-taupe/10 rounded-lg mb-2 overflow-hidden relative">
                              {product.imageUrl
                                ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                )
                                : (
                                  <div className="w-full h-full flex items-center justify-center text-taupe">
                                    <Image className="w-8 h-8" />
                                  </div>
                                )}
                              <div className="absolute top-2 right-2">
                                {getStatusIcon(product.status)}
                              </div>
                            </div>
                            <p className="text-xs font-medium text-charcoal truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <Button
                      variant="outline"
                      onClick={() => setStep("review")}
                      disabled={products.filter((p) => p.status === "completed")
                        .length === 0}
                    >
                      Continue to Review â†’
                    </Button>
                  </div>
                )}

                {/* Review Step */}
                {step === "review" && (
                  <div className="space-y-6">
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">
                          All ({products.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                          Ready ({products.filter((p) =>
                            p.status === "completed"
                          ).length})
                        </TabsTrigger>
                        <TabsTrigger value="failed">
                          Failed ({products.filter((p) => p.status === "failed")
                            .length})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="all">
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-2">
                            {products.map((product) => (
                              <div
                                key={product.sku}
                                className="flex items-center gap-4 p-4 bg-white rounded-lg border"
                              >
                                <div className="w-16 h-16 bg-taupe/10 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.imageUrl
                                    ? (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    )
                                    : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Image className="w-6 h-6 text-taupe" />
                                      </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-charcoal truncate">
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {product.brand}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {product.category}
                                    </Badge>
                                    <span className="text-sm text-gold font-medium">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  {getStatusIcon(product.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep("images")}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Failed Images
                      </Button>
                      <Button
                        onClick={() => setStep("shopify")}
                        className="flex-1"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue to Shopify Upload
                      </Button>
                    </div>
                  </div>
                )}

                {/* Shopify Upload Step */}
                {step === "shopify" && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Ready to upload{" "}
                        {products.filter((p) => p.status === "completed")
                          .length} products
                      </h3>
                      <p className="text-sm text-green-700">
                        Products will be created in your Shopify store with
                        generated images and categories
                      </p>
                    </div>

                    {/* Upload Progress */}
                    {isShopifyUploading && (
                      <Card className="border-burgundy/20">
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-burgundy" />
                              <span className="text-sm font-medium">
                                {shopifyProgress.stage}
                              </span>
                            </div>
                            <span className="text-sm text-taupe">
                              {shopifyProgress.current} /{" "}
                              {shopifyProgress.total}
                            </span>
                          </div>

                          <Progress
                            value={(shopifyProgress.current /
                              shopifyProgress.total) * 100}
                            className="h-2"
                          />

                          {shopifyProgress.currentProduct && (
                            <p className="text-xs text-taupe truncate">
                              Creating: {shopifyProgress.currentProduct}
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <p className="text-2xl font-serif text-green-600">
                                {shopifyProgress.succeeded}
                              </p>
                              <p className="text-xs text-green-700">
                                Succeeded
                              </p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <p className="text-2xl font-serif text-red-600">
                                {shopifyProgress.failed}
                              </p>
                              <p className="text-xs text-red-700">Failed</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Completion Summary */}
                    {!isShopifyUploading && shopifyProgress.total > 0 && (
                      <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-2">
                            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600" />
                            <h3 className="text-lg font-medium text-green-800">
                              Upload Complete!
                            </h3>
                            <p className="text-sm text-green-700">
                              {shopifyProgress.succeeded}{" "}
                              products created successfully
                              {shopifyProgress.failed > 0 &&
                                `, ${shopifyProgress.failed} failed`}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Error List */}
                    {shopifyErrors.length > 0 && (
                      <Card className="border-red-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Failed Products ({shopifyErrors.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-2">
                              {shopifyErrors.map((err, i) => (
                                <div
                                  key={i}
                                  className="text-sm p-2 bg-red-50 rounded"
                                >
                                  <p className="font-medium text-red-800">
                                    {err.name}
                                  </p>
                                  <p className="text-xs text-red-600">
                                    {err.error}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}

                    <Button
                      onClick={uploadToShopify}
                      disabled={isShopifyUploading}
                      size="lg"
                      className="w-full"
                    >
                      {isShopifyUploading
                        ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading to Shopify...
                          </>
                        )
                        : shopifyProgress.succeeded > 0
                        ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Upload
                          </>
                        )
                        : (
                          <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Upload All Products to Shopify
                          </>
                        )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
