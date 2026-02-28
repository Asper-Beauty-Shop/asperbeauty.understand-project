import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuditActionType =
  | "view_orders_list"
  | "view_order_details"
  | "update_order_status"
  | "access_customer_phone"
  | "access_customer_location"
  | "initiate_navigation"
  | "initiate_call"
  | "initiate_whatsapp"
  | "mark_delivered";

interface LogAccessParams {
  orderId?: string;
  actionType: AuditActionType;
  accessedFields?: string[];
  metadata?: Record<string, unknown>;
}

interface AuditLogInsert {
  driver_id: string;
  order_id: string | null;
  action_type: string;
  accessed_fields: string[];
  metadata: Record<string, unknown>;
  user_agent: string;
}

export function useDriverAuditLog() {
  const logAccess = useCallback(async ({
    orderId,
    actionType,
    accessedFields = [],
    metadata = {},
  }: LogAccessParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.warn("Cannot log access: No authenticated user");
        return;
      }

      const logEntry: AuditLogInsert = {
        driver_id: user.id,
        order_id: orderId || null,
        action_type: actionType,
        accessed_fields: accessedFields,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
        user_agent: navigator.userAgent,
      };

      // Use rpc or raw insert - the table may not be in types yet
      const { error } = await supabase
        .from("driver_access_logs" as "cod_orders") // Type assertion workaround until types regenerate
        .insert(logEntry as never);

      if (error) {
        // Silent fail - don't interrupt user flow for audit logging
        console.error("Audit log error:", error);
      }
    } catch (err) {
      // Silent fail - audit logging should never break the app
      console.error("Audit log exception:", err);
    }
  }, []);

  const logOrdersListView = useCallback((orderCount: number) => {
    return logAccess({
      actionType: "view_orders_list",
      metadata: { order_count: orderCount },
    });
  }, [logAccess]);

  const logOrderDetailsView = useCallback(
    (orderId: string, orderNumber: string) => {
      return logAccess({
        orderId,
        actionType: "view_order_details",
        accessedFields: [
          "customer_name",
          "customer_phone",
          "delivery_address",
          "city",
          "items",
          "total",
          "notes",
        ],
        metadata: { order_number: orderNumber },
      });
    },
    [logAccess],
  );

  const logStatusUpdate = useCallback(
    (
      orderId: string,
      orderNumber: string,
      oldStatus: string,
      newStatus: string,
    ) => {
      return logAccess({
        orderId,
        actionType: newStatus === "delivered"
          ? "mark_delivered"
          : "update_order_status",
        accessedFields: ["status", "delivery_notes"],
        metadata: {
          order_number: orderNumber,
          old_status: oldStatus,
          new_status: newStatus,
        },
      });
    },
    [logAccess],
  );

  const logPhoneAccess = useCallback(
    (
      orderId: string,
      orderNumber: string,
      actionType: "initiate_call" | "initiate_whatsapp",
    ) => {
      return logAccess({
        orderId,
        actionType,
        accessedFields: ["customer_phone"],
        metadata: { order_number: orderNumber },
      });
    },
    [logAccess],
  );

  const logNavigationAccess = useCallback(
    (
      orderId: string,
      orderNumber: string,
      hasCoordinates: boolean,
      provider: "google_maps" | "waze",
    ) => {
      return logAccess({
        orderId,
        actionType: "initiate_navigation",
        accessedFields: hasCoordinates
          ? ["delivery_address", "city", "customer_lat", "customer_lng"]
          : ["delivery_address", "city"],
        metadata: {
          order_number: orderNumber,
          has_coordinates: hasCoordinates,
          navigation_provider: provider,
        },
      });
    },
    [logAccess],
  );

  return {
    logAccess,
    logOrdersListView,
    logOrderDetailsView,
    logStatusUpdate,
    logPhoneAccess,
    logNavigationAccess,
  };
}
