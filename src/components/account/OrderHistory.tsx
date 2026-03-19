import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Truck, CheckCircle2, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface CODOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  items: OrderItem[];
  delivery_address: string;
  city: string;
  created_at: string;
  delivered_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock; step: number }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock, step: 0 },
  confirmed: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Package, step: 1 },
  preparing: { label: "Preparing", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", icon: Package, step: 1 },
  out_for_delivery: { label: "Out for Delivery", color: "bg-accent/10 text-accent border-accent/20", icon: Truck, step: 2 },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2, step: 3 },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20", icon: Clock, step: -1 },
};

const TRACK_STEPS = ["Order Placed", "Confirmed", "Out for Delivery", "Delivered"];

function StatusTracker({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  if (config.step === -1) return null;

  return (
    <div className="flex items-center gap-1 mt-4">
      {TRACK_STEPS.map((label, i) => {
        const active = i <= config.step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div className={`h-2.5 w-2.5 rounded-full border transition-colors ${active ? "bg-accent border-accent" : "bg-muted border-border/60"}`} />
              <span className={`font-body text-[9px] mt-1.5 uppercase tracking-[0.1em] text-center leading-tight ${active ? "text-accent" : "text-muted-foreground/50"}`}>
                {label}
              </span>
            </div>
            {i < TRACK_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${i < config.step ? "bg-accent" : "bg-border/40"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: CODOrder }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-accent/15 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5 flex-shrink-0">
            <StatusIcon className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-sm text-foreground tracking-tight">
              #{order.order_number}
            </p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.1em] mt-0.5">
              {format(new Date(order.created_at), "MMM d, yyyy · h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge className={`${config.color} font-body text-[9px] uppercase tracking-[0.1em] border`}>
            {config.label}
          </Badge>
          <span className="font-heading text-sm text-foreground">{order.total.toFixed(2)} JOD</span>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-accent/10 px-4 md:px-5 pb-5 pt-4 space-y-4">
          {/* Status tracker */}
          <StatusTracker status={order.status} />

          {/* Items */}
          <div className="space-y-2 mt-4">
            <p className="font-body text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Items</p>
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-background/40 border border-border/30 rounded">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded object-cover mix-blend-multiply" />
                ) : (
                  <div className="h-10 w-10 rounded bg-secondary/50 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground truncate">{item.name}</p>
                  <p className="font-body text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-body text-sm text-foreground">{item.price.toFixed(2)} JOD</span>
              </div>
            ))}
          </div>

          {/* Address & totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Delivery Address</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                <p className="font-body text-xs text-foreground leading-relaxed">{order.delivery_address}, {order.city}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-body text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Summary</p>
              <div className="flex justify-between font-body text-xs text-muted-foreground">
                <span>Subtotal</span><span>{order.subtotal.toFixed(2)} JOD</span>
              </div>
              <div className="flex justify-between font-body text-xs text-muted-foreground">
                <span>Shipping</span><span>{order.shipping_cost.toFixed(2)} JOD</span>
              </div>
              <div className="flex justify-between font-body text-sm font-medium text-foreground pt-1 border-t border-border/30">
                <span>Total</span><span>{order.total.toFixed(2)} JOD</span>
              </div>
            </div>
          </div>

          {order.delivered_at && (
            <p className="font-body text-[10px] text-green-600 uppercase tracking-[0.1em]">
              Delivered on {format(new Date(order.delivered_at), "MMM d, yyyy · h:mm a")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<CODOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("cod_orders")
        .select("id, order_number, status, total, subtotal, shipping_cost, items, delivery_address, city, created_at, delivered_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) setOrders(data as unknown as CODOrder[]);
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="h-14 w-14 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5 mx-auto">
          <ShoppingBag className="h-6 w-6 text-accent/50" />
        </div>
        <p className="font-heading text-base text-foreground">No Orders Yet</p>
        <p className="font-body text-sm text-muted-foreground">Your order history will appear here after your first purchase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
