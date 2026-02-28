import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  driver_id: string;
  order_id: string | null;
  action_type: string;
  accessed_fields: string[];
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  driver_email?: string;
  order_number?: string;
}

const ACTION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  view_orders_list: {
    label: "View Orders List",
    color: "bg-blue-100 text-blue-800",
  },
  view_order_details: {
    label: "View Order Details",
    color: "bg-indigo-100 text-indigo-800",
  },
  update_order_status: {
    label: "Update Status",
    color: "bg-yellow-100 text-yellow-800",
  },
  access_customer_phone: {
    label: "Access Phone",
    color: "bg-orange-100 text-orange-800",
  },
  access_customer_location: {
    label: "Access Location",
    color: "bg-red-100 text-red-800",
  },
  initiate_navigation: {
    label: "Start Navigation",
    color: "bg-green-100 text-green-800",
  },
  initiate_call: {
    label: "Initiate Call",
    color: "bg-purple-100 text-purple-800",
  },
  initiate_whatsapp: {
    label: "WhatsApp Message",
    color: "bg-emerald-100 text-emerald-800",
  },
  mark_delivered: {
    label: "Mark Delivered",
    color: "bg-teal-100 text-teal-800",
  },
};

export default function AdminAuditLogs() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState<{ id: string; email: string }[]>([]);
  const [driverFilter, setDriverFilter] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
      fetchDrivers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchLogs/fetchDrivers stable, run when isAdmin changes
  }, [isAdmin]);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin" as const);

      if (error) throw error;

      if (data && data.length > 0) {
        const userIds = data.map((d) => d.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, display_name")
          .in("user_id", userIds);

        if (profileError) throw profileError;

        setDrivers(
          profiles?.map((p) => ({ id: p.user_id, email: p.display_name || "Unknown" })) ||
            [],
        );
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Direct query with type assertion to avoid deep instantiation
      const result = await supabase
        .from("driver_access_logs" as never)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (result.error) throw result.error;

      let logsData = (result.data || []) as unknown as AuditLog[];

      // Apply client-side filtering
      if (startDate) {
        const startTime = new Date(startDate).getTime();
        logsData = logsData.filter((l) =>
          new Date(l.created_at).getTime() >= startTime
        );
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        logsData = logsData.filter((l) =>
          new Date(l.created_at).getTime() <= end.getTime()
        );
      }
      if (actionTypeFilter && actionTypeFilter !== "all") {
        logsData = logsData.filter((l) => l.action_type === actionTypeFilter);
      }
      if (driverFilter && driverFilter !== "all") {
        logsData = logsData.filter((l) => l.driver_id === driverFilter);
      }

      const enrichedLogs = await enrichLogs(logsData);
      setLogs(enrichedLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const enrichLogs = async (logs: AuditLog[]): Promise<AuditLog[]> => {
    const driverIds = [...new Set(logs.map((l) => l.driver_id))];
    const orderIds = [
      ...new Set(logs.filter((l) => l.order_id).map((l) => l.order_id!)),
    ];

    const [profilesResult, ordersResult] = await Promise.all([
      driverIds.length > 0
        ? supabase.from("profiles").select("id, email").in("id", driverIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase.from("cod_orders").select("id, order_number").in(
          "id",
          orderIds,
        )
        : Promise.resolve({ data: [] }),
    ]);

    const profileMap = new Map(
      (profilesResult.data || []).map((p) => [p.id, p.email]),
    );
    const orderMap = new Map(
      (ordersResult.data || []).map((o) => [o.id, o.order_number]),
    );

    return logs.map((log) => ({
      ...log,
      driver_email: profileMap.get(log.driver_id) || "Unknown",
      order_number: log.order_id ? orderMap.get(log.order_id) || "N/A" : "N/A",
    }));
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.driver_email?.toLowerCase().includes(query) ||
      log.order_number?.toLowerCase().includes(query) ||
      log.action_type.toLowerCase().includes(query)
    );
  });

  const getActionBadge = (actionType: string) => {
    const config = ACTION_TYPE_LABELS[actionType] ||
      { label: actionType, color: "bg-gray-100 text-gray-800" };
    return (
      <Badge className={`${config.color} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Driver Audit Logs</h1>
              <p className="text-muted-foreground">
                Track all driver activity and data access
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Action Type
                </label>
                <Select
                  value={actionTypeFilter}
                  onValueChange={setActionTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {Object.entries(ACTION_TYPE_LABELS).map((
                      [key, { label }],
                    ) => <SelectItem key={key} value={key}>{label}
                    </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Driver</label>
                <Select value={driverFilter} onValueChange={setDriverFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Drivers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drivers</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by driver email, order number, or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{filteredLogs.length}</div>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {new Set(filteredLogs.map((l) => l.driver_id)).size}
              </div>
              <p className="text-xs text-muted-foreground">Active Drivers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {filteredLogs.filter((l) => l.action_type === "mark_delivered")
                  .length}
              </div>
              <p className="text-xs text-muted-foreground">Deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {filteredLogs.filter((l) =>
                  ["initiate_call", "initiate_whatsapp"].includes(l.action_type)
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">Customer Contacts</p>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            {loading
              ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )
              : filteredLogs.length === 0
              ? (
                <div className="text-center py-12 text-muted-foreground">
                  No audit logs found for the selected filters
                </div>
              )
              : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Accessed Fields</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm">
                              {format(new Date(log.created_at), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(log.created_at), "h:mm:ss a")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {log.driver_email}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getActionBadge(log.action_type)}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {log.order_number}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {log.accessed_fields?.slice(0, 3).map((
                                field,
                                idx,
                              ) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {field}
                                </Badge>
                              ))}
                              {log.accessed_fields?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{log.accessed_fields.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground max-w-xs truncate">
                              {log.metadata &&
                                  Object.keys(log.metadata).length > 0
                                ? (
                                  <span
                                    title={JSON.stringify(
                                      log.metadata,
                                      null,
                                      2,
                                    )}
                                  >
                                    {Object.entries(log.metadata)
                                      .filter(([k]) => k !== "timestamp")
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(", ")}
                                  </span>
                                )
                                : (
                                  "-"
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
