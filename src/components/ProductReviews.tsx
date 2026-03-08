import { useEffect, useState } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  skin_type: string | null;
  primary_concern: string | null;
  age_range: string | null;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= rating ? "fill-polished-gold text-polished-gold" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .rpc("get_product_reviews", { p_product_id: productId });

      setReviews((data as Review[]) || []);
      setLoading(false);
    };
    fetchReviews();
  }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground font-body">
          {isArabic ? "كن أول من يقيّم هذا المنتج" : "Be the first to review this product"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Summary */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50">
        <div className="text-center">
          <p className="text-3xl font-display font-bold text-foreground">{avgRating}</p>
          <StarRating rating={Math.round(Number(avgRating))} />
        </div>
        <p className="text-sm text-muted-foreground font-body">
          {isArabic
            ? `بناءً على ${reviews.length} تقييم`
            : `Based on ${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Review cards */}
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-muted/20 rounded-lg border border-border/30 space-y-3">
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} />
            {review.verified_purchase && (
              <Badge variant="outline" className="text-[10px] tracking-wider border-polished-gold/50 text-polished-gold">
                {isArabic ? "شراء موثق" : "Verified Purchase"}
              </Badge>
            )}
          </div>

          {review.title && (
            <p className="font-display font-semibold text-sm text-foreground">{review.title}</p>
          )}
          {review.body && (
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{review.body}</p>
          )}

          {/* Contextual Social Proof — skin_type + concern */}
          {(review.skin_type || review.primary_concern || review.age_range) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {review.skin_type && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <User className="w-3 h-3" />
                  {review.skin_type}
                </Badge>
              )}
              {review.primary_concern && (
                <Badge variant="secondary" className="text-[10px]">
                  {review.primary_concern}
                </Badge>
              )}
              {review.age_range && (
                <Badge variant="secondary" className="text-[10px]">
                  {review.age_range}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
            {review.helpful_count > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {review.helpful_count} {isArabic ? "وجدوها مفيدة" : "found helpful"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
