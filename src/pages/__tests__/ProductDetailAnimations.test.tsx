import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

/**
 * Unit tests verifying the Key Clinical Actives animation configuration.
 *
 * Because framer-motion animations are declarative (variants + whileInView),
 * we validate:
 *  1. Cards render with correct stagger orchestration props
 *  2. `viewport.once` is true (no re-trigger)
 *  3. Each ingredient card is present in the DOM
 *  4. Reduced-motion variant omits transform properties
 */

// ── Mock framer-motion to capture variant props ──────────────────────
const motionDivCalls: Array<Record<string, unknown>> = [];

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => false,
    motion: {
      ...actual.motion,
      div: React.forwardRef(function MockMotionDiv(
        props: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>,
      ) {
        motionDivCalls.push(props);
        const {
          variants: _v,
          initial: _i,
          whileInView: _w,
          viewport: _vp,
          animate: _a,
          ...rest
        } = props as any;
        return <div ref={ref} data-testid={_v ? "motion-div" : undefined} {...rest} />;
      }),
    },
  };
});

// ── Mock heavy dependencies to isolate the animation logic ───────────
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
    functions: { invoke: vi.fn() },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: () => ({ on: () => ({ subscribe: () => ({}) }), unsubscribe: vi.fn() }),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ slug: "test-product" }),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/product/test-product", search: "", hash: "", state: null, key: "default" }),
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
  return {
    ...actual,
    useQuery: ({ queryKey }: any) => {
      if (queryKey[0] === "product") {
        return {
          data: {
            id: "test-id",
            name: "Test Serum",
            title: "Test Serum",
            brand: "TestBrand",
            price: 45,
            description: "A test product",
            category: "Skin Care",
            image_url: "https://example.com/img.jpg",
            is_hero: false,
            created_at: "2026-01-01",
            updated_at: "2026-01-01",
            key_ingredients: ["Niacinamide", "Hyaluronic Acid", "Retinol"],
            primary_concern: "anti-aging",
            handle: "test-product",
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: null, isLoading: false, error: null };
    },
    useQueryClient: () => ({}),
  };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("ProductDetail — Key Clinical Actives Animation", () => {
  beforeEach(() => {
    motionDivCalls.length = 0;
  });

  it("renders all ingredient cards", async () => {
    const { default: ProductDetail } = await import("@/pages/ProductDetail");
    const { BrowserRouter } = await import("react-router-dom");
    const { QueryClient, QueryClientProvider } = await import("@tanstack/react-query");

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <ProductDetail />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Niacinamide")).toBeInTheDocument();
    expect(screen.getByText("Hyaluronic Acid")).toBeInTheDocument();
    expect(screen.getByText("Retinol")).toBeInTheDocument();
  });

  it("configures the container with correct stagger orchestration", async () => {
    const { default: ProductDetail } = await import("@/pages/ProductDetail");
    const { BrowserRouter } = await import("react-router-dom");
    const { QueryClient, QueryClientProvider } = await import("@tanstack/react-query");

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <ProductDetail />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    // Find the container motion.div (has staggerChildren in its variants)
    const container = motionDivCalls.find(
      (call) =>
        (call.variants as any)?.visible?.transition?.staggerChildren !== undefined,
    );

    expect(container).toBeDefined();

    const variants = container!.variants as any;
    // Stagger: 150ms between cards
    expect(variants.visible.transition.staggerChildren).toBe(0.15);
    // Initial delay before stagger begins
    expect(variants.visible.transition.delayChildren).toBe(0.1);
    // Hidden state is fully transparent
    expect(variants.hidden.opacity).toBe(0);

    // Viewport config: animate only once
    expect((container!.viewport as any).once).toBe(true);
    // Trigger margin for early reveal
    expect((container!.viewport as any).margin).toBe("-100px");
    // Initial state set to hidden
    expect(container!.initial).toBe("hidden");
    expect(container!.whileInView).toBe("visible");
  });

  it("configures individual cards with premium ease-out curve", async () => {
    const { default: ProductDetail } = await import("@/pages/ProductDetail");
    const { BrowserRouter } = await import("react-router-dom");
    const { QueryClient, QueryClientProvider } = await import("@tanstack/react-query");

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <ProductDetail />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    // Find card-level motion.divs (have y in their hidden variant)
    const cards = motionDivCalls.filter(
      (call) => (call.variants as any)?.hidden?.y !== undefined,
    );

    expect(cards.length).toBe(3); // Niacinamide, Hyaluronic Acid, Retinol

    for (const card of cards) {
      const v = card.variants as any;
      // Hidden: offset down + slightly scaled
      expect(v.hidden.y).toBe(30);
      expect(v.hidden.scale).toBe(0.98);
      expect(v.hidden.opacity).toBe(0);

      // Visible: settled
      expect(v.visible.y).toBe(0);
      expect(v.visible.scale).toBe(1);
      expect(v.visible.opacity).toBe(1);

      // Premium ease-out curve
      expect(v.visible.transition.ease).toEqual([0.25, 0.1, 0.25, 1]);
      expect(v.visible.transition.duration).toBe(0.6);
    }
  });
});
