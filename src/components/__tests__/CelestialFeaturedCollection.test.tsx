import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CelestialFeaturedCollection from "../CelestialFeaturedCollection";

// ---- Mocks ----

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { rpc: vi.fn() },
}));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en" }),
}));

vi.mock("@/stores/cartStore", () => ({
  useCartStore: (selector: (s: any) => any) =>
    selector({
      addMultipleFromPrescription: vi.fn().mockResolvedValue(undefined),
      isLoading: false,
    }),
}));

vi.mock("@/lib/quizFunnelAnalytics", () => ({
  trackQuizFunnel: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}));

// ---- Fixture helpers ----

interface TrayProduct {
  id: string;
  handle: string;
  title: string;
  brand: string | null;
  price: number | null;
  image_url: string | null;
  step: string;
  is_hero: boolean;
  is_bestseller: boolean;
  inventory_total: number;
}

interface TrayResponse {
  concern: string;
  step_1: TrayProduct | null;
  step_2: TrayProduct | null;
  step_3: TrayProduct | null;
  generated_at: string;
}

let productCounter = 0;

function makeTrayProduct(overrides: Partial<TrayProduct> = {}): TrayProduct {
  productCounter += 1;
  return {
    id: `product-${productCounter}`,
    handle: `test-product-${productCounter}`,
    title: "Test Product",
    brand: "Test Brand",
    price: 19.99,
    image_url: "https://example.com/img.jpg",
    step: "Step_1_Cleanser",
    is_hero: false,
    is_bestseller: false,
    inventory_total: 10,
    ...overrides,
  };
}

function buildTrayResponse(
  concern: string,
  overrides: Partial<Pick<TrayResponse, "step_1" | "step_2" | "step_3">> = {},
): TrayResponse {
  return {
    concern,
    step_1:
      overrides.step_1 !== undefined
        ? overrides.step_1
        : makeTrayProduct({ step: "Step_1_Cleanser", title: `${concern} Cleanser` }),
    step_2:
      overrides.step_2 !== undefined
        ? overrides.step_2
        : makeTrayProduct({ step: "Step_2_Treatment", title: `${concern} Treatment` }),
    step_3:
      overrides.step_3 !== undefined
        ? overrides.step_3
        : makeTrayProduct({ step: "Step_3_Protection", title: `${concern} Moisturizer` }),
    generated_at: "2026-03-01T00:00:00Z",
  };
}

function renderComponent() {
  return render(
    <MemoryRouter>
      <CelestialFeaturedCollection />
    </MemoryRouter>,
  );
}

// ---- Setup ----

beforeEach(async () => {
  vi.clearAllMocks();
  productCounter = 0;
  const { supabase } = await import("@/integrations/supabase/client");
  vi.mocked(supabase.rpc).mockImplementation(
    (_fn: string, args: Record<string, string>) =>
      Promise.resolve({
        data: buildTrayResponse(args.concern_tag),
        error: null,
      }),
  );
});

// ---- Tests ----

describe("CelestialFeaturedCollection — Digital Tray", () => {
  describe("concern tabs", () => {
    it("renders all 6 concern tab buttons", async () => {
      renderComponent();

      for (const label of [
        "Hydration",
        "Acne",
        "Anti-Aging",
        "Sensitivity",
        "Pigmentation",
        "Brightening",
      ]) {
        expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
      }
    });

    it("highlights the active concern tab", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Step 1: Cleanser")).toBeInTheDocument();
      });

      const hydrationTab = screen.getByRole("button", { name: "Hydration" });
      expect(hydrationTab.className).toContain("bg-primary");

      const acneTab = screen.getByRole("button", { name: "Acne" });
      expect(acneTab.className).not.toContain("bg-primary");
    });
  });

  describe("complete 3-step routine rendering", () => {
    it("renders 3 product cards for Hydration (default) on mount", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Step 1: Cleanser")).toBeInTheDocument();
      });

      expect(screen.getByText("Step 2: Treatment")).toBeInTheDocument();
      expect(screen.getByText("Step 3: Moisturizer / SPF")).toBeInTheDocument();
      expect(screen.queryByText("Consult Pharmacist")).not.toBeInTheDocument();
      expect(screen.getByText(/Add Full Routine/)).toBeInTheDocument();
    });

    const CONCERN_TABS = [
      { tag: "Concern_Hydration", label: "Hydration" },
      { tag: "Concern_Acne", label: "Acne" },
      { tag: "Concern_AntiAging", label: "Anti-Aging" },
      { tag: "Concern_Sensitivity", label: "Sensitivity" },
      { tag: "Concern_Pigmentation", label: "Pigmentation" },
      { tag: "Concern_Brightening", label: "Brightening" },
    ];

    it.each(CONCERN_TABS)(
      "renders complete 3-step routine for $label",
      async ({ label }) => {
        renderComponent();

        // Wait for initial load
        await waitFor(() => {
          expect(screen.getByText("Step 1: Cleanser")).toBeInTheDocument();
        });

        // Click the concern tab
        fireEvent.click(screen.getByRole("button", { name: label }));

        // Wait for data to render
        await waitFor(() => {
          expect(screen.getByText("Step 1: Cleanser")).toBeInTheDocument();
        });

        expect(screen.getByText("Step 2: Treatment")).toBeInTheDocument();
        expect(screen.getByText("Step 3: Moisturizer / SPF")).toBeInTheDocument();
        expect(screen.queryByText("Consult Pharmacist")).not.toBeInTheDocument();
        expect(screen.getByText(/Add Full Routine/)).toBeInTheDocument();
      },
    );

    it("calls supabase.rpc with the correct concern_tag for each tab", async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      renderComponent();

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_tray_by_concern", {
          concern_tag: "Concern_Hydration",
        });
      });

      fireEvent.click(screen.getByRole("button", { name: "Acne" }));

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_tray_by_concern", {
          concern_tag: "Concern_Acne",
        });
      });
    });

    it("product cards link to /product/{handle}", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Step 1: Cleanser")).toBeInTheDocument();
      });

      const productLinks = screen.getAllByRole("link");
      expect(productLinks).toHaveLength(3);
      for (const link of productLinks) {
        expect(link).toHaveAttribute("href", expect.stringContaining("/product/"));
      }
    });
  });

  describe("regression: null steps render ConsultPharmacistCard", () => {
    it("shows ConsultPharmacistCard when step_2 is null", async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: buildTrayResponse("Concern_Hydration", { step_2: null }),
        error: null,
      } as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Consult Pharmacist")).toBeInTheDocument();
      });

      // The other two steps should still render as product cards
      expect(screen.getByText("Step 1: Cleanser")).toBeInTheDocument();
      expect(screen.getByText("Step 3: Moisturizer / SPF")).toBeInTheDocument();
    });

    it("shows ConsultPharmacistCard for all 3 steps when all are null", async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: buildTrayResponse("Concern_Hydration", {
          step_1: null,
          step_2: null,
          step_3: null,
        }),
        error: null,
      } as any);

      renderComponent();

      const consultTexts = await screen.findAllByText("Consult Pharmacist");
      expect(consultTexts).toHaveLength(3);
      expect(screen.queryByText(/Add Full Routine/)).not.toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("does not crash when supabase.rpc returns an error", async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: null,
        error: { message: "Network error" },
      } as any);

      renderComponent();

      // Section should still render without crashing
      await waitFor(() => {
        expect(screen.getByText("The Digital Tray")).toBeInTheDocument();
      });
    });
  });
});
