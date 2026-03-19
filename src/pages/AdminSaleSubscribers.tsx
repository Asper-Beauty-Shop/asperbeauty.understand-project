import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequireAdmin } from "@/components/RequireAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/Header";
import { ArrowLeft, Download, Loader2, Mail, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

function SaleSubscribersContent() {
  const [search, setSearch] = useState("");

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["sale-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sale_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Array<{
        id: string;
        email: string;
        subscribed_at: string;
        is_active: boolean;
      }>;
    },
  });

  const filtered = search.trim()
    ? subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    : subscribers;

  const activeCount = subscribers.filter((s) => s.is_active).length;

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const header = "Email,Subscribed At,Active\n";
    const rows = filtered
      .map((s) => `${s.email},${s.subscribed_at},${s.is_active}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sale-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="luxury-container pt-28 pb-16">
        {/* Breadcrumb */}
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Products
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Sale Subscribers
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Users subscribed to receive sale notifications
            </p>
          </div>
          <Button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-border/50 bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-2xl font-display text-foreground mt-1">{subscribers.length}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p>
            <p className="text-2xl font-display text-accent mt-1">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Inactive</p>
            <p className="text-2xl font-display text-muted-foreground mt-1">
              {subscribers.length - activeCount}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="pl-9 bg-card border-border/50"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border/50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {search ? "No subscribers match your search" : "No subscribers yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-sm">{sub.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(sub.subscribed_at), "MMM d, yyyy 'at' h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={sub.is_active ? "default" : "secondary"}
                        className={
                          sub.is_active
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                            : "text-xs"
                        }
                      >
                        {sub.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Showing {filtered.length} of {subscribers.length} subscribers
        </p>
      </main>
    </div>
  );
}

export default function AdminSaleSubscribers() {
  return (
    <RequireAdmin>
      <SaleSubscribersContent />
    </RequireAdmin>
  );
}
