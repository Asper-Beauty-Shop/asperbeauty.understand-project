"""
Example: Call Anthropic Messages API with the Master Implementation Plan as system context.

- System: Use the plan text (or a short instruction that references it), not a raw API response.
- API key: From environment (ANTHROPIC_API_KEY); never hardcode.
- User message: Your actual question or content (e.g. Chrono-Stratigraphy art description).
"""

import os
import anthropic

# Use env var; never commit api_key="..."
client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

# Option A: System prompt is a short instruction (plan stored elsewhere or in a variable)
SYSTEM_PROMPT = """You have access to the Asper Beauty Shop Master Implementation Plan.
When asked about catalog enrichment, webhooks, design, or migrations, answer according to that plan.
Do not invent steps; cite the plan's structure (scripts/catalog-enrichment, digital_tray_products, etc.)."""

# Option B: If you have the full plan as a string (e.g. from a file or the inner text of the JSON)
# SYSTEM_PROMPT = open("docs/MASTER_IMPLEMENTATION_PLAN.md").read()

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=20000,
    temperature=0,  # 1 is very random; use 0 for factual/implementation answers
    system=SYSTEM_PROMPT,
    messages=[
        {
            "role": "user",
            "content": "Your actual user message here. E.g. summarize the catalog enrichment pipeline steps.",
        }
    ],
)

# Print only the text from the first content block
for block in message.content:
    if hasattr(block, "text"):
        print(block.text)
    elif isinstance(block, dict) and block.get("type") == "text":
        print(block.get("text", ""))
