import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDriverAuditLog } from "@/hooks/useDriverAuditLog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  LogOut,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  image_url?: string;
  selectedOptions?: Record<string, string>;
}

interface DriverOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: string;
  notes: string | null;
  delivery_notes: string | null;
  customer_lat: number | null;
  customer_lng: number | null;
  created_at: string;
  assigned_at: string | null;
}

const statusConfig: Record<
  string,
  { label: string; labelAr: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    labelAr: "قيد الانتظار",
    color: "bg-yellow-500",
    icon: <Clock className="h-4 w-4" />,
  },
  confirmed: {
    label: "Confirmed",
    labelAr: "مؤكد",
    color: "bg-blue-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  processing: {
    label: "Processing",
    labelAr: "قيد التجهيز",
    color: "bg-purple-500",
    icon: <Package className="h-4 w-4" />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    labelAr: "في الطريق",
    color: "bg-orange-500",
    icon: <Truck className="h-4 w-4" />,
  },
  delivered: {
    label: "Delivered",
    labelAr: "تم التوصيل",
    color: "bg-green-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  cancelled: {
    label: "Cancelled",
    labelAr: "ملغي",
    color: "bg-red-500",
    icon: <Clock className="h-4 w-4" />,
  },
};

export default function DriverDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    logOrdersListView,
    logOrderDetailsView,
    logStatusUpdate,
    logPhoneAccess,
    logNavigationAccess,
  } = useDriverAuditLog();
  const [orders, setOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DriverOrder | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const hasLoggedListView = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel("driver-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cod_orders",
          filter: `driver_id=eq.${user.id}`,
        },
        () => {
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchOrders stable, run when user/navigate change
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("cod_orders")
        .select("*")
        .eq("driver_id", user.id)
        .order("assigned_at", { ascending: false });

      if (error) throw error;

      const typedOrders: DriverOrder[] = ((data || []).map((order) => ({
        ...order,
        items: Array.isArray(order.items)
          ? (order.items as unknown as OrderItem[])
          : JSON.parse(order.items as string) as OrderItem[],
      })) as unknown as DriverOrder[]);

      setOrders(typedOrders);

      // Log orders list view (only once per session to avoid spam)
      if (!hasLoggedListView.current && typedOrders.length > 0) {
        hasLoggedListView.current = true;
        logOrdersListView(typedOrders.length);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    const currentOrder = orders.find((o) => o.id === orderId);
    const oldStatus = currentOrder?.status || "unknown";

    try {
      const updateData: Record<string, unknown> = {
        status: newStatus,
        delivery_notes: deliveryNote || null,
      };

      if (newStatus === "delivered") {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("cod_orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;

      // Log status update for audit
      if (currentOrder) {
        logStatusUpdate(
          orderId,
          currentOrder.order_number,
          oldStatus,
          newStatus,
        );
      }

      toast.success(
        `Order marked as ${statusConfig[newStatus]?.label || newStatus}`,
      );
      setSelectedOrder(null);
      setDeliveryNote("");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const openNavigation = (order: DriverOrder) => {
    const address = encodeURIComponent(
      `${order.delivery_address}, ${order.city}, Jordan`,
    );
    const hasCoordinates = !!(order.customer_lat && order.customer_lng);

    // Log navigation access for audit
    logNavigationAccess(
      order.id,
      order.order_number,
      hasCoordinates,
      "google_maps",
    );

    // Check if coordinates are available
    if (hasCoordinates) {
      // Use coordinates for more accurate navigation
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${order.customer_lat},${order.customer_lng}`,
        "_blank",
      );
    } else {
      // Fall back to address-based navigation
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${address}`,
        "_blank",
      );
    }
  };

  const openWaze = (order: DriverOrder) => {
    const hasCoordinates = !!(order.customer_lat && order.customer_lng);

    // Log navigation access for audit
    logNavigationAccess(order.id, order.order_number, hasCoordinates, "waze");

    if (hasCoordinates) {
      window.open(
        `https://waze.com/ul?ll=${order.customer_lat},${order.customer_lng}&navigate=yes`,
        "_blank",
      );
    } else {
      const address = encodeURIComponent(
        `${order.delivery_address}, ${order.city}, Jordan`,
      );
      window.open(`https://waze.com/ul?q=${address}&navigate=yes`, "_blank");
    }
  };

  const callCustomer = (phone: string, order: DriverOrder) => {
    // Log phone access for audit
    logPhoneAccess(order.id, order.order_number, "initiate_call");
    window.open(`tel:${phone}`, "_self");
  };

  const whatsappCustomer = (phone: string, order: DriverOrder) => {
    // Log phone access for audit
    logPhoneAccess(order.id, order.order_number, "initiate_whatsapp");
    const message = encodeURIComponent(
      `مرحباً، أنا سائق التوصيل من Asper Beauty. طلبك رقم ${order.order_number} في الطريق إليك.`,
    );
    const formattedPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const handleOrderSelect = (order: DriverOrder) => {
    // Log order details view for audit
    logOrderDetailsView(order.id, order.order_number);
    setSelectedOrder(order);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const activeOrders = orders.filter((o) =>
    !["delivered", "cancelled"].includes(o.status)
  );
  const completedOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );
  const displayOrders = activeTab === "active" ? activeOrders : completedOrders;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary">
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Driver Dashboard</h1>
              <p className="text-sm opacity-80">Asper Beauty</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchOrders}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <Truck className="h-6 w-6 mx-auto text-orange-600 mb-1" />
            <p className="text-2xl font-bold text-orange-600">
              {activeOrders.length}
            </p>
            <p className="text-xs text-orange-700">Active Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto text-green-600 mb-1" />
            <p className="text-2xl font-bold text-green-600">
              {completedOrders.filter((o) => o.status === "delivered").length}
            </p>
            <p className="text-xs text-green-700">Delivered Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b mx-4">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === "active"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === "completed"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {displayOrders.length === 0
          ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {activeTab === "active"
                  ? "No active orders"
                  : "No completed orders"}
              </p>
            </div>
          )
          : (
            displayOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOrderSelect(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        statusConfig[order.status]?.color || "bg-gray-500"
                      } text-white`}
                    >
                      {statusConfig[order.status]?.icon}
                      <span className="ml-1">
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.customer_name}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        {order.delivery_address}, {order.city}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-bold text-primary">
                        {order.total.toFixed(2)} JOD
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedOrder.order_number}</span>
                  <Badge
                    className={`${
                      statusConfig[selectedOrder.status]?.color || "bg-gray-500"
                    } text-white`}
                  >
                    {statusConfig[selectedOrder.status]?.label ||
                      selectedOrder.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Customer Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" /> Customer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold">
                      {selectedOrder.customer_name}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          callCustomer(
                            selectedOrder.customer_phone,
                            selectedOrder,
                          )}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          whatsappCustomer(
                            selectedOrder.customer_phone,
                            selectedOrder,
                          )}
                        className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{selectedOrder.delivery_address}</p>
                    <p className="text-sm font-medium">{selectedOrder.city}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openNavigation(selectedOrder)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Navigation className="h-4 w-4 mr-1" /> Google Maps
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openWaze(selectedOrder)}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Navigation className="h-4 w-4 mr-1" /> Waze
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />{" "}
                      Items ({selectedOrder.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm py-1 border-b last:border-0"
                        >
                          <span>{item.title} × {item.quantity}</span>
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} JOD
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold pt-2 text-primary">
                        <span>Total (COD)</span>
                        <span>{selectedOrder.total.toFixed(2)} JOD</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedOrder.notes && (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium text-yellow-800">
                        Customer Note:
                      </p>
                      <p className="text-sm text-yellow-700">
                        {selectedOrder.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Delivery Notes Input */}
                {!["delivered", "cancelled"].includes(selectedOrder.status) && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Delivery Notes
                    </label>
                    <Textarea
                      placeholder="Add notes about the delivery..."
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!["delivered", "cancelled"].includes(selectedOrder.status) && (
                <DialogFooter className="flex-col gap-2 sm:flex-col">
                  {selectedOrder.status !== "out_for_delivery" && (
                    <Button
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "out_for_delivery")}
                      disabled={updating}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "delivered")}
                    disabled={updating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
