import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const [, navigate] = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl cart-slide-in"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sage-dark" />
            <h2 className="font-display text-xl font-semibold text-stone-800">
              Your Cart
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-800"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-stone-200" />
              <div>
                <p className="font-display text-xl text-stone-500">Your cart is empty</p>
                <p className="text-sm text-stone-400 mt-1">Add some beautiful pieces to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4">
                  {/* Product image */}
                  <div className="w-20 h-24 flex-shrink-0 rounded overflow-hidden bg-stone-50">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80";
                      }}
                    />
                  </div>

                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-sage uppercase tracking-wide">
                      {product.category}
                    </p>
                    <p className="font-display text-base font-medium text-stone-800 leading-tight mt-0.5 line-clamp-2">
                      {product.title}
                    </p>
                    <p className="text-sm font-semibold text-stone-700 mt-1">
                      {formatPrice(parseFloat(product.price))}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center text-stone-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="ml-auto p-1.5 text-stone-300 hover:text-red-400 transition-colors rounded"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-5 space-y-4 bg-stone-50/60">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">Subtotal</span>
              <span className="font-display text-xl font-semibold text-stone-800">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Taxes and shipping calculated at checkout
            </p>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="w-full py-2.5 border border-stone-200 text-stone-600 rounded font-medium text-sm hover:bg-stone-100 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
