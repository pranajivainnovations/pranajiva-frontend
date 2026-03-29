/**
 * Customer Store - Zustand store for Medusa customer management
 * 
 * Handles customer authentication, profile management, order history,
 * and wishlist functionality.
 */

import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { medusaClient, normalizeIndianPhone } from "@/lib/medusa";

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

interface Address {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  company?: string;
  metadata?: Record<string, unknown>;
}

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  has_account: boolean;
  billing_address?: Address;
  shipping_addresses?: Address[];
  metadata?: Record<string, unknown>;
  orders?: Order[];
  created_at: string | Date;
}

interface Order {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  total: number;
  created_at: string | Date;
  shipping_address?: Address;
}

interface WishlistItem {
  productId: string;
  variantId: string;
  addedAt: string;
}

interface CustomerSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  twoFactorAuth: boolean;
  biometricAuth: boolean;
}

interface CustomerState {
  // State
  customer: Customer | null;
  orders: Order[];
  wishlist: WishlistItem[];
  settings: CustomerSettings;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  
  // Profile Actions
  updateProfile: (data: Partial<Pick<Customer, "first_name" | "last_name" | "phone">>) => Promise<void>;
  addShippingAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateShippingAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteShippingAddress: (addressId: string) => Promise<void>;
  
  // Order Actions
  fetchOrders: () => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  
  // Wishlist Actions
  addToWishlist: (productId: string, variantId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  
  // Settings Actions
  updateSettings: (settings: Partial<CustomerSettings>) => Promise<void>;
  loadSettings: () => CustomerSettings;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      // Initial state
      customer: null,
      orders: [],
      wishlist: [],
      settings: {
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotionalEmails: false,
        twoFactorAuth: false,
        biometricAuth: false,
      },
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Login
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await medusaClient.auth.authenticate({ email, password });
          const { customer } = await medusaClient.customers.retrieve();
          
          // Load wishlist and settings from metadata
          const savedWishlist = (customer.metadata?.wishlist as WishlistItem[]) || [];
          const savedSettings = (customer.metadata?.settings as CustomerSettings) || get().settings;
          
          set({
            customer: customer as Customer,
            wishlist: savedWishlist,
            settings: savedSettings,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Fetch orders after login
          get().fetchOrders();
          
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          set({
            error: "Invalid email or password",
            isLoading: false,
          });
          return false;
        }
      },
      
      // Register new customer
      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const { customer } = await medusaClient.customers.create(data);
          
          // Auto-login after registration
          await medusaClient.auth.authenticate({
            email: data.email,
            password: data.password,
          });
          
          // Initialize empty wishlist and default settings in metadata
          const metadata = {
            wishlist: [],
            settings: get().settings,
          };
          
          set({
            customer: customer as Customer,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error: unknown) {
          console.error("Registration failed:", error);
          const errorMessage = error instanceof Error && error.message.includes("already exists")
            ? "An account with this email already exists"
            : "Registration failed. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },
      
      // Logout
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await medusaClient.auth.deleteSession();
        } catch {
          // Ignore errors during logout
        }
        
        set({
          customer: null,
          orders: [],
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      
      // Check if user is authenticated
      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          // Attempt to retrieve customer - 401 is expected for non-authenticated users
          const { customer } = await medusaClient.customers.retrieve();
          
          // Load wishlist and settings from metadata
          const savedWishlist = (customer.metadata?.wishlist as WishlistItem[]) || [];
          const savedSettings = (customer.metadata?.settings as CustomerSettings) || get().settings;
          
          set({
            customer: customer as Customer,
            wishlist: savedWishlist,
            settings: savedSettings,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Fetch orders if authenticated
          get().fetchOrders();
        } catch (error: unknown) {
          // 401 Unauthorized is expected when user is not logged in - silently handle it
          const errorMsg = error instanceof Error ? error.message : String(error);
          if (!errorMsg.includes('401')) {
            console.debug('Auth check: User not authenticated');
          }
          
          set({
            customer: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
      
      // Update profile
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          // Normalize phone number to Indian format
          const normalizedData = {
            ...data,
            ...(data.phone && { phone: normalizeIndianPhone(data.phone) }),
          };
          
          const { customer } = await medusaClient.customers.update(normalizedData);
          set({
            customer: customer as Customer,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to update profile:", error);
          set({
            error: "Failed to update profile",
            isLoading: false,
          });
        }
      },
      
      // Add shipping address
      addShippingAddress: async (address) => {
        set({ isLoading: true, error: null });
        
        try {
          // Normalize phone and force India country code (we only operate in India)
          const normalizedAddress = {
            ...address,
            country_code: "in", // Always India
            ...(address.phone && { phone: normalizeIndianPhone(address.phone) }),
          };
          
          const { customer } = await medusaClient.customers.addresses.addAddress({
            address: normalizedAddress as Parameters<typeof medusaClient.customers.addresses.addAddress>[0]["address"],
          });
          set({
            customer: customer as Customer,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to add address:", error);
          set({
            error: "Failed to add address",
            isLoading: false,
          });
        }
      },
      
      // Update shipping address
      updateShippingAddress: async (addressId, address) => {
        set({ isLoading: true, error: null });
        
        try {
          // Normalize phone and force India country code (we only operate in India)
          const normalizedAddress = {
            ...address,
            country_code: "in", // Always India
            ...(address.phone && { phone: normalizeIndianPhone(address.phone) }),
          };
          
          const { customer } = await medusaClient.customers.addresses.updateAddress(
            addressId,
            normalizedAddress as Parameters<typeof medusaClient.customers.addresses.updateAddress>[1]
          );
          set({
            customer: customer as Customer,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to update address:", error);
          set({
            error: "Failed to update address",
            isLoading: false,
          });
        }
      },
      
      // Delete shipping address
      deleteShippingAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        
        try {
          const { customer } = await medusaClient.customers.addresses.deleteAddress(addressId);
          set({
            customer: customer as Customer,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to delete address:", error);
          set({
            error: "Failed to delete address",
            isLoading: false,
          });
        }
      },
      
      // Fetch order history
      fetchOrders: async () => {
        try {
          const { orders } = await medusaClient.customers.listOrders();
          set({ orders: orders as Order[] });
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      },
      
      // Get single order details
      getOrder: async (orderId: string) => {
        try {
          const { order } = await medusaClient.orders.retrieve(orderId);
          return order as Order;
        } catch (error) {
          console.error("Failed to fetch order:", error);
          return null;
        }
      },
      
      // Wishlist: Add item
      addToWishlist: async (productId: string, variantId: string) => {
        const { wishlist, customer } = get();
        if (!wishlist.find(item => item.productId === productId)) {
          const updatedWishlist = [
            ...wishlist,
            { productId, variantId, addedAt: new Date().toISOString() },
          ];
          
          set({ wishlist: updatedWishlist });
          
          // Sync to backend if authenticated
          if (customer) {
            try {
              const metadata = {
                ...(customer.metadata || {}),
                wishlist: updatedWishlist,
              };
              
              await medusaClient.customers.update({ metadata });
            } catch (error) {
              console.error("Failed to sync wishlist to backend:", error);
            }
          }
        }
      },
      
      // Wishlist: Remove item
      removeFromWishlist: async (productId: string) => {
        const { customer } = get();
        const updatedWishlist = get().wishlist.filter(item => item.productId !== productId);
        
        set({ wishlist: updatedWishlist });
        
        // Sync to backend if authenticated
        if (customer) {
          try {
            const metadata = {
              ...(customer.metadata || {}),
              wishlist: updatedWishlist,
            };
            
            await medusaClient.customers.update({ metadata });
          } catch (error) {
            console.error("Failed to sync wishlist to backend:", error);
          }
        }
      },
      
      // Wishlist: Check if item exists
      isInWishlist: (productId: string) => {
        return get().wishlist.some(item => item.productId === productId);
      },
      
      // Wishlist: Clear all
      clearWishlist: async () => {
        const { customer } = get();
        
        set({ wishlist: [] });
        
        // Sync to backend if authenticated
        if (customer) {
          try {
            const metadata = {
              ...(customer.metadata || {}),
              wishlist: [],
            };
            
            await medusaClient.customers.update({ metadata });
          } catch (error) {
            console.error("Failed to sync wishlist to backend:", error);
          }
        }
      },
      
      // Settings: Update and save to backend
      updateSettings: async (newSettings: Partial<CustomerSettings>) => {
        const { customer, settings } = get();
        
        // Update local state immediately
        const updatedSettings = { ...settings, ...newSettings };
        set({ settings: updatedSettings, isLoading: true, error: null });
        
        // If authenticated, save to Medusa customer metadata
        if (customer) {
          try {
            const metadata = {
              ...(customer.metadata || {}),
              settings: updatedSettings,
            };
            
            await medusaClient.customers.update({ metadata });
            
            // Refresh customer data
            const { customer: updatedCustomer } = await medusaClient.customers.retrieve();
            set({
              customer: updatedCustomer as Customer,
              isLoading: false,
            });
          } catch (error) {
            console.error("Failed to save settings:", error);
            set({
              error: "Failed to save settings",
              isLoading: false,
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
      
      // Settings: Load from customer metadata
      loadSettings: () => {
        const { customer, settings } = get();
        
        if (customer?.metadata?.settings) {
          const savedSettings = customer.metadata.settings as CustomerSettings;
          set({ settings: savedSettings });
          return savedSettings;
        }
        
        return settings;
      },
    }),
    {
      name: "pranajiva-customer",
      storage: silentStorage,
      partialize: (state) => ({
        wishlist: state.wishlist,
        settings: state.settings,
      }),
    }
  )
);

// Check auth status on module load (client-side only)
if (typeof window !== "undefined") {
  let authCheckInitialized = false;
  
  setTimeout(() => {
    if (!authCheckInitialized) {
      authCheckInitialized = true;
      useCustomerStore.getState().checkAuth().catch(() => {
        // Silently handle errors from auth check
      });
    }
  }, 300);
}
