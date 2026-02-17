import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, Download, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { normalizePrice } from "@/lib/shopify";

/**
 * Generates a shareable "My Clinical Routine" image from cart items.
 * Uses Canvas API to create an Instagram-story-format (1080×1920) image.
 */
export function ShareRegimenButton() {
  const [generating, setGenerating] = useState(false);
  const items = useCartStore((s) => s.items);

  const generateImage = async () => {
    if (items.length === 0) {
      toast.info("Add products to your regimen first.");
      return;
    }

    setGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d")!;

      // Background — Soft Ivory
      ctx.fillStyle = "#F5F0E8";
      ctx.fillRect(0, 0, 1080, 1920);

      // Subtle grain texture dots
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 1080;
        const y = Math.random() * 1920;
        ctx.fillStyle = `rgba(128,0,32,${Math.random() * 0.03})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Top accent line
      const gradient = ctx.createLinearGradient(0, 0, 1080, 0);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "#C5A028");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 80, 1080, 3);

      // Header
      ctx.fillStyle = "#800020";
      ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("My Clinical Routine", 540, 180);

      ctx.fillStyle = "#C5A028";
      ctx.font = "24px 'Montserrat', sans-serif";
      ctx.fillText("via @AsperBeauty", 540, 230);

      // Product grid (2 columns)
      const cols = 2;
      const cardW = 420;
      const cardH = 500;
      const startX = (1080 - cols * cardW - 40) / 2;
      const startY = 320;

      const displayItems = items.slice(0, 4);

      for (let i = 0; i < displayItems.length; i++) {
        const item = displayItems[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + 40);
        const y = startY + row * (cardH + 40);

        // Card background
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(128,0,32,0.08)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;
        roundRect(ctx, x, y, cardW, cardH, 16);
        ctx.fill();
        ctx.shadowColor = "transparent";

        // Gold border
        ctx.strokeStyle = "#C5A028";
        ctx.lineWidth = 1.5;
        roundRect(ctx, x, y, cardW, cardH, 16);
        ctx.stroke();

        // Load product image
        try {
          const imgUrl = item.product.node.images?.edges?.[0]?.node?.url;
          if (imgUrl) {
            const img = await loadImage(imgUrl);
            const imgSize = 280;
            const imgX = x + (cardW - imgSize) / 2;
            const imgY = y + 30;
            ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          }
        } catch {
          // Skip image on error
        }

        // Product title
        ctx.fillStyle = "#333333";
        ctx.font = "bold 28px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        const title = item.product.node.title;
        const truncated = title.length > 28 ? title.slice(0, 25) + "..." : title;
        ctx.fillText(truncated, x + cardW / 2, y + cardH - 80);

        // Price
        ctx.fillStyle = "#800020";
        ctx.font = "bold 32px 'Montserrat', sans-serif";
        ctx.fillText(`${normalizePrice(item.price.amount).toFixed(2)} ${item.price.currencyCode}`, x + cardW / 2, y + cardH - 35);
      }

      // "Dr. Sami Approved" stamp
      const stampY = startY + Math.ceil(displayItems.length / cols) * (cardH + 40) + 40;
      ctx.save();
      ctx.translate(540, stampY);

      // Gold circle stamp
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.fillStyle = "#C5A028";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.strokeStyle = "#F5F0E8";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px 'Montserrat', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Dr. Sami", 0, -10);
      ctx.font = "16px 'Montserrat', sans-serif";
      ctx.fillText("Approved ✓", 0, 15);
      ctx.restore();

      // Footer
      ctx.fillStyle = "#800020";
      ctx.font = "28px 'Playfair Display', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("asperbeauty.com", 540, 1840);

      // Bottom accent line
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 1870, 1080, 3);

      // Convert to blob and share/download
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare?.({ files: [new File([blob], "routine.png")] })) {
          try {
            await navigator.share({
              title: "My Clinical Routine — Asper Beauty",
              files: [new File([blob], "my-asper-routine.png", { type: "image/png" })],
            });
            toast.success("Your regimen has been shared!");
          } catch {
            downloadBlob(blob);
          }
        } else {
          downloadBlob(blob);
        }
      }, "image/png");
    } catch (err) {
      console.error("Share image generation failed:", err);
      toast.error("Could not generate your routine image.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="group relative overflow-hidden border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground gap-2"
      onClick={generateImage}
      disabled={generating || items.length === 0}
    >
      {generating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs font-semibold">Share My Routine</span>
      </div>
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </Button>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-asper-routine.png";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Image downloaded! Share it on Instagram 📸");
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
