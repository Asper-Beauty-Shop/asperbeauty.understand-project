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
      const canvasContext = canvas.getContext("2d")!;

      // Background — Soft Ivory
      canvasContext.fillStyle = "#F5F0E8";
      canvasContext.fillRect(0, 0, 1080, 1920);

      // Subtle grain texture dots
      for (let i = 0; i < 3000; i++) {
        const grainX = Math.random() * 1080;
        const grainY = Math.random() * 1920;
        canvasContext.fillStyle = `rgba(128,0,32,${Math.random() * 0.03})`;
        canvasContext.fillRect(grainX, grainY, 1, 1);
      }

      // Top accent line
      const gradient = canvasContext.createLinearGradient(0, 0, 1080, 0);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "#C5A028");
      gradient.addColorStop(1, "transparent");
      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(0, 80, 1080, 3);

      // Header
      canvasContext.fillStyle = "#800020";
      canvasContext.font = "bold 64px 'Playfair Display', Georgia, serif";
      canvasContext.textAlign = "center";
      canvasContext.fillText("My Clinical Routine", 540, 180);

      canvasContext.fillStyle = "#C5A028";
      canvasContext.font = "24px 'Montserrat', sans-serif";
      canvasContext.fillText("via @AsperBeauty", 540, 230);

      // Product grid (2 columns)
      const gridColumns = 2;
      const cardWidth = 420;
      const cardHeight = 500;
      const gridStartX = (1080 - gridColumns * cardWidth - 40) / 2;
      const gridStartY = 320;

      const displayItems = items.slice(0, 4);

      for (let i = 0; i < displayItems.length; i++) {
        const item = displayItems[i];
        const gridColumn = i % gridColumns;
        const gridRow = Math.floor(i / gridColumns);
        const cardX = gridStartX + gridColumn * (cardWidth + 40);
        const cardY = gridStartY + gridRow * (cardHeight + 40);

        // Card background
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.shadowColor = "rgba(128,0,32,0.08)";
        canvasContext.shadowBlur = 20;
        canvasContext.shadowOffsetY = 4;
        drawRoundedRect(canvasContext, cardX, cardY, cardWidth, cardHeight, 16);
        canvasContext.fill();
        canvasContext.shadowColor = "transparent";

        // Gold border
        canvasContext.strokeStyle = "#C5A028";
        canvasContext.lineWidth = 1.5;
        drawRoundedRect(canvasContext, cardX, cardY, cardWidth, cardHeight, 16);
        canvasContext.stroke();

        // Load product image
        try {
          const imgUrl = item.product.node.images?.edges?.[0]?.node?.url;
          if (imgUrl) {
            const productImage = await loadImage(imgUrl);
            const imgSize = 280;
            const imgX = cardX + (cardWidth - imgSize) / 2;
            const imgY = cardY + 30;
            canvasContext.drawImage(productImage, imgX, imgY, imgSize, imgSize);
          }
        } catch {
          // Skip image on error
        }

        // Product title
        canvasContext.fillStyle = "#333333";
        canvasContext.font = "bold 28px 'Montserrat', sans-serif";
        canvasContext.textAlign = "center";
        const title = item.product.node.title;
        const truncated = title.length > 28 ? title.slice(0, 25) + "..." : title;
        canvasContext.fillText(truncated, cardX + cardWidth / 2, cardY + cardHeight - 80);

        // Price
        canvasContext.fillStyle = "#800020";
        canvasContext.font = "bold 32px 'Montserrat', sans-serif";
        canvasContext.fillText(`${normalizePrice(item.price.amount).toFixed(2)} ${item.price.currencyCode}`, cardX + cardWidth / 2, cardY + cardHeight - 35);
      }

      // "Dr. Sami Approved" stamp
      const stampY = gridStartY + Math.ceil(displayItems.length / gridColumns) * (cardHeight + 40) + 40;
      canvasContext.save();
      canvasContext.translate(540, stampY);

      // Gold circle stamp
      canvasContext.beginPath();
      canvasContext.arc(0, 0, 80, 0, Math.PI * 2);
      canvasContext.fillStyle = "#C5A028";
      canvasContext.fill();

      canvasContext.beginPath();
      canvasContext.arc(0, 0, 70, 0, Math.PI * 2);
      canvasContext.strokeStyle = "#F5F0E8";
      canvasContext.lineWidth = 3;
      canvasContext.stroke();

      canvasContext.fillStyle = "#FFFFFF";
      canvasContext.font = "bold 20px 'Montserrat', sans-serif";
      canvasContext.textAlign = "center";
      canvasContext.fillText("Dr. Sami", 0, -10);
      canvasContext.font = "16px 'Montserrat', sans-serif";
      canvasContext.fillText("Approved ✓", 0, 15);
      canvasContext.restore();

      // Footer
      canvasContext.fillStyle = "#800020";
      canvasContext.font = "28px 'Playfair Display', Georgia, serif";
      canvasContext.textAlign = "center";
      canvasContext.fillText("asperbeauty.com", 540, 1840);

      // Bottom accent line
      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(0, 1870, 1080, 3);

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
    } catch (error) {
      console.error("Share image generation failed:", error);
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
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "my-asper-routine.png";
  downloadLink.click();
  URL.revokeObjectURL(url);
  toast.success("Image downloaded! Share it on Instagram 📸");
}

function drawRoundedRect(canvasContext: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  canvasContext.beginPath();
  canvasContext.moveTo(x + r, y);
  canvasContext.lineTo(x + w - r, y);
  canvasContext.quadraticCurveTo(x + w, y, x + w, y + r);
  canvasContext.lineTo(x + w, y + h - r);
  canvasContext.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  canvasContext.lineTo(x + r, y + h);
  canvasContext.quadraticCurveTo(x, y + h, x, y + h - r);
  canvasContext.lineTo(x, y + r);
  canvasContext.quadraticCurveTo(x, y, x + r, y);
  canvasContext.closePath();
}

