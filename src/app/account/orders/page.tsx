/**
 * Orders Page - Order History with Medusa Integration
 * 
 * Displays customer order history from Medusa backend.
 * Shows order status, tracking, and item details.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Eye, RefreshCw, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCustomerStore } from "@/stores/customer-store";
import { formatPrice } from "@/lib/medusa";
import { useStealthMode } from "@/stores/stealth-mode";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "fulfilled":
      return "bg-green-100 text-green-700";
    case "shipped":
    case "partially_shipped":
      return "bg-blue-100 text-blue-700";
    case "pending":
    case "requires_action":
      return "bg-yellow-100 text-yellow-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "fulfilled":
      return CheckCircle;
    case "shipped":
    case "partially_shipped":
      return Truck;
    case "pending":
    case "requires_action":
      return Clock;
    case "canceled":
      return XCircle;
    default:
      return Package;
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function OrdersPage() {
  const { isStealthMode } = useStealthMode();
  const { orders, isAuthenticated, isLoading, fetchOrders } = useCustomerStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Fetch orders on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-charcoal-soft/60 mb-6">
        <Link href="/account" className="hover:text-prana-sage transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Account
        </Link>
        <span>/</span>
        <span>Orders</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-prana-sage" />
        <h1 className="text-4xl font-heading font-bold">Order History</h1>
      </div>

      {/* Not Authenticated */}
      {!isAuthenticated && !isLoading && (
        <div className="card-premium p-12 text-center">
          <Package className="w-16 h-16 text-charcoal-soft/30 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Sign In to View Orders</h3>
          <p className="text-charcoal-soft/60 mb-6">
            Sign in to your account to view your order history
          </p>
          <Link href="/account" className="btn-velvet inline-block">
            Sign In
          </Link>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="card-premium p-12 text-center">
          <div className="w-12 h-12 border-4 border-prana-sage/20 border-t-prana-sage rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-soft/60">Loading your orders...</p>
        </div>
      )}

      {/* No Orders */}
      {isAuthenticated && !isLoading && orders.length === 0 && (
        <div className="card-premium p-12 text-center">
          <Package className="w-16 h-16 text-charcoal-soft/30 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">No Orders Yet</h3>
          <p className="text-charcoal-soft/60 mb-6">Start exploring our wellness collection</p>
          <Link href="/shop" className="btn-velvet inline-block">
            Shop Now
          </Link>
        </div>
      )}

      {/* Orders List */}
      {isAuthenticated && !isLoading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.fulfillment_status);
            const isExpanded = selectedOrderId === order.id;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 bg-prana-cream/30 border-b border-prana-sage/10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="tech-label text-charcoal-soft/60">Order</p>
                        <p className="font-heading text-lg">#{order.display_id}</p>
                      </div>
                      <div>
                        <p className="tech-label text-charcoal-soft/60">Date</p>
                        <p className="font-body">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="tech-label text-charcoal-soft/60">Total</p>
                        <p className="font-heading text-lg">{formatPrice(order.total, "inr")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.fulfillment_status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        {formatStatus(order.fulfillment_status)}
                      </span>
                      <button
                        onClick={() => setSelectedOrderId(isExpanded ? null : order.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-prana-sage/20 hover:border-prana-sage hover:text-prana-sage transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{isExpanded ? "Hide" : "View"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items (Expandable) */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6"
                  >
                    <h4 className="font-heading text-lg mb-4">Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start">
                          <div className="w-16 h-16 bg-prana-cream rounded-lg overflow-hidden flex-shrink-0">
                            {item.thumbnail ? (
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                                🌿
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-body">
                              {isStealthMode ? "Wellness Product" : item.title}
                            </p>
                            <p className="text-sm text-charcoal-soft/60">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-heading">{formatPrice(item.total, "inr")}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-prana-sage/10 space-y-2">
                      <div className="flex justify-between text-sm text-charcoal-soft/70">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal, "inr")}</span>
                      </div>
                      {order.shipping_total > 0 && (
                        <div className="flex justify-between text-sm text-charcoal-soft/70">
                          <span>Shipping</span>
                          <span>{formatPrice(order.shipping_total, "inr")}</span>
                        </div>
                      )}
                      {order.tax_total > 0 && (
                        <div className="flex justify-between text-sm text-charcoal-soft/70">
                          <span>Tax</span>
                          <span>{formatPrice(order.tax_total, "inr")}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-heading text-lg pt-2 border-t border-prana-sage/10">
                        <span>Total</span>
                        <span>{formatPrice(order.total, "inr")}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="mt-6 pt-6 border-t border-prana-sage/10">
                        <h4 className="font-heading text-lg mb-2">Shipping Address</h4>
                        <p className="text-charcoal-soft/70">
                          {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                          {order.shipping_address.address_1}<br />
                          {order.shipping_address.address_2 && <>{order.shipping_address.address_2}<br /></>}
                          {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}<br />
                          {order.shipping_address.phone && <>Phone: {order.shipping_address.phone}</>}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t border-prana-sage/10 flex flex-wrap gap-3">
                      {order.fulfillment_status === "shipped" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-prana-sage/10 text-prana-sage hover:bg-prana-sage hover:text-white transition-all">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm">Track Order</span>
                        </button>
                      )}
                      {order.fulfillment_status === "fulfilled" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-prana-sage/20 hover:border-prana-sage hover:text-prana-sage transition-all">
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-sm">Reorder</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Discreet Shipping Notice */}
      <div className="mt-8 p-6 bg-prana-sage/5 rounded-2xl border border-prana-sage/20">
        <h3 className="font-heading text-lg mb-2 text-prana-sage">100% Discreet Shipping</h3>
        <p className="text-sm text-charcoal-soft/70">
          All orders are packaged in plain, unbranded boxes with no mention of PranaJiva or product details on the outside packaging. Your privacy is our priority.
        </p>
      </div>
    </motion.div>
  );
}
