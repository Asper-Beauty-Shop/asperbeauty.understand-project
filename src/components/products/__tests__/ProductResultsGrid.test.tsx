import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductResultsGrid } from "../ProductResultsGrid";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ProductResultsGrid", () => {
  it("shows loading skeleton when isLoading is true", () => {
    const { container } = renderWithProviders(
      <ProductResultsGrid products={undefined} isLoading={true} error={null} />
    );
    // Skeleton renders pulse animations
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("shows error message when error is provided", () => {
    renderWithProviders(
      <ProductResultsGrid products={undefined} isLoading={false} error={new Error("fail")} />
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("shows Dr. Sami empty state when products array is empty", () => {
    renderWithProviders(
      <ProductResultsGrid products={[]} isLoading={false} error={null} searchQuery="xyzabc" />
    );
    expect(screen.getByTestId("empty-search-state")).toBeInTheDocument();
    expect(screen.getByText(/no matches for "xyzabc"/i)).toBeInTheDocument();
    expect(screen.getByText(/dr\. sami recommends/i)).toBeInTheDocument();
  });

  it("shows generic empty state without search query", () => {
    renderWithProviders(
      <ProductResultsGrid products={[]} isLoading={false} error={null} />
    );
    expect(screen.getByTestId("empty-search-state")).toBeInTheDocument();
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders Dr. Sami CTA button with correct test ID for analytics", () => {
    renderWithProviders(
      <ProductResultsGrid products={[]} isLoading={false} error={null} />
    );
    const drSamiCta = screen.getByTestId("dr-sami-cta");
    expect(drSamiCta).toBeInTheDocument();
    expect(drSamiCta).toHaveTextContent(/ask dr\. sami/i);
  });

  it("renders product cards when products are provided", () => {
    const mockProduct = {
      node: {
        id: "gid://shopify/Product/1",
        title: "Test Serum",
        handle: "test-serum",
        description: "",
        vendor: "TestBrand",
        productType: "Serum",
        images: { edges: [] },
        priceRange: {
          minVariantPrice: { amount: "25.00", currencyCode: "JOD" },
          maxVariantPrice: { amount: "25.00", currencyCode: "JOD" },
        },
        compareAtPriceRange: {
          minVariantPrice: { amount: "25.00", currencyCode: "JOD" },
          maxVariantPrice: { amount: "25.00", currencyCode: "JOD" },
        },
        variants: {
          edges: [{
            node: {
              id: "gid://shopify/ProductVariant/1",
              title: "Default",
              price: { amount: "25.00", currencyCode: "JOD" },
              compareAtPrice: null,
              availableForSale: true,
              selectedOptions: [],
            },
          }],
        },
        options: [],
        tags: [],
      },
    };

    renderWithProviders(
      <ProductResultsGrid products={[mockProduct as any]} isLoading={false} error={null} />
    );
    expect(screen.getByText("Test Serum")).toBeInTheDocument();
    expect(screen.getByText(/showing 1 products/i)).toBeInTheDocument();
  });
});
