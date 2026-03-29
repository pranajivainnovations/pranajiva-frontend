/**
 * Cart Store - Zustand store for Medusa cart management
 * 
 * Handles all cart operations: create, add items, update quantities,
 * remove items, apply discounts, and checkout initiation.
 */

import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { medusaClient, formatPrice } from "@/lib/medusa";

// Custom storage that suppresses console logging
const silentStorage = {
  getItem: (name: string) => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(name) : null;
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<any>) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(value));
      }
    } catch {
      // Silently fail
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    } catch {
      // Silently fail
    }
  },
};

// India-only operations - we only ship to India
const INDIA_COUNTRY_CODE = "in";

// Types from Medusa
interface LineItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  quantity: number;
  variant_id: string;
  variant: {
    id: string;
    title: string;
    product_id: string;
    product: {
      title: string;
      handle: string;
      metadata?: Record<string, unknown>;
    };
  };
  unit_price: number;
  subtotal: number;
  total: number;
}

interface Cart {
  id: string;
  items: LineItem[];
  region_id: string | null;
  region?: {
    id: string;
    name: string;
    currency_code: string;
    tax_rate: number;
  };
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  total: number;
  shipping_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    province?: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  };
  email?: string;
  customer_id?: string;
}

interface CartState {
  // State
  cart: Cart | null;
  cartId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  itemCount: number;
  formattedTotal: string;
  
  // Actions
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: (code: string) => Promise<void>;
  setShippingAddress: (address: Cart["shipping_address"]) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      cartId: null,
      isLoading: false,
      error: null,
      itemCount: 0,
      formattedTotal: "₹0",
      
      // Initialize or retrieve existing cart
      initializeCart: async () => {
        const { cartId } = get();
        set({ isLoading: true, error: null });
        
        try {
          if (cartId) {
            // Try to retrieve existing cart
            try {
              const { cart } = await medusaClient.carts.retrieve(cartId);
              
              // Ensure cart has India region set (we only operate in India)
              if (!cart.region_id) {
                const { regions } = await medusaClient.regions.list();
                const indiaRegion = regions.find(r => r.name?.toLowerCase().includes("india") || r.countries?.some(c => c.iso_2 === INDIA_COUNTRY_CODE));
                if (indiaRegion) {
                  const { cart: updatedCart } = await medusaClient.carts.update(cartId, {
                    region_id: indiaRegion.id,
                    country_code: INDIA_COUNTRY_CODE,
                  });
                  set({
                    cart: updatedCart as Cart,
                    itemCount: updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
                    formattedTotal: formatPrice(updatedCart.total, updatedCart.region?.currency_code || "inr"),
                    isLoading: false,
                  });
                  return;
                }
              }
              
              set({
                cart: cart as Cart,
                itemCount: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
                formattedTotal: formatPrice(cart.total, cart.region?.currency_code || "inr"),
                isLoading: false,
              });
              return;
            } catch {
              // Cart not found or expired, create new one
              console.log("Previous cart not found, creating new one");
            }
          }
          
          // Fetch regions to get the India region ID
          let regionId: string | undefined;
          try {
            const { regions } = await medusaClient.regions.list();
            // Find India region or use first available
            const indiaRegion = regions.find(r => r.name?.toLowerCase().includes("india") || r.countries?.some(c => c.iso_2 === "in"));
            regionId = indiaRegion?.id || regions[0]?.id;
          } catch {
            console.log("Could not fetch regions");
          }
          
          // Create new cart with region
          const { cart } = await medusaClient.carts.create({
            region_id: regionId,
            country_code: INDIA_COUNTRY_CODE,
          });
          set({
            cart: cart as Cart,
            cartId: cart.id,
            itemCount: 0,
            formattedTotal: "₹0",
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to initialize cart:", error);
          set({
            error: "Failed to initialize cart",
            isLoading: false,
          });
        }
      },
      
      // Add item to cart
      addItem: async (variantId: string, quantity: number = 1) => {
        const { cart, cartId, initializeCart } = get();
        set({ isLoading: true, error: null });
        
        try {
          // Ensure cart exists
          if (!cartId || !cart) {
            await initializeCart();
          }
          
          const currentCartId = get().cartId;
          if (!currentCartId) {
            throw new Error("No cart available");
          }
          
          const { cart: updatedCart } = await medusaClient.carts.lineItems.create(
            currentCartId,
            { variant_id: variantId, quantity }
          );
          
          set({
            cart: updatedCart as Cart,
            itemCount: updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
            formattedTotal: formatPrice(updatedCart.total, updatedCart.region?.currency_code || "inr"),
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to add item:", error);
          set({
            error: "Failed to add item to cart",
            isLoading: false,
          });
        }
      },
      
      // Update item quantity
      updateItemQuantity: async (lineItemId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;
        
        set({ isLoading: true, error: null });
        
        try {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            await get().removeItem(lineItemId);
            return;
          }
          
          const { cart: updatedCart } = await medusaClient.carts.lineItems.update(
            cartId,
            lineItemId,
            { quantity }
          );
          
          set({
            cart: updatedCart as Cart,
            itemCount: updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
            formattedTotal: formatPrice(updatedCart.total, updatedCart.region?.currency_code || "inr"),
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to update quantity:", error);
          set({
            error: "Failed to update quantity",
            isLoading: false,
          });
        }
      },
      
      // Remove item from cart
      removeItem: async (lineItemId: string) => {
        const { cartId } = get();
        if (!cartId) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { cart: updatedCart } = await medusaClient.carts.lineItems.delete(
            cartId,
            lineItemId
          );
          
          set({
            cart: updatedCart as Cart,
            itemCount: updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
            formattedTotal: formatPrice(updatedCart.total, updatedCart.region?.currency_code || "inr"),
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to remove item:", error);
          set({
            error: "Failed to remove item",
            isLoading: false,
          });
        }
      },
      
      // Apply discount code
      applyDiscount: async (code: string) => {
        const { cartId } = get();
        if (!cartId) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { cart: updatedCart } = await medusaClient.carts.update(cartId, {
            discounts: [{ code }],
          });
          
          set({
            cart: updatedCart as Cart,
            formattedTotal: formatPrice(updatedCart.total, updatedCart.region?.currency_code || "inr"),
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to apply discount:", error);
          set({
            error: "Invalid discount code",
            isLoading: false,
          });
        }
      },
      
      // Remove discount code
      removeDiscount: async (code: string) => {
        const { cartId } = get();
        if (!cartId) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { cart: updatedCart } = await medusaClient.carts.deleteDiscount(cartId, code);
          
          set({
            cart: updatedCart as Cart,
            formattedTotal: formatPrice(updatedCart.total, updatedCart.region?.currency_code || "inr"),
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to remove discount:", error);
          set({
            error: "Failed to remove discount",
            isLoading: false,
          });
        }
      },
      
      // Set shipping address
      setShippingAddress: async (address: Cart["shipping_address"]) => {
        const { cartId } = get();
        if (!cartId) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { cart: updatedCart } = await medusaClient.carts.update(cartId, {
            shipping_address: address,
          });
          
          set({
            cart: updatedCart as Cart,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to set address:", error);
          set({
            error: "Failed to set shipping address",
            isLoading: false,
          });
        }
      },
      
      // Set email for guest checkout
      setEmail: async (email: string) => {
        const { cartId } = get();
        if (!cartId) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { cart: updatedCart } = await medusaClient.carts.update(cartId, { email });
          
          set({
            cart: updatedCart as Cart,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to set email:", error);
          set({
            error: "Failed to set email",
            isLoading: false,
          });
        }
      },
      
      // Clear cart (after successful checkout)
      clearCart: () => {
        set({
          cart: null,
          cartId: null,
          itemCount: 0,
          formattedTotal: "₹0",
          error: null,
        });
      },
      
      // Refresh cart data from server
      refreshCart: async () => {
        const { cartId } = get();
        if (!cartId) return;
        
        try {
          const { cart } = await medusaClient.carts.retrieve(cartId);
          set({
            cart: cart as Cart,
            itemCount: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
            formattedTotal: formatPrice(cart.total, cart.region?.currency_code || "inr"),
          });
        } catch (error) {
          console.error("Failed to refresh cart:", error);
          // Cart might be expired, clear it
          get().clearCart();
        }
      },
    }),
    {
      name: "pranajiva-cart",
      storage: silentStorage,
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);

// Initialize cart on module load (client-side only)
if (typeof window !== "undefined") {
  // Delay initialization to ensure hydration is complete
  setTimeout(() => {
    useCartStore.getState().initializeCart();
  }, 100);
}
