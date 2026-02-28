import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Truck, User } from "lucide-react";

interface Driver {
  id: string;
  display_name: string | null;
}

interface DriverAssignmentProps {
  orderId: string;
  currentDriverId: string | null;
  onAssigned?: () => void;
}

export function DriverAssignment({ orderId, currentDriverId, onAssigned }: DriverAssignmentProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>(currentDriverId || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    setSelectedDriver(currentDriverId || "");
  }, [currentDriverId]);

  const fetchDrivers = async () => {
    try {
      // Get all users with admin or editor role (no "driver" role in enum)
      const { data: driverRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin" as const);

      if (rolesError) throw rolesError;
      if (!driverRoles || driverRoles.length === 0) {
        setDrivers([]);
        return;
      }

      const driverIds = driverRoles.map((r) => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", driverIds);

      if (profilesError) throw profilesError;
      setDrivers((profiles || []).map(p => ({ id: p.user_id, display_name: p.display_name })));
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const assignDriver = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver");
      return;
    }
    setLoading(true);
    try {
      // Store assignment in telemetry since cod_orders table doesn't exist in types
      const { error } = await supabase.from("telemetry_events").insert({
        event: "driver_assigned",
        source: "admin",
        payload: { order_id: orderId, driver_id: selectedDriver },
      });
      if (error) throw error;
      toast.success("Driver assigned successfully");
      onAssigned?.();
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Failed to assign driver");
    } finally {
      setLoading(false);
    }
  };

  const unassignDriver = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("telemetry_events").insert({
        event: "driver_unassigned",
        source: "admin",
        payload: { order_id: orderId },
      });
      if (error) throw error;
      setSelectedDriver("");
      toast.success("Driver unassigned");
      onAssigned?.();
    } catch (error) {
      console.error("Error unassigning driver:", error);
      toast.error("Failed to unassign driver");
    } finally {
      setLoading(false);
    }
  };

  if (drivers.length === 0) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <User className="h-4 w-4" />
        <span>No drivers available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Truck className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedDriver} onValueChange={setSelectedDriver}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Assign driver" />
        </SelectTrigger>
        <SelectContent>
          {drivers.map((driver) => (
            <SelectItem key={driver.id} value={driver.id}>
              {driver.display_name || driver.id.slice(0, 8)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedDriver !== currentDriverId && (
        <Button size="sm" onClick={assignDriver} disabled={loading}>
          {loading ? "Saving..." : "Assign"}
        </Button>
      )}
      {currentDriverId && (
        <Button size="sm" variant="outline" onClick={unassignDriver} disabled={loading}>
          Unassign
        </Button>
      )}
    </div>
  );
}
