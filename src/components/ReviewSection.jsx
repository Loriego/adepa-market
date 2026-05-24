import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { Star, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function ReviewSection({ productId }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId)
    );

    const snapshot = await getDocs(q);

    const reviewList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReviews(reviewList);
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login to leave a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Write a review first");
      return;
    }

    await addDoc(collection(db, "reviews"), {
      productId,
      userEmail: user.email,
      rating: Number(rating),
      comment,
      createdAt: serverTimestamp(),
    });

    toast.success("Review added");
    setComment("");
    setRating(5);
    fetchReviews();
  };

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + Number(item.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-10">
          <div>
            <p className="text-orange-600 font-black">Customer Trust</p>
            <h2 className="text-4xl font-black mt-2">Reviews & Ratings</h2>
          </div>

          <div className="bg-black text-white rounded-3xl p-6 text-center">
            <p className="text-5xl font-black">{average}</p>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(average)
                      ? "fill-orange-500 text-orange-500"
                      : "text-gray-500"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {reviews.length} review(s)
            </p>
          </div>
        </div>

        <form onSubmit={submitReview} className="bg-slate-50 rounded-3xl p-6 mb-10">
          <h3 className="text-2xl font-black mb-5">Leave a Review</h3>

          <div className="flex gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  className={
                    star <= rating
                      ? "fill-orange-500 text-orange-500"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full border p-5 rounded-2xl h-32 outline-none"
          ></textarea>

          <button className="mt-5 bg-orange-600 text-white px-8 py-4 rounded-full font-black">
            Submit Review
          </button>

          {!user && (
            <p className="text-gray-500 mt-3">
              You must login before submitting a review.
            </p>
          )}
        </form>

        {reviews.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-8 text-center">
            <MessageCircle className="mx-auto text-orange-600 mb-3" />
            <p className="font-bold text-gray-500">
              No reviews yet. Be the first to review this product.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-3xl p-6">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-black">{review.userEmail}</p>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= review.rating
                              ? "fill-orange-500 text-orange-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-black">
                    {review.rating}/5
                  </span>
                </div>

                <p className="text-gray-600 mt-5 leading-7">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}