import CartDrawer from "@/components/CartDrawer";
import Navbar from "@/components/Navbar";
import { useCart, type Product } from "@/contexts/CartContext";
import { ArrowLeft, Heart, Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import productsData from "../data/products.json";

const allProducts = productsData as Product[];

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-stone-200 text-stone-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-stone-500">
        {rating.toFixed(2)} {count ? `(${count} reviews)` : ""}
      </span>
    </div>
  );
}

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const product = allProducts.find((p) => p.handle === handle);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartDrawer />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl text-stone-600">Product not found</h1>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition-opacity"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.compare_at_price &&
    parseFloat(product.compare_at_price) > parseFloat(product.price);
  const discountPct = hasDiscount
    ? Math.round(
        (1 - parseFloat(product.price) / parseFloat(product.compare_at_price!)) * 100
      )
    : 0;

  const formatPrice = (p: string) =>
    `KSh ${parseFloat(p).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  // Related products (same category, excluding current)
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors"
          >
            All Products
          </button>
          <span>/</span>
          <span className="text-stone-700 truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* Product detail */}
      <div className="container pb-16">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-50">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";
                }}
              />
            </div>
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                SALE -{discountPct}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-primary uppercase tracking-widest">
              {product.category}
            </span>

            <h1 className="font-display text-3xl md:text-4xl font-medium text-stone-800 mt-2 leading-tight">
              {product.title}
            </h1>

            {product.averageRating && (
              <div className="mt-3">
                <StarRating rating={product.averageRating} count={product.totalReviews} />
              </div>
            )}

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold text-stone-800">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-stone-400 line-through">
                  {formatPrice(product.compare_at_price!)}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Taxes included. Shipping calculated at checkout.
            </p>

            {/* Description */}
            {product.description && (
              <div
                className="mt-5 text-sm text-stone-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="text-sm font-medium text-stone-700 block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-sm font-medium border border-stone-200 rounded py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-primary text-primary-foreground rounded font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded border flex items-center justify-center transition-colors ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-400"
                    : "border-stone-200 text-stone-400 hover:bg-stone-50"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-400" : ""}`} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-12 h-12 rounded border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="mt-3 w-full py-3.5 border-2 border-primary text-primary rounded font-medium text-sm hover:bg-primary/5 transition-colors"
            >
              Buy Now
            </button>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-stone-100 text-stone-500 rounded-full uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-medium text-stone-800 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="product-card bg-white rounded-lg overflow-hidden border border-stone-100 cursor-pointer group"
                  onClick={() => navigate(`/product/${p.handle}`)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-stone-50">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-display text-sm font-medium text-stone-800 line-clamp-2">
                      {p.title}
                    </p>
                    <p className="text-sm font-semibold text-stone-700 mt-1">
                      KSh {parseFloat(p.price).toLocaleString("en-KE")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 text-center text-xs">
        © {new Date().getFullYear()} Zia Africa. All rights reserved.
      </footer>
    </div>
  );
}
