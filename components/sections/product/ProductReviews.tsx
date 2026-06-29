"use client";

import { useEffect, useState } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStore } from "@/store/reviewStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="p-0.5">
          <Star className={`h-5 w-5 ${n <= value ? "fill-brand text-brand" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { reviews, myReview, loading, submitting, fetchReviews, fetchMyReview, submitReview, updateReview, deleteReview } = useReviewStore();
  const { user } = useAuthStore();
  const { openSignIn } = useUIStore();

  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews(productId);
    if (user) fetchMyReview(productId);
  }, [productId, user]);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment ?? "");
    }
  }, [myReview]);

  const handleSubmit = () => {
    if (!user) return openSignIn();
    if (rating < 1) return;
    if (myReview) updateReview(myReview.id, { rating, comment });
    else submitReview(productId, { rating, comment });
    setEditing(false);
  };

  const guestGate = !user ? openSignIn : undefined;

  return (
    <section className="py-10 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>

      <div className="mb-8 p-5 rounded-xl border border-border bg-card">
        {user && myReview && !editing ? (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Your review</p>
              <div className="flex gap-2">
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => deleteReview(myReview.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex mt-2 gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < myReview.rating ? "fill-brand text-brand" : "text-muted-foreground"}`} />
              ))}
            </div>
            {myReview.comment && <p className="mt-2 text-sm text-muted-foreground">{myReview.comment}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">{myReview ? "Edit your review" : "Write a review"}</p>
            <StarPicker value={rating} onChange={(v) => (guestGate ? guestGate() : setRating(v))} />
            <Textarea
              value={comment}
              onFocus={guestGate}
              onChange={(e) => !guestGate && setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="bg-background"
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={user ? rating < 1 || submitting : false} onClick={handleSubmit} className="bg-brand hover:bg-brand-hover text-white">
                {!user ? "Sign in to Submit Review" : submitting ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
              </Button>
              {myReview && user && (
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="pb-5 border-b border-border last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-xs font-semibold text-brand">
                    {r.user.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-foreground">{r.user.name}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex mt-2 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-brand text-brand" : "text-muted-foreground"}`} />
                ))}
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}