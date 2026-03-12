import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  Database,
  Search,
  Filter,
  Loader2,
  PackageCheck
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuarantineItem {
  id: string;
  raw_data: any;
  failure_reason: string;
  severity: string;
  created_at: string;
}

export default function QuarantineReview() {
  const [items, setItems] = useState<QuarantineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedProduct] = useState<QuarantineItem | null>(null);

  useEffect(() => {
    fetchQuarantine();
  }, []);

  const fetchQuarantine = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("quarantine")
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quarantine items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (item: QuarantineItem) => {
    try {
      // 1. Mark as resolved in quarantine table
      const { error } = await supabase
        .from("quarantine")
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq("id", item.id);
      
      if (error) throw error;

      setItems(prev => prev.filter(i => i.id !== item.id));
      toast.success("Item resolved and released");
    } catch (err) {
      toast.error("Failed to resolve item");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm("Are you sure you want to clear all quarantined items?")) return;
    try {
      const { error } = await supabase.from("quarantine").delete().eq("resolved", false);
      if (error) throw error;
      setItems([]);
      toast.success("Quarantine cleared");
    } catch (err) {
      toast.error("Failed to clear quarantine");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#800020]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FF]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-gray-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#800020]">Clinical Quarantine</h1>
            <p className="text-gray-500 mt-2 font-body">Review and resolve data ingestion conflicts.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchQuarantine} className="border-gray-200">
              Refresh
            </Button>
            <Button onClick={handleBulkDelete} variant="destructive" className="bg-red-900">
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* List of Conflicts */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Catalogue Clean</h3>
                <p className="text-gray-500">No products currently in quarantine.</p>
              </div>
            ) : (
              items.map(item => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className={cn(
                    "bg-white p-6 rounded-2xl border transition-all cursor-pointer group flex items-start gap-4 shadow-sm hover:shadow-md",
                    selectedItem?.id === item.id ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" : "border-gray-100"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 truncate pr-4">
                        {item.raw_data.title || "Unknown Product"}
                      </h4>
                      <Badge variant="secondary" className="text-[9px] bg-red-100 text-red-700 border-none uppercase">
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-red-600 font-medium mb-3">{item.failure_reason}</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        Row ID: {item.id.slice(0, 8)}
                      </span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] transition-all" />
                </div>
              ))
            )}
          </div>

          {/* Resolution Panel */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              {selectedItem ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Resolution Portal</h2>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Raw Input Data</Label>
                      <div className="mt-2 bg-gray-50 rounded-xl p-4 text-[11px] font-mono overflow-x-auto max-h-[300px] border border-gray-100">
                        <pre>{JSON.stringify(selectedItem.raw_data, null, 2)}</pre>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 space-y-3">
                      <Button 
                        onClick={() => handleResolve(selectedItem)}
                        className="w-full bg-[#800020] hover:bg-[#600018] rounded-xl py-6 font-bold uppercase tracking-widest text-xs shadow-lg"
                      >
                        <PackageCheck className="w-4 h-4 mr-2" />
                        Authorize Release
                      </Button>
                      <p className="text-[10px] text-center text-gray-400 italic">
                        Authorizing will mark this entry as manually verified.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Select an item to view diagnostic data and authorize release.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
