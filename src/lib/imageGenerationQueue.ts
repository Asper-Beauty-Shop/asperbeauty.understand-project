import { supabase } from "@/integrations/supabase/client";

export interface QueueItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  imagePrompt: string;
  status: "queued" | "processing" | "completed" | "failed" | "retrying";
  retryCount: number;
  error?: string;
  imageUrl?: string;
  addedAt: number;
  processedAt?: number;
}

export interface QueueStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  retrying: number;
  estimatedTimeRemaining: number; // in seconds
  averageProcessingTime: number; // in seconds
}

export interface QueueConfig {
  batchSize: number; // Number of concurrent requests
  retryLimit: number; // Max retries per item
  retryDelay: number; // Delay between retries (ms)
  rateLimitDelay: number; // Delay after rate limit (ms)
  requestDelay: number; // Delay between requests (ms)
}

const DEFAULT_CONFIG: QueueConfig = {
  batchSize: 3, // Process 3 images concurrently
  retryLimit: 3,
  retryDelay: 5000, // 5 seconds
  rateLimitDelay: 60000, // 60 seconds
  requestDelay: 2000, // 2 seconds between requests
};

type QueueEventType =
  | "itemUpdate"
  | "statsUpdate"
  | "batchComplete"
  | "queueComplete"
  | "error"
  | "paused"
  | "resumed";
type QueueEventCallback = (data: unknown) => void;

class ImageGenerationQueue {
  private queue: Map<string, QueueItem> = new Map();
  private config: QueueConfig;
  private isProcessing: boolean = false;
  private isPaused: boolean = false;
  private processingTimes: number[] = [];
  private eventListeners: Map<QueueEventType, QueueEventCallback[]> = new Map();
  private abortController: AbortController | null = null;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Event handling
  on(event: QueueEventType, callback: QueueEventCallback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
    return () => this.off(event, callback);
  }

  off(event: QueueEventType, callback: QueueEventCallback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }
  }

  private emit(event: QueueEventType, data: unknown) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Queue management
  addItems(items: Omit<QueueItem, "status" | "retryCount" | "addedAt">[]) {
    items.forEach((item) => {
      const queueItem: QueueItem = {
        ...item,
        status: "queued",
        retryCount: 0,
        addedAt: Date.now(),
      };
      this.queue.set(item.id, queueItem);
    });
    this.emitStats();
  }

  getItem(id: string): QueueItem | undefined {
    return this.queue.get(id);
  }

  getAllItems(): QueueItem[] {
    return Array.from(this.queue.values());
  }

  getStats(): QueueStats {
    const items = this.getAllItems();
    const completed = items.filter((i) => i.status === "completed");

    const avgTime = this.processingTimes.length > 0
      ? this.processingTimes.reduce((a, b) => a + b, 0) /
        this.processingTimes.length
      : 3000; // Default estimate: 3 seconds

    const remaining =
      items.filter((i) => ["queued", "retrying"].includes(i.status)).length;
    const estimatedTime = Math.ceil(
      (remaining * avgTime) / this.config.batchSize / 1000,
    );

    return {
      total: items.length,
      queued: items.filter((i) => i.status === "queued").length,
      processing: items.filter((i) => i.status === "processing").length,
      completed: completed.length,
      failed: items.filter((i) => i.status === "failed").length,
      retrying: items.filter((i) => i.status === "retrying").length,
      estimatedTimeRemaining: estimatedTime,
      averageProcessingTime: avgTime / 1000,
    };
  }

  private emitStats() {
    this.emit("statsUpdate", this.getStats());
  }

  private updateItem(id: string, updates: Partial<QueueItem>) {
    const item = this.queue.get(id);
    if (item) {
      const updated = { ...item, ...updates };
      this.queue.set(id, updated);
      this.emit("itemUpdate", updated);
      this.emitStats();
    }
  }

  // Processing
  async start() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.isPaused = false;
    this.abortController = new AbortController();

    console.log("Queue started");

    while (this.isProcessing && !this.isPaused) {
      const pendingItems = this.getAllItems().filter(
        (i) => i.status === "queued" || i.status === "retrying",
      );

      if (pendingItems.length === 0) {
        this.emit("queueComplete", this.getStats());
        break;
      }

      // Process batch
      const batch = pendingItems.slice(0, this.config.batchSize);
      await this.processBatch(batch);

      // Delay between batches
      if (!this.isPaused && pendingItems.length > this.config.batchSize) {
        await this.delay(this.config.requestDelay);
      }
    }

    this.isProcessing = false;
  }

  private async processBatch(batch: QueueItem[]) {
    console.log(`Processing batch of ${batch.length} items`);

    // Mark all as processing
    batch.forEach((item) => {
      this.updateItem(item.id, { status: "processing" });
    });

    // Process concurrently
    const results = await Promise.allSettled(
      batch.map((item) => this.processItem(item)),
    );

    // Handle results
    results.forEach((result, index) => {
      const item = batch[index];
      if (result.status === "fulfilled") {
        const { success, imageUrl, error, rateLimited } = result.value;

        if (success && imageUrl) {
          this.updateItem(item.id, {
            status: "completed",
            imageUrl,
            processedAt: Date.now(),
          });
        } else if (rateLimited) {
          // Rate limited - schedule retry
          this.handleRateLimit(item);
        } else if (item.retryCount < this.config.retryLimit) {
          // Retry
          this.updateItem(item.id, {
            status: "retrying",
            retryCount: item.retryCount + 1,
            error,
          });
        } else {
          // Failed after all retries
          this.updateItem(item.id, {
            status: "failed",
            error: error || "Max retries exceeded",
          });
        }
      } else {
        // Promise rejected
        if (item.retryCount < this.config.retryLimit) {
          this.updateItem(item.id, {
            status: "retrying",
            retryCount: item.retryCount + 1,
            error: result.reason?.message || "Unknown error",
          });
        } else {
          this.updateItem(item.id, {
            status: "failed",
            error: result.reason?.message || "Unknown error",
          });
        }
      }
    });

    this.emit("batchComplete", { batch, stats: this.getStats() });
  }

  private async processItem(item: QueueItem): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
    rateLimited?: boolean;
  }> {
    const startTime = Date.now();

    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return {
          success: false,
          error: "Not authenticated. Please log in as admin.",
        };
      }

      const { data, error } = await supabase.functions.invoke(
        "bulk-product-upload",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {
            action: "generate-image",
            productName: item.name,
            category: item.category,
            imagePrompt: item.imagePrompt,
          },
        },
      );

      const processingTime = Date.now() - startTime;
      this.processingTimes.push(processingTime);
      // Keep only last 20 times for average
      if (this.processingTimes.length > 20) {
        this.processingTimes.shift();
      }

      if (error) {
        console.error(`Error generating image for ${item.name}:`, error);
        const isRateLimited = error.message?.includes("429") ||
          error.message?.includes("rate");
        const isAuthError = error.message?.includes("401") ||
          error.message?.includes("403") ||
          error.message?.includes("Unauthorized") ||
          error.message?.includes("Forbidden");
        return {
          success: false,
          error: error.message,
          rateLimited: isRateLimited && !isAuthError,
        };
      }

      if (data?.imageUrl) {
        return { success: true, imageUrl: data.imageUrl };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      return { success: false, error: "No image URL returned" };
    } catch (err: unknown) {
      console.error(`Exception processing ${item.name}:`, err);
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimited = msg?.includes("429") || msg?.includes("rate");
      return { success: false, error: msg, rateLimited: isRateLimited };
    }
  }

  private async handleRateLimit(item: QueueItem) {
    console.log("Rate limited, pausing queue...");
    this.emit("error", { type: "rateLimit", item });

    // Mark item for retry
    this.updateItem(item.id, {
      status: "retrying",
      retryCount: item.retryCount + 1,
      error: "Rate limited - will retry",
    });

    // Pause and wait
    this.isPaused = true;
    this.emit("paused", { reason: "rateLimit" });

    await this.delay(this.config.rateLimitDelay);

    // Resume automatically
    if (this.isProcessing) {
      this.isPaused = false;
      this.emit("resumed", {});
    }
  }

  pause() {
    this.isPaused = true;
    this.emit("paused", { reason: "manual" });
  }

  resume() {
    if (!this.isProcessing) {
      this.start();
    } else {
      this.isPaused = false;
      this.emit("resumed", {});
    }
  }

  stop() {
    this.isProcessing = false;
    this.isPaused = false;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  clear() {
    this.stop();
    this.queue.clear();
    this.processingTimes = [];
    this.emitStats();
  }

  retryFailed() {
    this.getAllItems()
      .filter((i) => i.status === "failed")
      .forEach((item) => {
        this.updateItem(item.id, {
          status: "retrying",
          retryCount: 0,
          error: undefined,
        });
      });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Configuration
  updateConfig(config: Partial<QueueConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): QueueConfig {
    return { ...this.config };
  }

  getStatus(): { isProcessing: boolean; isPaused: boolean } {
    return { isProcessing: this.isProcessing, isPaused: this.isPaused };
  }
}

// Singleton instance
export const imageQueue = new ImageGenerationQueue();

// React hook for queue state
import { useCallback, useEffect, useState } from "react";

export function useImageQueue() {
  const [stats, setStats] = useState<QueueStats>(imageQueue.getStats());
  const [items, setItems] = useState<QueueItem[]>(imageQueue.getAllItems());
  const [status, setStatus] = useState(imageQueue.getStatus());

  useEffect(() => {
    const unsubStats = imageQueue.on("statsUpdate", (newStats: QueueStats) => {
      setStats(newStats);
      setStatus(imageQueue.getStatus());
    });

    const unsubItem = imageQueue.on("itemUpdate", () => {
      setItems([...imageQueue.getAllItems()]);
    });

    const unsubComplete = imageQueue.on("queueComplete", () => {
      setStatus(imageQueue.getStatus());
    });

    const unsubPaused = imageQueue.on("paused", () => {
      setStatus(imageQueue.getStatus());
    });

    const unsubResumed = imageQueue.on("resumed", () => {
      setStatus(imageQueue.getStatus());
    });

    return () => {
      unsubStats();
      unsubItem();
      unsubComplete();
      unsubPaused();
      unsubResumed();
    };
  }, []);

  const addItems = useCallback(
    (newItems: Omit<QueueItem, "status" | "retryCount" | "addedAt">[]) => {
      imageQueue.addItems(newItems);
      setItems([...imageQueue.getAllItems()]);
      setStats(imageQueue.getStats());
    },
    [],
  );

  const start = useCallback(() => {
    imageQueue.start();
    setStatus(imageQueue.getStatus());
  }, []);

  const pause = useCallback(() => {
    imageQueue.pause();
    setStatus(imageQueue.getStatus());
  }, []);

  const resume = useCallback(() => {
    imageQueue.resume();
    setStatus(imageQueue.getStatus());
  }, []);

  const stop = useCallback(() => {
    imageQueue.stop();
    setStatus(imageQueue.getStatus());
  }, []);

  const clear = useCallback(() => {
    imageQueue.clear();
    setItems([]);
    setStats(imageQueue.getStats());
    setStatus(imageQueue.getStatus());
  }, []);

  const retryFailed = useCallback(() => {
    imageQueue.retryFailed();
    setItems([...imageQueue.getAllItems()]);
    setStats(imageQueue.getStats());
  }, []);

  const updateConfig = useCallback((config: Partial<QueueConfig>) => {
    imageQueue.updateConfig(config);
  }, []);

  return {
    stats,
    items,
    status,
    config: imageQueue.getConfig(),
    addItems,
    start,
    pause,
    resume,
    stop,
    clear,
    retryFailed,
    updateConfig,
  };
}
