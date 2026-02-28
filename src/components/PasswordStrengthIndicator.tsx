import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator(
  { password, className }: PasswordStrengthIndicatorProps,
) {
  const requirements = useMemo((): PasswordRequirement[] => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    {
      label: "One special character (!@#$%^&*)",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ], [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    if (metCount === 0) return { level: 0, label: "", color: "" };
    if (metCount <= 2) {
      return { level: 1, label: "Weak", color: "bg-destructive" };
    }
    if (metCount <= 3) {
      return { level: 2, label: "Fair", color: "bg-orange-500" };
    }
    if (metCount <= 4) {
      return { level: 3, label: "Good", color: "bg-yellow-500" };
    }
    return { level: 4, label: "Strong", color: "bg-green-500" };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Password strength
          </span>
          <span
            className={cn(
              "text-xs font-medium",
              strength.level === 1 && "text-destructive",
              strength.level === 2 && "text-orange-500",
              strength.level === 3 && "text-yellow-600",
              strength.level === 4 && "text-green-600",
            )}
          >
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                level <= strength.level ? strength.color : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {requirements.map((req, idx) => (
          <li
            key={idx}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-200",
              req.met ? "text-green-600" : "text-muted-foreground",
            )}
          >
            {req.met
              ? <Check className="h-3.5 w-3.5 flex-shrink-0" />
              : <X className="h-3.5 w-3.5 flex-shrink-0" />}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export validation function for use in form schemas
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}
