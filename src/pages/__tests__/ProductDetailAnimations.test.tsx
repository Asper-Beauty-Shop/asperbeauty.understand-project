import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

/**
 * Unit tests for Key Clinical Actives staggered animation on PDP.
 * Validates: variant config, stagger timing, once-only viewport, premium ease curve.
 */

// ── Polyfill IntersectionObserver for jsdom ──
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    constructor() {}
  } as any;
});

// Collect all motion.div props for assertion
const motionDivCalls: Array<Record<string, unknown>> = [];

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => false,
    motion: {
      ...actual.motion,
      div: React.forwardRef(function MockMotionDiv(props: any, ref: React.Ref<HTMLDivElement>) {
        motionDivCalls.push(props);
        const { variants, initial, whileInView, viewport, animate, exit, ...rest } = props;
        return <div ref={ref} {...rest} />;
      }),
    },
  };
});

const TEST_PRODUCT = {
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
};

// Build a chainable mock for supabase.from()
const mockFrom = () => {
  const chain: any = {};
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.neq = () => chain;
  chain.in = () => Promise.resolve({ data: [], error: null });
  chain.limit = () => Promise.resolve({ data: [], error: null });
  chain.maybeSingle = () => Promise.resolve({ data: TEST_PRODUCT, error: null });
  chain.single = () => Promise.resolve({ data: null, error: null });
  return chain;
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => mockFrom(),
    functions: { invoke: vi.fn() },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: () => ({ on: () => ({ subscribe: () => ({}) }), unsubscribe: vi.fn() }),
    rpc: () => Promise.resolve({ data: [], error: null }),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ handle: "test-product" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/assets/pdp-how-to-use.jpg", () => ({ default: "" }));
vi.mock("@/assets/pdp-ingredients.jpg", () => ({ default: "" }));
vi.mock("@/assets/pdp-regulatory.jpg", () => ({ default: "" }));

const renderPDP = async () => {
  const { LanguageProvider } = await import("@/contexts/LanguageContext");
  const { default: ProductDetail } = await import("@/pages/ProductDetail");
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <ProductDetail />
      </LanguageProvider>
    </BrowserRouter>,
  );
};

describe("ProductDetail — Key Clinical Actives Animation", () => {
  beforeEach(() => {
    motionDivCalls.length = 0;
  });

  it("renders all ingredient cards in the DOM", async () => {
    await renderPDP();
    await waitFor(() => {
      expect(screen.getByText("Niacinamide")).toBeInTheDocument();
      expect(screen.getByText("Hyaluronic Acid")).toBeInTheDocument();
      expect(screen.getByText("Retinol")).toBeInTheDocument();
    });
  });

  it("container uses staggerChildren=0.15, delayChildren=0.1, viewport.once=true", async () => {
    await renderPDP();
    await waitFor(() => expect(screen.getByText("Niacinamide")).toBeInTheDocument());

    const container = motionDivCalls.find(
      (c) => (c.variants as any)?.visible?.transition?.staggerChildren !== undefined,
    );
    expect(container).toBeDefined();

    const v = container!.variants as any;
    expect(v.visible.transition.staggerChildren).toBe(0.15);
    expect(v.visible.transition.delayChildren).toBe(0.1);
    expect(v.hidden.opacity).toBe(0);
    expect(container!.initial).toBe("hidden");
    expect(container!.whileInView).toBe("visible");
    expect((container!.viewport as any).once).toBe(true);
    expect((container!.viewport as any).margin).toBe("-100px");
  });

  it("each card has y:30, scale:0.98 hidden state and premium ease [0.25,0.1,0.25,1]", async () => {
    await renderPDP();
    await waitFor(() => expect(screen.getByText("Niacinamide")).toBeInTheDocument());

    const cards = motionDivCalls.filter((c) => (c.variants as any)?.hidden?.y !== undefined);
    expect(cards.length).toBe(3);

    for (const card of cards) {
      const v = card.variants as any;
      expect(v.hidden).toEqual({ opacity: 0, y: 30, scale: 0.98 });
      expect(v.visible.opacity).toBe(1);
      expect(v.visible.y).toBe(0);
      expect(v.visible.scale).toBe(1);
      expect(v.visible.transition.duration).toBe(0.6);
      expect(v.visible.transition.ease).toEqual([0.25, 0.1, 0.25, 1]);
    }
  });
});
