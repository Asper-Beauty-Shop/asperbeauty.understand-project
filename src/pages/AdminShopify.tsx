import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, ShoppingCart, Users, Webhook, RefreshCw, Trash2, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useShopifyAdmin,
  type ShopifyAdminProduct,
  type ShopifyAdminOrder,
  type ShopifyAdminCustomer,
  type ShopifyWebhook,
} from "@/hooks/useShopifyAdmin";

const WEBHOOK_FUNCTION_URL = `https://dsggmechzloaqevepktp.supabase.co/functions/v1/shopify-webhooks`;

const WEBHOOK_TOPICS = [
  "orders/create",
  "orders/updated",
  "orders/paid",
  "orders/fulfilled",
  "products/create",
  "products/update",
  "products/delete",
  "inventory_levels/update",
  "customers/create",
  "customers/update",
];

export default function AdminShopify() {
  const navigate = useNavigate();
  const { loading, listProducts, listOrders, listCustomers, listWebhooks, createWebhook, deleteWebhook } = useShopifyAdmin();

  const [products, setProducts] = useState<ShopifyAdminProduct[]>([]);
  const [orders, setOrders] = useState<ShopifyAdminOrder[]>([]);
  const [customers, setCustomers] = useState<ShopifyAdminCustomer[]>([]);
  const [webhooks, setWebhooks] = useState<ShopifyWebhook[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ id: string; topic: string; shopify_id: string; processed: boolean; created_at: string; error_message: string | null }>>([]);
  const [activeTab, setActiveTab] = useState("products");

  const refreshProducts = async () => {
    const data = await listProducts();
    if (data?.products) setProducts(data.products);
  };

  const refreshOrders = async () => {
    const data = await listOrders();
    if (data?.orders) setOrders(data.orders);
  };

  const refreshCustomers = async () => {
    const data = await listCustomers();
    if (data?.customers) setCustomers(data.customers);
  };

  const refreshWebhooks = async () => {
    const data = await listWebhooks();
    if (data?.webhooks) setWebhooks(data.webhooks);
  };

  const loadWebhookLogs = async () => {
    const { data } = await supabase
      .from("shopify_webhook_log")
      .select("id, topic, shopify_id, processed, created_at, error_message")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setWebhookLogs(data);
  };

  useEffect(() => {
    if (activeTab === "products") refreshProducts();
    else if (activeTab === "orders") refreshOrders();
    else if (activeTab === "customers") refreshCustomers();
    else if (activeTab === "webhooks") {
      refreshWebhooks();
      loadWebhookLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRegisterWebhook = async (topic: string) => {
    const result = await createWebhook(topic, WEBHOOK_FUNCTION_URL);
    if (result) {
      toast.success(`Webhook registered: ${topic}`);
      refreshWebhooks();
    }
  };

  const handleDeleteWebhook = async (id: number) => {
    const result = await deleteWebhook(id);
    if (result) {
      toast.success("Webhook removed");
      refreshWebhooks();
    }
  };

  const handleRegisterAll = async () => {
    const existingTopics = new Set(webhooks.map((w) => w.topic));
    const missing = WEBHOOK_TOPICS.filter((t) => !existingTopics.has(t));
    if (missing.length === 0) {
      toast.info("All webhooks already registered");
      return;
    }
    for (const topic of missing) {
      await createWebhook(topic, WEBHOOK_FUNCTION_URL);
    }
    toast.success(`Registered ${missing.length} webhooks`);
    refreshWebhooks();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Shopify Management</h1>
              <p className="text-sm text-muted-foreground">Products, orders, customers & webhooks</p>
            </div>
          </div>
          <a
            href="https://admin.shopify.com/store/asper-beauty-shop-7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Shopify Admin <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="products" className="flex items-center gap-1.5">
              <Package className="h-4 w-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Customers
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-1.5">
              <Webhook className="h-4 w-4" /> Webhooks
            </TabsTrigger>
          </TabsList>

          {/* ── Products ── */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Shopify Products ({products.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={refreshProducts} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 me-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.images[0] ? (
                            <img src={p.images[0].src} alt={p.title} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                        <TableCell>{p.vendor}</TableCell>
                        <TableCell>{p.variants[0]?.price || "—"} JOD</TableCell>
                        <TableCell>
                          {p.variants.reduce((s, v) => s + (v.inventory_quantity || 0), 0)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.status === "active" ? "default" : "secondary"}>
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Orders ── */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Shopify Orders ({orders.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={refreshOrders} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 me-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Fulfillment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.name}</TableCell>
                        <TableCell>
                          {o.customer
                            ? `${o.customer.first_name} ${o.customer.last_name}`
                            : o.email || "—"}
                        </TableCell>
                        <TableCell>{o.line_items.length} items</TableCell>
                        <TableCell>{o.total_price} {o.currency}</TableCell>
                        <TableCell>
                          <Badge
                            variant={o.financial_status === "paid" ? "default" : "secondary"}
                          >
                            {o.financial_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={o.fulfillment_status ? "default" : "outline"}>
                            {o.fulfillment_status || "unfulfilled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Customers ── */}
          <TabsContent value="customers">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Shopify Customers ({customers.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={refreshCustomers} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 me-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.first_name} {c.last_name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone || "—"}</TableCell>
                        <TableCell>{c.orders_count}</TableCell>
                        <TableCell>{c.total_spent} JOD</TableCell>
                        <TableCell>{c.addresses?.[0]?.city || "—"}</TableCell>
                      </TableRow>
                    ))}
                    {customers.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No customers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Webhooks ── */}
          <TabsContent value="webhooks">
            <div className="space-y-6">
              {/* Registered Webhooks */}
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Registered Webhooks ({webhooks.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRegisterAll} disabled={loading}>
                      <Plus className="h-4 w-4 me-1.5" /> Register All
                    </Button>
                    <Button variant="outline" size="sm" onClick={refreshWebhooks} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 me-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhooks.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell>
                            <Badge variant="outline">{w.topic}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">
                            {w.address}
                          </TableCell>
                          <TableCell className="text-xs">
                            {new Date(w.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteWebhook(w.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {webhooks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                            No webhooks registered. Click "Register All" to set up.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Quick register individual topics */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {WEBHOOK_TOPICS.filter((t) => !webhooks.some((w) => w.topic === t)).map((topic) => (
                      <Button
                        key={topic}
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegisterWebhook(topic)}
                        disabled={loading}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 me-1" /> {topic}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Webhook Log */}
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Webhook Event Log</CardTitle>
                  <Button variant="outline" size="sm" onClick={loadWebhookLogs}>
                    <RefreshCw className="h-4 w-4 me-1.5" /> Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead>Shopify ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhookLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge variant="outline">{log.topic}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{log.shopify_id || "—"}</TableCell>
                          <TableCell>
                            {log.error_message ? (
                              <Badge variant="destructive">Error</Badge>
                            ) : log.processed ? (
                              <Badge variant="default">Processed</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {webhookLogs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                            No webhook events received yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
