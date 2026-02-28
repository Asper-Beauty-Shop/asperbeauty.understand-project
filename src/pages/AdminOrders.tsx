import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  RefreshCw,
  Search,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";
import { DriverAssignment } from "@/components/DriverAssignment";

interface OrderItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  price: string;
  currency: string;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  imageUrl: string | null;
}

interface CODOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  city: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  driver_id: string | null;
  assigned_at: string | null;
  delivered_at: string | null;
  delivery_notes: string | null;
}

const ORDER_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "preparing",
    label: "Preparing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function AdminOrders() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<CODOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CODOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("orders");

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    }

    if (!authLoading) {
      checkAdmin();
    }
  }, [user, authLoading]);

  // Fetch orders
  const fetchOrders = async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("cod_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Parse the items JSON for each order
      const parsedOrders = (data || []).map((order) => ({
        ...order,
        items: typeof order.items === "string"
          ? JSON.parse(order.items)
          : order.items,
      })) as CODOrder[];

      setOrders(parsedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();

      // Subscribe to realtime updates
      const channel = supabase
        .channel("cod_orders_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "cod_orders",
          },
          (payload) => {
            console.log("Order change received:", payload);
            if (payload.eventType === "INSERT") {
              const newOrder = {
                ...payload.new,
                items: typeof payload.new.items === "string"
                  ? JSON.parse(payload.new.items)
                  : payload.new.items,
              } as CODOrder;
              setOrders((prev) => [newOrder, ...prev]);
              toast.info(`New order received: ${newOrder.order_number}`);
            } else if (payload.eventType === "UPDATE") {
              const updatedOrder = {
                ...payload.new,
                items: typeof payload.new.items === "string"
                  ? JSON.parse(payload.new.items)
                  : payload.new.items,
              } as CODOrder;
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === updatedOrder.id ? updatedOrder : order
                )
              );
            } else if (payload.eventType === "DELETE") {
              setOrders((prev) =>
                prev.filter((order) => order.id !== payload.old.id)
              );
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchOrders stable, run when isAdmin changes
  }, [isAdmin]);

  // Filter orders by status, search, and date
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_phone.includes(query) ||
        (order.customer_email &&
          order.customer_email.toLowerCase().includes(query)) ||
        order.city.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const now = new Date();

      switch (dateFilter) {
        case "today":
          if (
            !isWithinInterval(orderDate, {
              start: startOfDay(now),
              end: endOfDay(now),
            })
          ) return false;
          break;
        case "week":
          if (
            !isWithinInterval(orderDate, {
              start: startOfDay(subDays(now, 7)),
              end: endOfDay(now),
            })
          ) return false;
          break;
        case "month":
          if (
            !isWithinInterval(orderDate, {
              start: startOfDay(subDays(now, 30)),
              end: endOfDay(now),
            })
          ) return false;
          break;
      }
    }

    return true;
  });

  // Export orders to CSV
  const exportToCSV = useCallback(() => {
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "City",
      "Address",
      "Items",
      "Subtotal",
      "Shipping",
      "Total",
      "Status",
      "Notes",
    ];

    const rows = filteredOrders.map((order) => [
      order.order_number,
      format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
      order.customer_name,
      order.customer_phone,
      order.customer_email || "",
      order.city,
      order.delivery_address.replace(/,/g, ";"),
      order.items.map((i) => `${i.productTitle} x${i.quantity}`).join("; "),
      order.subtotal.toFixed(2),
      order.shipping_cost.toFixed(2),
      order.total.toFixed(2),
      order.status,
      order.notes?.replace(/,/g, ";") || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast.success("Orders exported successfully");
  }, [filteredOrders]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      const { error } = await (supabase as any)
        .from("cod_orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(null);
    }
  };

  // HTML escape function to prevent XSS attacks
  const escapeHtml = (text: string | null | undefined): string => {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  // Print invoice
  const printInvoice = (order: CODOrder) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print invoices");
      return;
    }

    const statusLabel =
      ORDER_STATUSES.find((s) => s.value === order.status)?.label ||
      order.status;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${escapeHtml(order.order_number)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #8B0000; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { font-size: 24px; margin-bottom: 5px; }
          .invoice-title p { color: #666; font-size: 14px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-block { flex: 1; }
          .info-block h3 { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
          .info-block p { margin-bottom: 5px; font-size: 14px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #e8e8e8; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { text-align: left; padding: 12px; background: #f5f5f5; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; color: #666; }
          .items-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .items-table .item-name { font-weight: 500; }
          .items-table .item-variant { color: #666; font-size: 12px; }
          .items-table .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .totals-row.total { border-top: 2px solid #333; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          .notes { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 30px; }
          .notes h3 { font-size: 12px; color: #666; margin-bottom: 5px; text-transform: uppercase; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">ASPER Beauty</div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>${escapeHtml(order.order_number)}</p>
            <p>${format(new Date(order.created_at), "MMMM d, yyyy")}</p>
          </div>
        </div>

        <div class="info-section">
          <div class="info-block">
            <h3>Bill To</h3>
            <p><strong>${escapeHtml(order.customer_name)}</strong></p>
            <p>${escapeHtml(order.delivery_address)}</p>
            <p>${escapeHtml(order.city)}</p>
            <p>${escapeHtml(order.customer_phone)}</p>
            ${
      order.customer_email ? `<p>${escapeHtml(order.customer_email)}</p>` : ""
    }
          </div>
          <div class="info-block" style="text-align: right;">
            <h3>Order Status</h3>
            <span class="status-badge">${escapeHtml(statusLabel)}</span>
          </div>
        </div>

        ${
      order.notes
        ? `
        <div class="notes">
          <h3>Order Notes</h3>
          <p>${escapeHtml(order.notes)}</p>
        </div>
        `
        : ""
    }

        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
      order.items.map((item) => `
              <tr>
                <td>
                  <div class="item-name">${escapeHtml(item.productTitle)}</div>
                  ${
        item.variantTitle !== "Default Title"
          ? `<div class="item-variant">${
            item.selectedOptions.map((o) => escapeHtml(o.value)).join(" / ")
          }</div>`
          : ""
      }
                </td>
                <td class="text-right">${
        parseFloat(item.price).toFixed(2)
      } JOD</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${
        (parseFloat(item.price) * item.quantity).toFixed(2)
      } JOD</td>
              </tr>
            `).join("")
    }
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)} JOD</span>
          </div>
          <div class="totals-row">
            <span>Shipping</span>
            <span>${
      order.shipping_cost > 0 ? order.shipping_cost.toFixed(2) + " JOD" : "Free"
    }</span>
          </div>
          <div class="totals-row total">
            <span>Total</span>
            <span>${order.total.toFixed(2)} JOD</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with ASPER Beauty!</p>
          <p style="margin-top: 5px;">Payment Method: Cash on Delivery</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find((s) => s.value === status) ||
      ORDER_STATUSES[0];
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to access this page.
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                You do not have permission to access this page.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Order stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.total, 0),
    todayOrders: orders.filter((o) =>
      isWithinInterval(new Date(o.created_at), {
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
      })
    ).length,
    pendingValue: orders
      .filter((o) =>
        ["pending", "confirmed", "preparing", "shipped"].includes(o.status)
      )
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Order Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track Cash on Delivery orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={fetchOrders} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-700">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                  <p className="text-xs text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {stats.delivered}
                  </p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.totalRevenue.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue (JOD)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        {(searchQuery || statusFilter !== "all" || dateFilter !== "all") && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading
              ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )
              : filteredOrders.length === 0
              ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )
              : (
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.order_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {order.customer_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.customer_phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{order.city}</TableCell>
                          <TableCell>
                            {order.items.length}{" "}
                            item{order.items.length !== 1 ? "s" : ""}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.total.toFixed(2)} JOD
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                updateOrderStatus(order.id, value)}
                              disabled={isUpdating === order.id}
                            >
                              <SelectTrigger className="w-[130px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <DriverAssignment
                              orderId={order.id}
                              currentDriverId={order.driver_id}
                              onAssigned={fetchOrders}
                            />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => printInvoice(order)}
                                title="Print Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
          </CardContent>
        </Card>
      </main>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order {selectedOrder.order_number}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Customer Info */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`tel:${selectedOrder.customer_phone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                    {selectedOrder.customer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`mailto:${selectedOrder.customer_email}`}
                          className="text-primary hover:underline"
                        >
                          {selectedOrder.customer_email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-2 col-span-full">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span>
                        {selectedOrder.delivery_address}, {selectedOrder.city}
                      </span>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Notes: {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Driver Assignment */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Driver Assignment</h4>
                  <DriverAssignment
                    orderId={selectedOrder.id}
                    currentDriverId={selectedOrder.driver_id}
                    onAssigned={fetchOrders}
                  />
                  {selectedOrder.assigned_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Assigned on {format(
                        new Date(selectedOrder.assigned_at),
                        "MMM d, yyyy at h:mm a",
                      )}
                    </p>
                  )}
                  {selectedOrder.delivery_notes && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      Driver notes: {selectedOrder.delivery_notes}
                    </p>
                  )}
                </div>
                863: 864: {/* Order Items */}
                865:{" "}
                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productTitle}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.productTitle}
                          </p>
                          {item.variantTitle !== "Default Title" && (
                            <p className="text-xs text-muted-foreground">
                              {item.selectedOptions.map((o) => o.value).join(
                                " / ",
                              )}
                            </p>
                          )}
                          <p className="text-sm mt-1">
                            {item.currency} {parseFloat(item.price).toFixed(2)}
                            {" "}
                            × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(parseFloat(item.price) * item.quantity).toFixed(
                              2,
                            )} JOD
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{selectedOrder.subtotal.toFixed(2)} JOD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {selectedOrder.shipping_cost > 0
                        ? `${selectedOrder.shipping_cost.toFixed(2)} JOD`
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-burgundy">
                      {selectedOrder.total.toFixed(2)} JOD
                    </span>
                  </div>
                </div>

                {/* Order Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Order placed on {format(
                      new Date(selectedOrder.created_at),
                      "MMMM d, yyyy at h:mm a",
                    )}
                  </span>
                  <Button
                    onClick={() => printInvoice(selectedOrder)}
                    className="gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
