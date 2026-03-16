import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequireAdmin } from "@/components/RequireAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Mail,
  CheckCircle2,
  XCircle,
  Ban,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TIME_PRESETS = [
  { label: "Last 24h", hours: 24 },
  { label: "Last 7 days", hours: 168 },
  { label: "Last 30 days", hours: 720 },
] as const;

const PAGE_SIZE = 50;

function statusBadge(status: string) {
  switch (status) {
    case "sent":
      return <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-200 hover:bg-emerald-600/15"><CheckCircle2 className="w-3 h-3 mr-1" />Sent</Badge>;
    case "failed":
    case "dlq":
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Failed</Badge>;
    case "suppressed":
      return <Badge className="bg-amber-500/15 text-amber-700 border-amber-200 hover:bg-amber-500/15"><Ban className="w-3 h-3 mr-1" />Suppressed</Badge>;
    case "rate_limited":
      return <Badge className="bg-orange-500/15 text-orange-700 border-orange-200 hover:bg-orange-500/15">Rate Limited</Badge>;
    case "pending":
      return <Badge variant="secondary" className="gap-1">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function EmailDashboardContent() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<number>(168);
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const since = useMemo(
    () => new Date(Date.now() - timeRange * 3600_000).toISOString(),
    [timeRange]
  );

  // Fetch all logs in range (deduplicated server-side isn't possible via JS client, so we deduplicate client-side)
  const { data: rawLogs, isLoading, refetch } = useQuery({
    queryKey: ["email-logs", since],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_send_log")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 30_000,
  });

  // Deduplicate: latest status per message_id
  const logs = useMemo(() => {
    if (!rawLogs) return [];
    const seen = new Map<string, (typeof rawLogs)[0]>();
    for (const row of rawLogs) {
      const key = row.message_id || row.id;
      if (!seen.has(key)) seen.set(key, row);
    }
    return Array.from(seen.values());
  }, [rawLogs]);

  // Template names for filter
  const templateNames = useMemo(() => {
    const names = new Set(logs.map((l) => l.template_name));
    return Array.from(names).sort();
  }, [logs]);

  // Filtered logs
  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (templateFilter !== "all" && l.template_name !== templateFilter) return false;
      if (statusFilter === "sent" && l.status !== "sent") return false;
      if (statusFilter === "failed" && l.status !== "failed" && l.status !== "dlq") return false;
      if (statusFilter === "suppressed" && l.status !== "suppressed") return false;
      return true;
    });
  }, [logs, templateFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const s = { total: filtered.length, sent: 0, failed: 0, suppressed: 0 };
    for (const l of filtered) {
      if (l.status === "sent") s.sent++;
      else if (l.status === "failed" || l.status === "dlq") s.failed++;
      else if (l.status === "suppressed") s.suppressed++;
    }
    return s;
  }, [filtered]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-primary">Email Dashboard</h1>
              <p className="text-xs text-muted-foreground">Monitor transactional & auth email delivery</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Time range */}
          <div className="flex gap-1 bg-muted p-1 rounded-md">
            {TIME_PRESETS.map((p) => (
              <Button
                key={p.hours}
                size="sm"
                variant={timeRange === p.hours ? "default" : "ghost"}
                className={timeRange === p.hours ? "text-xs" : "text-xs text-muted-foreground"}
                onClick={() => { setTimeRange(p.hours); setPage(0); }}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Template filter */}
          <Select value={templateFilter} onValueChange={(v) => { setTemplateFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[200px] h-9 text-sm">
              <SelectValue placeholder="All templates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All templates</SelectItem>
              {templateNames.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="suppressed">Suppressed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Mail className="w-5 h-5 text-primary" />} label="Total Emails" value={stats.total} loading={isLoading} />
          <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} label="Sent" value={stats.sent} loading={isLoading} />
          <StatCard icon={<XCircle className="w-5 h-5 text-destructive" />} label="Failed" value={stats.failed} loading={isLoading} />
          <StatCard icon={<Ban className="w-5 h-5 text-amber-600" />} label="Suppressed" value={stats.suppressed} loading={isLoading} />
        </div>

        {/* Table */}
        <div className="border border-border rounded-md bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Template</TableHead>
                <TableHead className="text-xs">Recipient</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Timestamp</TableHead>
                <TableHead className="text-xs">Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Loading…</TableCell>
                </TableRow>
              ) : pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No emails found for the selected filters.</TableCell>
                </TableRow>
              ) : (
                pageData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm font-medium">{row.template_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{row.recipient_email}</TableCell>
                    <TableCell>{statusBadge(row.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-destructive max-w-[250px] truncate">
                      {row.error_message || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages} · {filtered.length} emails
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, loading }: { icon: React.ReactNode; label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-card border border-border rounded-md p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">
          {loading ? "—" : value}
        </p>
      </div>
    </div>
  );
}

export default function AdminEmailDashboard() {
  return (
    <RequireAdmin>
      <EmailDashboardContent />
    </RequireAdmin>
  );
}
