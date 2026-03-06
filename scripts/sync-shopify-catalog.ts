import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import "dotenv/config";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const CSV_PATH = process.env.CSV_PATH || path.join(process.cwd(), "Asper All form Productts", "Asper_Catalog_FINAL_READY - Copy.csv");

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env");
  process.exit(1);
}

const GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(JSON.stringify(result.errors));
  }
  return result.data;
}

const GET_PRODUCT_BY_HANDLE = `
  query getProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      variants(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

const CREATE_PRODUCT = `
  mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
    productCreate(input: $input, media: $media) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_PRODUCT = `
  mutation productUpdate($input: ProductUpdateInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_VARIANTS = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function sync() {
  console.log("Starting sync...");
  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV not found at:", CSV_PATH);
    process.exit(1);
  }
  const fileContent = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} records in CSV`);

  for (const record of records) {
    const handle = record.handle;
    if (!handle) continue;

    try {
      console.log(`Processing product: ${handle}`);
      
      const { productByHandle: existingProduct } = await shopifyFetch(GET_PRODUCT_BY_HANDLE, { handle });
      
      let productId;
      let variantId;

      const productInput = {
        title: record.title,
        descriptionHtml: record.descriptionHtml,
        vendor: record.vendor,
        productType: record.productType,
        handle: record.handle,
        tags: [record["tags/0"], record["tags/1"]].filter(Boolean),
      };

      if (existingProduct) {
        productId = existingProduct.id;
        variantId = existingProduct.variants.edges[0]?.node.id;
        console.log(`Updating product: ${handle} (${productId})`);
        await shopifyFetch(UPDATE_PRODUCT, { input: { id: productId, ...productInput } });
      } else {
        console.log(`Creating product: ${handle}`);
        
        const media = [];
        for (let i = 0; i < 5; i++) {
          const src = record[`images/${i}/src`];
          if (src) {
            media.push({ originalSource: src, mediaContentType: "IMAGE" });
          }
        }

        const createResult = await shopifyFetch(CREATE_PRODUCT, { input: productInput, media });
        if (createResult.productCreate.userErrors.length > 0) {
           console.error("Create error:", createResult.productCreate.userErrors);
           continue;
        }
        productId = createResult.productCreate.product.id;
        const { productByHandle: newProduct } = await shopifyFetch(GET_PRODUCT_BY_HANDLE, { handle });
        variantId = newProduct.variants.edges[0]?.node.id;
      }

      if (variantId) {
        const price = record["variants/0/price"];
        const sku = record["variants/0/sku"];
        if (price || sku) {
          await shopifyFetch(UPDATE_VARIANTS, {
            productId,
            variants: [{
              id: variantId,
              price: price ? price.toString() : undefined,
              sku: sku ? sku.toString() : undefined,
            }]
          });
        }
      }

      console.log(`Successfully synced: ${handle}`);
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`Error syncing product ${handle}:`, error);
    }
  }

  console.log("Sync finished!");
}

sync();