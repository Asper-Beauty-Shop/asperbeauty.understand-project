#!/usr/bin/env python3
"""
Asper Beauty Shop — PDF catalog analysis via Anthropic Files API (Beta).

Upload a supplier/brand PDF (e.g. Vichy, La Roche-Posay catalog, clinical paper)
once; Claude 3.7 Sonnet analyzes it and returns structured JSON suitable for
mapping into digital_tray_products (SKUs, ingredients, skin concerns, prices).

Use for: external brand catalogs, clinical research on ingredients, strategy docs.
Complements: scripts/catalog-enrichment (Shopify → Gemini → Supabase).
API key: ANTHROPIC_API_KEY in env; never commit.

Usage:
  python scripts/anthropic-pdf-catalog-analyze.py /path/to/document.pdf
  python scripts/anthropic-pdf-catalog-analyze.py /path/to/document.pdf --output extracted.json
"""

import argparse
import json
import os
import sys

import anthropic

# Approved skin concerns (match supabase/migrations/20260303000000_digital_tray_products.sql)
DTP_SKIN_CONCERNS = [
    "brightening", "sun_protection", "dark_circles", "anti_aging",
    "dryness", "acne", "sensitivity", "hyperpigmentation",
]
DTP_SKIN_TYPES = ["oily", "dry", "combination", "sensitive", "normal", "all"]

SYSTEM_PROMPT = """You are the Lead Clinical Data Architect for Asper Beauty Shop.
Extract information precisely and map it to our Medical Luxury standards.
Use only the approved skin concerns and skin types when classifying products.
Output valid JSON only; no markdown code fences or commentary outside the JSON."""

EXTRACTION_PROMPT = """Analyze this document. Extract all skincare/cosmetic products with:
- product_name, brand, sku (if present), price or price_range (if present)
- key_ingredients (array of ingredient names)
- skin_concerns: map each product to one or more from this exact list: """ + ", ".join(DTP_SKIN_CONCERNS) + """
- skin_types: one or more from: """ + ", ".join(DTP_SKIN_TYPES) + """
- short clinical_justification (1–2 sentences) where relevant

Return a single JSON object with key "products" (array of objects). Each object must have:
product_name, brand, key_ingredients (array), skin_concerns (array), skin_types (array),
and optionally sku, price, price_range, clinical_justification."""


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Upload a PDF to Anthropic and analyze with Claude (Files API)."
    )
    parser.add_argument(
        "file_path",
        nargs="?",
        default=os.environ.get("ASPER_PDF_PATH"),
        help="Path to PDF (or set ASPER_PDF_PATH)",
    )
    parser.add_argument(
        "--output", "-o",
        metavar="FILE",
        help="Write extraction JSON to FILE",
    )
    parser.add_argument(
        "--prompt",
        default=EXTRACTION_PROMPT,
        help="Override extraction prompt (default: ingredients + skin concerns → JSON)",
    )
    args = parser.parse_args()

    if not args.file_path or not os.path.isfile(args.file_path):
        print("Usage: python anthropic-pdf-catalog-analyze.py <path/to/document.pdf> [--output out.json]", file=sys.stderr)
        print("Or set ASPER_PDF_PATH and run without arguments.", file=sys.stderr)
        return 1

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Set ANTHROPIC_API_KEY in your environment.", file=sys.stderr)
        return 1

    client = anthropic.Anthropic(api_key=api_key)
    base_name = os.path.basename(args.file_path)

    # Step 1: Upload PDF (Files API Beta)
    print(f"Uploading {args.file_path}...")
    try:
        with open(args.file_path, "rb") as f:
            uploaded_file = client.beta.files.upload(
                file=(base_name, f, "application/pdf"),
            )
    except Exception as e:
        print(f"Upload failed: {e}", file=sys.stderr)
        return 1

    print(f"✅ File uploaded. File ID: {uploaded_file.id}")

    # Step 2: Ask Claude to analyze
    print("Analyzing document with Claude 3.7 Sonnet (Files API)...")
    try:
        message = client.beta.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=8192,
            betas=["files-api-2025-04-14"],
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
                                "type": "file",
                                "file_id": uploaded_file.id,
                            },
                        },
                        {"type": "text", "text": args.prompt},
                    ],
                }
            ],
        )
    except Exception as e:
        print(f"Analysis failed: {e}", file=sys.stderr)
        return 1

    text = ""
    for block in message.content:
        if hasattr(block, "text"):
            text = block.text
            break
        if isinstance(block, dict) and block.get("type") == "text":
            text = block.get("text", "")
            break

    print("\n🤖 Claude's response:")
    print(text)

    if args.output and text:
        # Try to parse and re-serialize JSON for clean output
        try:
            if "```" in text:
                for part in text.split("```"):
                    part = part.strip()
                    if part.startswith("json"):
                        part = part[4:].strip()
                    if part.startswith("{"):
                        data = json.loads(part)
                        with open(args.output, "w", encoding="utf-8") as out:
                            json.dump(data, out, indent=2, ensure_ascii=False)
                        print(f"\n✅ Wrote JSON to {args.output}")
                        break
            else:
                data = json.loads(text.strip())
                with open(args.output, "w", encoding="utf-8") as out:
                    json.dump(data, out, indent=2, ensure_ascii=False)
                print(f"\n✅ Wrote JSON to {args.output}")
        except json.JSONDecodeError:
            with open(args.output, "w", encoding="utf-8") as out:
                out.write(text)
            print(f"\n⚠ Wrote raw response to {args.output} (not valid JSON)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
