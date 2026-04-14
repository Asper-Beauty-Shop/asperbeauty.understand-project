import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RequireAdmin } from "@/components/RequireAdmin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, RotateCcw, Trash2, RefreshCw } from "lucide-react";

interface PurgedProduct {
  id: string;
  title: string;
  brand: string | null;
  price: number | null;
  handle: string | null;
  asper_category: string | null;
}

function PurgeReviewPanel() {
  const [items, setItems] = useState<PurgedProduct[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, title, brand, price, handle, asper_category")
      .eq("availability_status", "Pending_Purge")
      .order("title");

    if (error) {
      toast.error("Failed to fetch purged items");
      console.error(error);
    } else {
      setItems(data ?? []);
    }
    setSelected(new Set());
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const handleRestore = async () => {
    if (selected.size === 0) return;
    setProcessing(true);
    const { data, error } = await supabase.rpc("bulk_restore_purged", {
      p_ids: Array.from(selected),
    });
    if (error) {
      toast.error("Restore failed: " + error.message);
    } else {
      toast.success(`Restored ${data} product(s) → Requires_Manual_Review`);
      await fetchItems();
    }
    setProcessing(false);
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    const ok = window.confirm(
      `Permanently delete ${selected.size} product(s)? This cannot be undone.`
    );
    if (!ok) return;
    setProcessing(true);
    const { data, error } = await supabase.rpc("bulk_delete_purged", {
      p_ids: Array.from(selected),
    });
    if (error) {
      toast.error("Delete failed: " + error.message);
    } else {
      toast.success(`Permanently deleted ${data} product(s)`);
      await fetchItems();
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Purge Review
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "Loading…" : `${items.length} products flagged for purge`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {selected.size} selected
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRestore}
            disabled={selected.size === 0 || processing}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RotateCcw className="h-4 w-4 mr-1" />}
            Restore Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={selected.size === 0 || processing}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
            Permanently Delete
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items flagged for purge. All clear! ✨
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.size === items.length && items.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(item.id)}
                        onCheckedChange={() => toggleOne(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {item.title}
                    </TableCell>
                    <TableCell>{item.brand ?? "—"}</TableCell>
                    <TableCell className="text-xs">
                      {item.asper_category ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.price != null ? `${item.price} JOD` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PurgeReview() {
  return (
    <RequireAdmin>
      <PurgeReviewPanel />
    </RequireAdmin>
  );
}
