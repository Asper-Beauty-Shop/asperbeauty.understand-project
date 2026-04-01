# Asper Beauty Shop — Claude Code Project Intelligence

## Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Commerce:** Shopify Storefront API
- **AI:** Google Gemini via Supabase Edge Functions
- **Hosting:** Cloudflare Worker (`aws-shopify-cloude`)
- **Domain:** https://asperbeautyshop.com

## Service IDs & Connections
| Service | Value |
|---|---|
| Supabase Project | `vhgwvfedgfmcixhdyttt` |
| Supabase URL | `https://vhgwvfedgfmcixhdyttt.supabase.co` |
| Shopify Store | `asper-beauty-shop-6.myshopify.com` |
| Cloudflare Account | `1b07d13d6b4443176934e16389de03fa` |
| Cloudflare Worker | `aws-shopify-cloude` |
| GitHub Repo | `Asper-Beauty-Shop/asperbeauty.understand-project` |
| Production URL | `https://asperbeautyshop.com` |

## Dev Commands
```bash
npm run dev       # local dev on port 8080
npm run build     # build to dist/
npm run lint      # lint check
```

## Edge Functions (all ACTIVE)
| Function | Purpose |
|---|---|
| `beauty-assistant` | AI chat — Dr. Sami + Ms. Zain personas. Routes: `?route=gorgias`, `?route=manychat` |
| `sync-shopify-catalog` | Sync products from Shopify → Supabase |
| `asper-intelligence` | Advanced AI product intelligence |
| `concierge-tip` | Clinical ingredient tips (Dr. Sami) |
| `ai-product-search` | AI-powered product search |
| `telegram-bot` | Telegram command center from phone |
| `telegram-notify` | Push notifications to Telegram |
| `gemini-tts` | Voice interface proxy |
| `rapid-task` | Fast task execution |
| `sitemap` | Dynamic sitemap.xml |
| `send-email` | Transactional emails |
| `meta-bot` | Meta/Facebook bot integration |
| `meta-capi` | Meta Conversions API |
| `ingest-catalog` | Catalog ingestion |
| `shopify_mcp_proxy` | Shopify MCP proxy |
| `bright-handler` | Brightening concern handler |

## Channel Webhooks
| Channel | Webhook URL |
|---|---|
| **Gorgias** | `https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **ManyChat** (IG/FB/WA) | `https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant?route=manychat` |
| **Telegram Bot** | `https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/telegram-bot` |

## Telegram Commands (from phone)
- `/orders` — today's orders
- `/stats` — sales + traffic summary
- `/products` — top selling products
- `/sync` — trigger Shopify catalog sync
- `/broadcast <msg>` — send message to users

## Database
- 44 tables with RLS enabled
- 10,399+ products in `products` table
- Key columns: `asper_category`, `brand`, `is_bestseller`, `available`, `shopify_product_id`

## Coding Conventions
- Use `asper_category` (not `category`) for product categorization
- Filter products with `available = true`
- Order by `bestseller_rank` ASC NULLS LAST, then `created_at` DESC
- Colors: maroon (`#800020`), shiny-gold, soft-ivory
- Fonts: Playfair Display (headings), Montserrat (body), Tajawal (Arabic)
- Always support Arabic/English via `useLanguage()` context

## Security
- Never expose service role key client-side
- All tables have RLS enabled
- Use `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) on frontend
- Shopify Storefront token is public-safe
