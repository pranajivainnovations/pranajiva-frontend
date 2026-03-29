/**
 * Checkout Page - Multi-step checkout with Medusa + Razorpay
 * 
 * Steps: Address → Shipping → Payment → Confirmation
 * Supports both guest checkout and logged-in customers.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Lock,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useStealthMode } from "@/stores/stealth-mode";
import { medusaClient, formatPrice, normalizeIndianPhone } from "@/lib/medusa";

// Types
interface ShippingOption {
  id: string;
  name: string;
  amount: number;
  data?: Record<string, unknown>;
}

// India-only operations
const INDIA_COUNTRY_CODE = "in";

interface AddressForm {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

type CheckoutStep = "address" | "shipping" | "payment" | "confirmation";

// Step configuration
const steps: { id: CheckoutStep; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "address", label: "Address", icon: MapPin },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Done", icon: CheckCircle },
];

type PaymentMethod = "razorpay" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { isStealthMode } = useStealthMode();
  const { cart, cartId, refreshCart, clearCart, isLoading: cartLoading } = useCartStore();
  const { customer, isAuthenticated } = useCustomerStore();

  // State
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<AddressForm>({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "in",
    phone: "",
  });
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [billingIsSame, setBillingIsSame] = useState(true);

  // Prefill from customer data
  useEffect(() => {
    if (customer) {
      setEmail(customer.email || "");
      const addresses = customer.shipping_addresses;
      if (addresses && addresses.length > 0) {
        const defaultAddr = addresses[0];
        setAddress({
          first_name: defaultAddr.first_name || customer.first_name || "",
          last_name: defaultAddr.last_name || customer.last_name || "",
          address_1: defaultAddr.address_1 || "",
          address_2: defaultAddr.address_2 || "",
          city: defaultAddr.city || "",
          province: defaultAddr.province || "",
          postal_code: defaultAddr.postal_code || "",
          country_code: "in", // Always India - we only operate in India
          phone: defaultAddr.phone || customer.phone || "",
        });
      } else {
        setAddress(prev => ({
          ...prev,
          first_name: customer.first_name || "",
          last_name: customer.last_name || "",
          phone: customer.phone || "",
        }));
      }
    }
  }, [customer]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0) && currentStep !== "confirmation") {
      router.push("/cart");
    }
  }, [cart, cartLoading, currentStep, router]);

  // Fetch shipping options when address step is complete
  const fetchShippingOptions = useCallback(async () => {
    if (!cartId) return;

    setIsLoadingShipping(true);
    
    try {
      // Always ensure cart has India region (we only operate in India)
      const { regions } = await medusaClient.regions.list();
      const indiaRegion = regions.find(r => r.name?.toLowerCase().includes("india") || r.countries?.some(c => c.iso_2 === INDIA_COUNTRY_CODE));
      const targetRegionId = indiaRegion?.id || regions[0]?.id;
      
      if (targetRegionId && cart?.region_id !== targetRegionId) {
        await medusaClient.carts.update(cartId, { 
          region_id: targetRegionId,
          country_code: INDIA_COUNTRY_CODE,
        });
      }
      
      // Normalize phone number and ensure India country code
      const normalizedAddress = {
        ...address,
        country_code: INDIA_COUNTRY_CODE, // Always India
        phone: normalizeIndianPhone(address.phone),
      };
      
      // Update cart with address
      await medusaClient.carts.update(cartId, {
        email,
        shipping_address: normalizedAddress,
        billing_address: billingIsSame ? normalizedAddress : undefined,
      });

      // Fetch shipping options
      const { shipping_options } = await medusaClient.shippingOptions.listCartOptions(cartId);
      
      if (shipping_options.length === 0) {
        setError("No shipping options available for your location. Please check your address.");
        setIsLoadingShipping(false);
        return;
      }
      
      setShippingOptions(shipping_options as ShippingOption[]);

      // Auto-select first option if only one
      if (shipping_options.length === 1 && shipping_options[0]?.id) {
        setSelectedShipping(shipping_options[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch shipping options:", err);
      setError("Failed to load shipping options. Please check your address and try again.");
    } finally {
      setIsLoadingShipping(false);
    }
  }, [cartId, cart?.region_id, email, address, billingIsSame]);

  // Handle step navigation
  const goToStep = async (step: CheckoutStep) => {
    setError(null);

    if (step === "shipping" && currentStep === "address") {
      // Validate address
      if (!email || !address.first_name || !address.last_name || !address.address_1 || !address.city || !address.postal_code || !address.phone) {
        setError("Please fill in all required fields");
        return;
      }
      await fetchShippingOptions();
    }

    if (step === "payment" && currentStep === "shipping") {
      // Validate shipping selection
      if (!selectedShipping) {
        setError("Please select a shipping method");
        return;
      }

      // Add shipping method to cart
      try {
        await medusaClient.carts.addShippingMethod(cartId!, {
          option_id: selectedShipping,
        });
        await refreshCart();
      } catch (err) {
        console.error("Failed to set shipping method:", err);
        setError("Failed to set shipping method. Please try again.");
        return;
      }
    }

    setCurrentStep(step);
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!cart || !cartId) return;

    // Validate cart has items before creating payment session
    if (!cart.items || cart.items.length === 0) {
      setError("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Validate cart has region
    if (!cart.region_id) {
      setError("Cart region not set. Please try again.");
      return;
    }

    console.log("Creating payment session for cart:", {
      cartId,
      items: cart.items.length,
      region_id: cart.region_id,
      total: cart.total,
    });

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment session
      await medusaClient.carts.createPaymentSessions(cartId);

      // Set payment session to Razorpay (the only provider configured for India region)
      await medusaClient.carts.setPaymentSession(cartId, {
        provider_id: "razorpay",
      });

      // Refresh cart to get payment session
      await refreshCart();

      // Create Razorpay order
      const response = await fetch("/api/checkout/discreet-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cart.total, // Already in paise (smallest unit)
          currency: "INR",
          receipt: `cart_${cartId}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const { orderId: razorpayOrderId, keyId } = await response.json();

      // Load Razorpay
      const Razorpay = (window as unknown as { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }).Razorpay;
      
      if (!Razorpay) {
        // Load Razorpay script
        await loadRazorpayScript();
      }

      // Open Razorpay checkout
      interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        prefill: { name: string; email: string; contact: string };
        notes: { cart_id: string };
        theme: { color: string };
        handler: (response: RazorpayResponse) => void;
        modal: { ondismiss: () => void };
      }
      
      interface RazorpayInstance {
        open: () => void;
      }
      
      interface RazorpayResponse {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }

      const options: RazorpayOptions = {
        key: keyId,
        amount: cart.total,
        currency: "INR",
        name: isStealthMode ? "PJ Wellness" : "PranaJiva",
        description: "Order Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: `${address.first_name} ${address.last_name}`,
          email: email,
          contact: normalizeIndianPhone(address.phone),
        },
        notes: {
          cart_id: cartId,
        },
        theme: {
          color: "#6B8E6B",
        },
        handler: async function (response: RazorpayResponse) {
          // Payment successful - pass all Razorpay response data
          await completeOrder(response);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new ((window as unknown as { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }).Razorpay)(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
  };

  // Complete order after payment
  const completeOrder = async (razorpayResponse: { 
    razorpay_payment_id: string; 
    razorpay_order_id: string; 
    razorpay_signature: string;
  }) => {
    if (!cartId) return;

    try {
      console.log("Razorpay payment successful:", razorpayResponse);
      
      // For MedusaJS V1 with custom Razorpay plugin, we complete the cart directly
      // The payment is already captured by Razorpay at this point
      // We store the payment details in localStorage for order confirmation
      localStorage.setItem('razorpay_payment', JSON.stringify(razorpayResponse));

      // Complete the cart to create order
      const { data } = await medusaClient.carts.complete(cartId);

      // Check if order was created (data will be the order object)
      if (data && "id" in data && "display_id" in data) {
        setOrderId(data.display_id?.toString() || data.id);
        setCurrentStep("confirmation");
        clearCart();
      } else {
        throw new Error("Order creation failed");
      }
    } catch (err) {
      console.error("Order completion error:", err);
      setError("Failed to complete order. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle COD (Cash on Delivery) payment
  const handleCODPayment = async () => {
    if (!cart || !cartId) return;

    // Validate cart has items
    if (!cart.items || cart.items.length === 0) {
      setError("Your cart is empty. Please add items before checkout.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Get current cart state to debug
      const { cart: currentCart } = await medusaClient.carts.retrieve(cartId);
      console.log("Cart state before COD completion:", {
        id: currentCart.id,
        email: currentCart.email,
        shipping_address: currentCart.shipping_address,
        billing_address: currentCart.billing_address,
        shipping_methods: currentCart.shipping_methods,
        payment_sessions: currentCart.payment_sessions,
        payment: (currentCart as Record<string, unknown>).payment,
        payment_authorized_at: (currentCart as Record<string, unknown>).payment_authorized_at,
        items: currentCart.items?.length,
        region_id: currentCart.region_id,
        total: currentCart.total,
      });

      // Step 1.5: Check for stale payment state (from abandoned Razorpay attempt)
      // If cart has a payment_authorized_at but no completed_at, it's in a conflicted state
      const cartAny = currentCart as Record<string, unknown>;
      if (cartAny.payment_authorized_at && !cartAny.completed_at && cartAny.payment) {
        const existingPayment = cartAny.payment as { provider_id?: string };
        if (existingPayment.provider_id && existingPayment.provider_id !== "manual") {
          console.warn("Cart has stale payment from previous provider:", existingPayment.provider_id);
          console.log("This cart has an authorized payment that was never completed.");
          console.log("Attempting to clear payment state and proceed with COD...");
          
          // The cart is in a bad state - we need to work around this
          // MedusaJS doesn't have a direct API to clear payment, so we'll try to
          // create fresh payment sessions which should reset the state
        }
      }

      // Step 2: Ensure shipping address is set
      if (!currentCart.shipping_address) {
        console.log("Setting shipping address...");
        const normalizedAddress = {
          ...address,
          country_code: INDIA_COUNTRY_CODE,
          phone: normalizeIndianPhone(address.phone),
        };
        await medusaClient.carts.update(cartId, {
          email,
          shipping_address: normalizedAddress,
          billing_address: billingIsSame ? normalizedAddress : undefined,
        });
      }

      // Step 3: Ensure shipping method is set
      if (!currentCart.shipping_methods || currentCart.shipping_methods.length === 0) {
        if (selectedShipping) {
          console.log("Adding shipping method...");
          await medusaClient.carts.addShippingMethod(cartId, {
            option_id: selectedShipping,
          });
        } else {
          // Fetch shipping options and auto-select first one
          const { shipping_options } = await medusaClient.shippingOptions.listCartOptions(cartId);
          if (shipping_options.length > 0 && shipping_options[0]?.id) {
            console.log("Auto-selecting shipping method:", shipping_options[0].id);
            await medusaClient.carts.addShippingMethod(cartId, {
              option_id: shipping_options[0].id,
            });
          } else {
            throw new Error("No shipping options available for your location.");
          }
        }
      }

      // Step 4: Create payment sessions (REQUIRED before setting payment session)
      // This also helps reset any stale payment state
      console.log("Creating payment sessions...");
      const { cart: cartWithSessions } = await medusaClient.carts.createPaymentSessions(cartId);
      console.log("Available payment sessions:", cartWithSessions.payment_sessions?.map(s => s.provider_id));

      // Step 5: Check if manual provider is available
      const hasManualProvider = cartWithSessions.payment_sessions?.some(s => s.provider_id === "manual");
      if (!hasManualProvider) {
        console.error("Manual payment provider not available. Available providers:", 
          cartWithSessions.payment_sessions?.map(s => s.provider_id));
        throw new Error("Cash on Delivery is not available for your region. Please try another payment method.");
      }

      // Step 6: Set payment session to manual (for COD)
      console.log("Setting payment session to manual...");
      await medusaClient.carts.setPaymentSession(cartId, {
        provider_id: "manual",
      });

      // Step 7: Refresh cart to ensure all data is synced
      await refreshCart();

      // Step 8: Complete the cart to create order
      console.log("Completing cart...");
      const { type, data } = await medusaClient.carts.complete(cartId);
      console.log("Cart completion response:", { type, data });

      // Check if order was created
      if (type === "order" && data && "id" in data) {
        const order = data as { id: string; display_id?: number };
        setOrderId(order.display_id?.toString() || order.id);
        setCurrentStep("confirmation");
        clearCart();
      } else if (type === "cart") {
        // Cart completion returned cart instead of order - something is wrong
        console.error("Cart completion returned cart instead of order:", data);
        throw new Error("Order could not be created. Please check your cart details and try again.");
      } else {
        throw new Error("Order creation failed");
      }
    } catch (err: unknown) {
      console.error("COD order error:", err);
      const error = err as { response?: { data?: { message?: string; type?: string } }; message?: string };
      const errorMessage = error.response?.data?.message || error.message || "Failed to place order. Please try again.";
      console.error("Error details:", error.response?.data);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate step index
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Loading state
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card-premium p-12 text-center">
          <div className="w-12 h-12 border-4 border-prana-sage/20 border-t-prana-sage rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-soft/60">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-prana-cream/30 to-white"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-charcoal-soft/60 hover:text-prana-sage transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center gap-2 text-prana-sage">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Secure Checkout</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isComplete
                          ? "bg-prana-sage text-white"
                          : isActive
                          ? "bg-velvet-rose text-white"
                          : "bg-neutral-200 text-neutral-400"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? "text-charcoal-soft" : "text-charcoal-soft/50"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 md:w-24 h-1 mx-2 rounded ${
                        isComplete ? "bg-prana-sage" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 max-w-4xl mx-auto"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Form Steps */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Address */}
              {currentStep === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-8"
                >
                  <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-prana-sage" />
                    Delivery Address
                  </h2>

                  <div className="space-y-6">
                    {/* Email */}
                    {!isAuthenticated && (
                      <div>
                        <label className="block text-sm font-medium text-charcoal-soft mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="For order updates & receipt"
                          className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                        />
                      </div>
                    )}

                    {/* Name */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-soft mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={address.first_name}
                          onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-soft mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={address.last_name}
                          onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-soft mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-soft mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={address.address_1}
                        onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
                        placeholder="House/Flat No., Building Name, Street"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-soft mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={address.address_2}
                        onChange={(e) => setAddress({ ...address, address_2: e.target.value })}
                        placeholder="Landmark, Area (Optional)"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                      />
                    </div>

                    {/* City, State, PIN */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-soft mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-soft mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={address.province}
                          onChange={(e) => setAddress({ ...address, province: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-soft mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={address.postal_code}
                          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                          maxLength={6}
                          className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Billing Address Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingIsSame}
                        onChange={(e) => setBillingIsSame(e.target.checked)}
                        className="w-5 h-5 rounded border-charcoal-soft/20 text-prana-sage focus:ring-prana-sage"
                      />
                      <span className="text-sm text-charcoal-soft">
                        Billing address same as delivery address
                      </span>
                    </label>
                  </div>

                  {/* Continue Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => goToStep("shipping")}
                      className="w-full btn-velvet py-4 text-lg flex items-center justify-center gap-2"
                    >
                      Continue to Shipping
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-8"
                >
                  <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-prana-sage" />
                    Shipping Method
                  </h2>

                  {isLoadingShipping ? (
                    <div className="py-8 text-center text-charcoal-soft/60">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p>Loading shipping options...</p>
                      <p className="text-sm mt-2">This may take a moment</p>
                    </div>
                  ) : shippingOptions.length === 0 ? (
                    <div className="py-8 text-center text-charcoal-soft/60">
                      <AlertCircle className="w-8 h-8 mx-auto mb-4 text-amber-500" />
                      <p>No shipping options available</p>
                      <p className="text-sm mt-2">Please check your address or contact support</p>
                      <button
                        onClick={() => setCurrentStep("address")}
                        className="mt-4 text-prana-sage hover:underline"
                      >
                        ← Go back and update address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedShipping === option.id
                              ? "border-prana-sage bg-prana-sage/5"
                              : "border-charcoal-soft/20 hover:border-prana-sage/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping === option.id}
                              onChange={() => setSelectedShipping(option.id)}
                              className="w-5 h-5 text-prana-sage focus:ring-prana-sage"
                            />
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-charcoal-soft/60">
                                {option.name.toLowerCase().includes("express")
                                  ? "2-3 business days"
                                  : "5-7 business days"}
                              </p>
                            </div>
                          </div>
                          <p className="font-heading text-lg">
                            {option.amount === 0 ? "FREE" : formatPrice(option.amount, "inr")}
                          </p>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Discreet Packaging Notice */}
                  <div className="mt-6 p-4 bg-prana-sage/10 rounded-xl flex items-start gap-3">
                    <Package className="w-5 h-5 text-prana-sage flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-prana-sage">100% Discreet Packaging</p>
                      <p className="text-sm text-charcoal-soft/70">
                        All orders ship in plain, unmarked boxes with no logos or product descriptions.
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setCurrentStep("address")}
                      className="px-6 py-4 rounded-full border border-charcoal-soft/20 hover:bg-neutral-100 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={() => goToStep("payment")}
                      disabled={!selectedShipping}
                      className="flex-1 btn-velvet py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-8"
                >
                  <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-prana-sage" />
                    Payment
                  </h2>

                  {/* Order Summary */}
                  <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
                    <h3 className="font-medium mb-3">Delivering to:</h3>
                    <p className="text-sm text-charcoal-soft/80">
                      {address.first_name} {address.last_name}
                      <br />
                      {address.address_1}
                      {address.address_2 && `, ${address.address_2}`}
                      <br />
                      {address.city}, {address.province} - {address.postal_code}
                      <br />
                      Phone: {address.phone}
                    </p>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6 space-y-3">
                    <h3 className="font-medium text-charcoal-soft mb-3">Select Payment Method</h3>
                    
                    {/* Cash on Delivery Option */}
                    <label 
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-prana-sage bg-prana-sage/5' 
                          : 'border-charcoal-soft/20 hover:border-prana-sage/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-5 h-5 mt-0.5 text-prana-sage focus:ring-prana-sage"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <Package className="w-5 h-5 text-prana-sage" />
                          Cash on Delivery (COD)
                        </div>
                        <p className="text-sm text-charcoal-soft/70 mt-1">
                          Pay when your order arrives. No advance payment required.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-prana-sage mt-2">
                          <CheckCircle className="w-3 h-3" />
                          Available for all orders
                        </div>
                      </div>
                    </label>

                    {/* Razorpay Option */}
                    <label 
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'razorpay' 
                          ? 'border-prana-sage bg-prana-sage/5' 
                          : 'border-charcoal-soft/20 hover:border-prana-sage/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="w-5 h-5 mt-0.5 text-prana-sage focus:ring-prana-sage"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <CreditCard className="w-5 h-5 text-prana-sage" />
                          Pay Online (UPI / Card / Net Banking)
                        </div>
                        <p className="text-sm text-charcoal-soft/70 mt-1">
                          Secure payment via Razorpay. Supports UPI, Credit/Debit Cards, Net Banking & Wallets.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-amber-600 mt-2">
                          <AlertCircle className="w-3 h-3" />
                          Coming soon - Currently under maintenance
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Security Info */}
                  <div className="mb-6 p-4 bg-prana-sage/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-prana-sage" />
                      <div>
                        <p className="font-medium text-sm">Your Privacy is Protected</p>
                        <p className="text-xs text-charcoal-soft/60">
                          Package will show &quot;PJ WELLNESS&quot; • Plain, unmarked packaging
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setCurrentStep("shipping")}
                      className="px-6 py-4 rounded-full border border-charcoal-soft/20 hover:bg-neutral-100 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={paymentMethod === 'cod' ? handleCODPayment : handlePayment}
                      disabled={isProcessing || paymentMethod === 'razorpay'}
                      className="flex-1 btn-velvet py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : paymentMethod === 'cod' ? (
                        <>
                          Place Order (Pay on Delivery)
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Pay {formatPrice(cart?.total || 0, "inr")}
                          <Lock className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === "confirmation" && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-premium p-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-prana-sage/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-prana-sage" />
                  </div>

                  <h2 className="text-3xl font-heading mb-4">Order Confirmed!</h2>
                  <p className="text-charcoal-soft/70 mb-2">
                    Thank you for your order. Your order number is:
                  </p>
                  <p className="text-xl font-mono font-bold text-prana-sage mb-6">
                    {orderId || "ORD-XXXXX"}
                  </p>

                  <p className="text-sm text-charcoal-soft/60 mb-8">
                    We&apos;ve sent a confirmation email to <strong>{email}</strong>.
                    Your order will be delivered in plain, unmarked packaging.
                  </p>

                  {/* What's Next */}
                  <div className="bg-prana-sage/10 rounded-xl p-6 text-left mb-8">
                    <h3 className="font-heading text-lg mb-4">What&apos;s Next?</h3>
                    <ul className="space-y-3 text-sm text-charcoal-soft/80">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-prana-sage flex-shrink-0 mt-0.5" />
                        Order confirmation email sent
                      </li>
                      <li className="flex items-start gap-3">
                        <Package className="w-4 h-4 text-prana-sage flex-shrink-0 mt-0.5" />
                        Your order will be packed discreetly within 24 hours
                      </li>
                      <li className="flex items-start gap-3">
                        <Truck className="w-4 h-4 text-prana-sage flex-shrink-0 mt-0.5" />
                        Tracking details will be shared via email & SMS
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4 justify-center">
                    {isAuthenticated && (
                      <Link href="/account/orders" className="btn-velvet">
                        View Order
                      </Link>
                    )}
                    <Link
                      href="/shop"
                      className="px-6 py-3 rounded-full border border-prana-sage text-prana-sage hover:bg-prana-sage/10 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Order Summary */}
          {currentStep !== "confirmation" && cart && (
            <div className="lg:col-span-1">
              <div className="card-premium p-6 sticky top-24">
                <h3 className="text-xl font-heading mb-4">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={isStealthMode ? "Product" : item.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🌿
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {isStealthMode ? "Wellness Product" : item.title}
                        </p>
                        <p className="text-xs text-charcoal-soft/60">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">
                          {formatPrice(item.total, cart.region?.currency_code || "inr")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-charcoal-soft/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-soft/70">Subtotal</span>
                    <span>{formatPrice(cart.subtotal, cart.region?.currency_code || "inr")}</span>
                  </div>
                  {cart.discount_total > 0 && (
                    <div className="flex justify-between text-sm text-prana-sage">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discount_total, cart.region?.currency_code || "inr")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-soft/70">Shipping</span>
                    <span>
                      {cart.shipping_total === 0
                        ? "FREE"
                        : formatPrice(cart.shipping_total, cart.region?.currency_code || "inr")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-soft/70">Tax</span>
                    <span>{formatPrice(cart.tax_total, cart.region?.currency_code || "inr")}</span>
                  </div>
                  <div className="flex justify-between text-lg font-heading pt-2 border-t border-charcoal-soft/10">
                    <span>Total</span>
                    <span className="text-prana-sage">
                      {formatPrice(cart.total, cart.region?.currency_code || "inr")}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-charcoal-soft/10">
                  <div className="flex items-center gap-2 text-xs text-charcoal-soft/60 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>100% Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal-soft/60 mb-2">
                    <Package className="w-4 h-4" />
                    <span>Discreet Packaging Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal-soft/60">
                    <Lock className="w-4 h-4" />
                    <span>Your privacy is protected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
