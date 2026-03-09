import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

interface ProductRow {
  id: string;
  handle: string;
  title: string;
  brand: string | null;
  gtin: string | null;
  mpn: string | null;
  condition: string | null;
  availability_status: string | null;
  product_highlights: string[] | null;
  clinical_badge: string | null;
  pharmacist_note: string | null;
}

type EditableFields = Pick<ProductRow, "gtin" | "mpn" | "condition" | "availability_status" | "product_highlights" | "clinical_badge" | "pharmacist_note">;

const CONDITIONS = ["new", "refurbished", "used"] as const;
const AVAILABILITY = ["in_stock", "out_of_stock", "preorder", "backorder"] as const;

export default function AdminEnrichment() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useAdminRole();
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<string, Partial<EditableFields>>>({});

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) navigate("/auth");
      else if (isAdmin === false) navigate("/");
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, handle, title, brand, gtin, mpn, condition, availability_status, product_highlights, clinical_badge, pharmacist_note")
        .order("title");
      if (error) throw error;
      return data as ProductRow[];
    },
    enabled: isAdmin === true,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, fields }: { id: string; fields: Partial<EditableFields> }) => {
      const { error } = await supabase
        .from("products")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      const copy = { ...edits };
      delete copy[id];
      setEdits(copy);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product-enrichment"] });
      toast.success("Product updated");
    },
    onError: (err: Error) => {
      toast.error("Update failed: " + err.message);
    },
  });

  const handleField = (id: string, field: keyof EditableFields, value: string | string[] | null) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const getValue = (product: ProductRow, field: keyof EditableFields) => {
    return edits[product.id]?.[field] ?? product[field];
  };

  const saveAll = () => {
    Object.entries(edits).forEach(([id, fields]) => {
      if (Object.keys(fields).length > 0) {
        saveMutation.mutate({ id, fields });
      }
    });
  };

  if (authLoading || roleLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ShieldCheck className="h-5 w-5 text-accent" />
          <h1 className="font-heading text-xl font-semibold text-foreground">Product Enrichment Editor</h1>
        </div>
        <Button onClick={saveAll} disabled={!hasEdits || saveMutation.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? "Savingâ€¦" : `Save ${Object.keys(edits).length} changes`}
        </Button>
      </header>

      {/* Table */}
      <div className="overflow-x-auto px-4 py-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-3 px-2 font-medium w-48">Product</th>
              <th className="py-3 px-2 font-medium w-36">GTIN</th>
              <th className="py-3 px-2 font-medium w-32">MPN</th>
              <th className="py-3 px-2 font-medium w-28">Condition</th>
              <th className="py-3 px-2 font-medium w-28">Availability</th>
              <th className="py-3 px-2 font-medium w-36">Clinical Badge</th>
              <th className="py-3 px-2 font-medium min-w-[200px]">Highlights (comma-separated)</th>
              <th className="py-3 px-2 font-medium min-w-[200px]">Pharmacist Note</th>
              <th className="py-3 px-2 font-medium w-20">Save</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => {
              const dirty = !!edits[p.id] && Object.keys(edits[p.id]).length > 0;
              const highlights = getValue(p, "product_highlights") as string[] | null;

              return (
                <tr key={p.id} className={`border-b border-border transition-colors ${dirty ? "bg-accent/5" : "hover:bg-muted/40"}`}>
                  <td className="py-3 px-2">
                    <div className="font-medium text-foreground truncate max-w-[200px]">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.handle}</div>
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      value={(getValue(p, "gtin") as string) ?? ""}
                      onChange={(e) => handleField(p.id, "gtin", e.target.value || null)}
                      placeholder="0123456789012"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      value={(getValue(p, "mpn") as string) ?? ""}
                      onChange={(e) => handleField(p.id, "mpn", e.target.value || null)}
                      placeholder="ASP-XX-001"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Select
                      value={(getValue(p, "condition") as string) ?? "new"}
                      onValueChange={(v) => handleField(p.id, "condition", v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-2">
                    <Select
                      value={(getValue(p, "availability_status") as string) ?? "in_stock"}
                      onValueChange={(v) => handleField(p.id, "availability_status", v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABILITY.map((a) => (
                          <SelectItem key={a} value={a}>{a.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      value={(getValue(p, "clinical_badge") as string) ?? ""}
                      onChange={(e) => handleField(p.id, "clinical_badge", e.target.value || null)}
                      placeholder="Clinically Proven"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      value={highlights?.join(", ") ?? ""}
                      onChange={(e) => {
                        const arr = e.target.value
                          ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          : null;
                        handleField(p.id, "product_highlights", arr);
                      }}
                      placeholder="Fragrance Free, SPF 50+"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      value={(getValue(p, "pharmacist_note") as string) ?? ""}
                      onChange={(e) => handleField(p.id, "pharmacist_note", e.target.value || null)}
                      placeholder="Why this product is curatedâ€¦"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="py-3 px-2">
                    {dirty && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={saveMutation.isPending}
                        onClick={() => saveMutation.mutate({ id: p.id, fields: edits[p.id] })}
                      >
                        Save
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center text-muted-foreground py-12">
            No products found in the enrichment table.
          </div>
        )}
      </div>
    </div>
  );
}
