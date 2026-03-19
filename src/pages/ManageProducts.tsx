import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BulkSaleManager } from "@/components/admin/BulkSaleManager";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { formatJOD } from "@/lib/productImageUtils";
import {
  Eraser,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { getProductImage } from "@/lib/productImageUtils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  title: string;
  price: number | null;
  handle: string;
  primary_concern: string;
  regimen_step: string;
  image_url: string | null;
  brand: string | null;
  pharmacist_note: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

const categories = ["Best Seller", "New Arrival", "Trending", "Featured"];

const ManageProducts = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [removingBgId, setRemovingBgId] = useState<string | null>(null);
  const [enrichResults, setEnrichResults] = useState<
    { id: string; title: string; status: string; image_url?: string }[] | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    handle: "",
    primary_concern: "Concern_Hydration",
    regimen_step: "Step_1_Cleanser",
    image_url: "",
  });

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roles) {
          toast.error("Access denied. Admin privileges required.");
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth");
      } finally {
        setAuthChecked(true);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    if (!isAdmin) return;

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts((data || []) as Product[]);
      } catch (err: unknown) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isAdmin]);

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      handle: "",
      primary_concern: "Concern_Hydration",
      regimen_step: "Step_1_Cleanser",
      image_url: "",
    });
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        price: (product.price ?? 0).toString(),
        handle: product.handle || "",
        primary_concern: product.primary_concern || "Concern_Hydration",
        regimen_step: product.regimen_step || "Step_1_Cleanser",
        image_url: product.image_url || "",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${
        Math.random().toString(36).substring(7)
      }.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error: unknown) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price) {
      toast.error("Title and price are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const productData = {
        name: formData.title.trim(),
        title: formData.title.trim(),
        brand: "Unknown",
        category: "Uncategorized",
        description: formData.title.trim(),
        price: parseFloat(formData.price),
        handle: formData.handle.trim() || formData.title.trim().toLowerCase().replace(/\s+/g, "-"),
        primary_concern: formData.primary_concern as Tables<"products">["primary_concern"],
        regimen_step: formData.regimen_step as Tables<"products">["regimen_step"],
        image_url: formData.image_url.trim() || null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData } : p
          )
        );
        toast.success("Product updated successfully");
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();

        if (error) throw error;

        setProducts((prev) => [data as Product, ...prev]);
        toast.success("Product created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error: unknown) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEnrichProducts = async () => {
    try {
      setIsEnriching(true);
      setEnrichResults(null);

      const { data, error } = await supabase.functions.invoke(
        "enrich-products",
      );

      if (error) throw error;

      setEnrichResults(data.results || []);

      const successCount = data.results?.filter((r: { success?: boolean; status?: string }) =>
        r.success || r.status === "success"
      ).length || 0;

      if (successCount > 0) {
        toast.success(`Enriched ${successCount} products with images`);
        // Refresh products list
        const { data: refreshedProducts } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (refreshedProducts) setProducts(refreshedProducts as Product[]);
      } else {
        toast.info("No new images found. Try adding source URLs to products.");
      }
    } catch (error: unknown) {
      console.error("Enrichment error:", error);
      toast.error("Failed to enrich products");
    } finally {
      setIsEnriching(false);
    }
  };

  const handleGenerateAIImages = async () => {
    try {
      setIsGeneratingAI(true);
      setEnrichResults(null);

      toast.info("Generating AI images for products without images...");

      const { data, error } = await supabase.functions.invoke(
        "generate-product-images",
        {
          body: { limit: 5 },
        },
      );

      if (error) throw error;

      setEnrichResults(data.results || []);

      const successCount = data.results?.filter((r: { success?: boolean; status?: string }) =>
        r.success || r.status === "success"
      ).length || 0;

      if (successCount > 0) {
        toast.success(`Generated ${successCount} AI product images`);
        // Refresh products list
        const { data: refreshedProducts } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (refreshedProducts) setProducts(refreshedProducts as Product[]);
      } else if (data.total === 0) {
        toast.info("All products already have images!");
      } else {
        toast.warning(
          "AI image generation had issues. Check console for details.",
        );
      }
    } catch (error: unknown) {
      console.error("AI Generation error:", error);
      toast.error("Failed to generate AI images");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleRemoveBackground = async (product: Product) => {
    if (!product.image_url) {
      toast.error("Product has no image to process");
      return;
    }

    try {
      setRemovingBgId(product.id);
      toast.info("Removing background with AI...", { duration: 5000 });

      const { data, error } = await supabase.functions.invoke(
        "remove-background",
        {
          body: {
            productId: product.id,
            imageUrl: product.image_url,
          },
        },
      );

      if (error) throw error;

      if (data.success) {
        toast.success("Background removed successfully!");
        // Refresh products list
        const { data: refreshedProducts } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (refreshedProducts) setProducts(refreshedProducts as Product[]);
      } else {
        throw new Error(data.error || "Background removal failed");
      }
    } catch (error: unknown) {
      console.error("Background removal error:", error);
      const msg = error instanceof Error ? error.message : String(error);
      if (msg?.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait and try again.");
      } else if (msg?.includes("credits")) {
        toast.error("AI credits exhausted. Please add credits.");
      } else {
        toast.error("Failed to remove background");
      }
    } finally {
      setRemovingBgId(null);
    }
  };

  if (!authChecked || (authChecked && !isAdmin)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="py-12 md:py-20">
        <div className="luxury-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-xs uppercase tracking-widest text-gold font-body">
                  Admin Panel
                </span>
              </div>
              <h1 className="luxury-heading text-3xl md:text-4xl font-semibold">
                {language === "ar" ? "إدارة المنتجات" : "Manage Products"}
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => setIsSaleDialogOpen(true)}
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Tag className="w-4 h-4 me-2" />
                Bulk Sale
              </Button>
              <Button
                onClick={handleGenerateAIImages}
                disabled={isGeneratingAI || isEnriching}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                {isGeneratingAI
                  ? <RefreshCw className="w-4 h-4 me-2 animate-spin" />
                  : <Sparkles className="w-4 h-4 me-2" />}
                {isGeneratingAI ? "Generating..." : "Generate AI Images"}
              </Button>

              <Button
                onClick={handleEnrichProducts}
                disabled={isEnriching || isGeneratingAI}
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                {isEnriching
                  ? <RefreshCw className="w-4 h-4 me-2 animate-spin" />
                  : <Wand2 className="w-4 h-4 me-2" />}
                {isEnriching ? "Enriching..." : "Auto-Enrich"}
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-burgundy hover:bg-burgundy-light text-white font-body uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4 me-2" />
                    Add Product
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct
                        ? "Update the product details below."
                        : "Fill in the details to add a new product."}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))}
                        placeholder="Product title"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (JOD) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))}
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="primary_concern">Concern</Label>
                        <Select
                          value={formData.primary_concern}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              primary_concern: value,
                            }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Concern_Acne","Concern_Hydration","Concern_Aging","Concern_Sensitivity","Concern_Pigmentation","Concern_Redness","Concern_Oiliness"].map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat.replace("Concern_", "")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="handle">Handle (URL slug)</Label>
                      <Input
                        id="handle"
                        value={formData.handle}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            handle: e.target.value,
                          }))}
                        placeholder="product-handle"
                      />
                    </div>

                    <div>
                      <Label>Product Image</Label>
                      <div className="mt-2 space-y-3">
                        {formData.image_url && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gold/20">
                            <img
                              src={formData.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="border-gold/30"
                          >
                            {uploadingImage
                              ? (
                                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                              )
                              : <Upload className="w-4 h-4 me-2" />}
                            Upload Image
                          </Button>

                          <span className="text-xs text-muted-foreground">
                            or leave empty for auto-placeholder
                          </span>
                        </div>

                        <Input
                          value={formData.image_url}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              image_url: e.target.value,
                            }))}
                          placeholder="Or paste image URL..."
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-burgundy hover:bg-burgundy-light text-white"
                      >
                        {isSubmitting && (
                          <Loader2 className="w-4 h-4 me-2 animate-spin" />
                        )}
                        {editingProduct ? "Update" : "Create"} Product
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Enrichment Results */}
          {enrichResults && enrichResults.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-xl border border-gold/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg">Enrichment Results</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEnrichResults(null)}
                  className="text-muted-foreground"
                >
                  Dismiss
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {enrichResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-2 text-sm p-2 rounded bg-cream/50"
                  >
                    <Badge
                      variant={result.status === "success"
                        ? "default"
                        : "secondary"}
                      className={result.status === "success"
                        ? "bg-green-500"
                        : ""}
                    >
                      {result.status === "success"
                        ? "✓"
                        : result.status === "fetch_failed"
                        ? "⚠"
                        : "✗"}
                    </Badge>
                    <span className="truncate text-xs">{result.title}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ✓ = Image found | ⚠ = Site blocked | ✗ = No image found
              </p>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-gold/20 shadow-gold-sm overflow-hidden">
            {isLoading
              ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                </div>
              )
              : products.length === 0
              ? (
                <div className="text-center py-20">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No products yet. Add your first product!
                  </p>
                </div>
              )
              : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-cream/50">
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="group">
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream">
                            <img
                              src={getProductImage(
                                product.image_url,
                                product.primary_concern as string,
                                product.title,
                              )}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {product.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {(product.pharmacist_note as string) || "No notes"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            {(product.primary_concern as string)?.replace("Concern_", "") || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-burgundy">
                          {formatJOD(Number(product.price))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {product.image_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveBackground(product)}
                                disabled={removingBgId === product.id}
                                className="text-muted-foreground hover:text-primary"
                                title="Remove Background"
                              >
                                {removingBgId === product.id
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Eraser className="w-4 h-4" />}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleOpenDialog(product)}
                              className="text-muted-foreground hover:text-burgundy"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(product.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageProducts;
