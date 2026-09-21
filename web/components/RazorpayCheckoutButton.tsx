'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { apiClient } from '../lib/api-client';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface RazorpayCheckoutButtonProps {
  amountPaise?: number; // e.g. 29900 for ₹299 (minimum 100 paise)
  currency?: string; // Default: INR
  planId?: number;
  planName?: string;
  buttonText?: string;
  className?: string;
  receipt?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export function RazorpayCheckoutButton({
  amountPaise = 29900,
  currency = 'INR',
  planId,
  planName = 'Shalom Matrimony Membership',
  buttonText = 'Pay with Razorpay',
  className = '',
  receipt,
  onSuccess,
  onFailure,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Step 1: Create Order on Backend
      let order: any;
      if (planId) {
        order = await apiClient.createSubscriptionOrder(planId);
      } else {
        order = await apiClient.createRazorpayOrder(amountPaise, currency, receipt);
      }

      if (!order || !order.order_id) {
        throw new Error('Failed to generate order ID from backend.');
      }

      const keyId =
        order.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_test_TeqmLkAiBwoZp0';

      const userEmail =
        typeof window !== 'undefined'
          ? localStorage.getItem('user_email') || ''
          : '';
      const userMobile =
        typeof window !== 'undefined'
          ? localStorage.getItem('user_mobile') || ''
          : '';
      const userName =
        typeof window !== 'undefined'
          ? localStorage.getItem('user_name') || 'Shalom Member'
          : 'Shalom Member';

      // Ensure Razorpay SDK is loaded
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error(
          'Razorpay Checkout SDK is still loading. Please check your internet connection and try again.'
        );
      }

      // Step 2: Open Razorpay Standard Modal
      const options = {
        key: keyId,
        amount: order.amount || amountPaise,
        currency: order.currency || currency,
        name: 'Shalom Christian Matrimony',
        description: planName,
        order_id: order.order_id,
        prefill: {
          name: userName,
          email: userEmail,
          contact: userMobile,
        },
        theme: {
          color: '#0e7490', // Cyan theme
        },
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment Signature on Backend
            const verifyRes = await apiClient.verifyPayment(
              response.razorpay_order_id || order.order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (onSuccess) {
              onSuccess(verifyRes);
            } else {
              alert(
                verifyRes.message ||
                  'Payment Verified Successfully! Your membership is active.'
              );
            }
          } catch (vErr: any) {
            const msg = vErr.message || 'Payment signature verification failed.';
            if (onFailure) {
              onFailure(msg);
            } else {
              alert(`Verification Error: ${msg}`);
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log('Razorpay modal closed by user.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure event
      rzp.on('payment.failed', function (resp: any) {
        setLoading(false);
        const errorDesc =
          resp.error?.description || 'Transaction could not be processed.';
        console.error('Razorpay Payment Failed:', resp.error);
        if (onFailure) {
          onFailure(errorDesc);
        } else {
          alert(`Payment Failed: ${errorDesc}`);
        }
      });

      rzp.open();
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.message || 'An error occurred during checkout.';
      console.error('Checkout Error:', err);
      if (onFailure) {
        onFailure(errMsg);
      } else {
        alert(`Checkout Error: ${errMsg}`);
      }
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={
          className ||
          'w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
        }
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Opening Razorpay...</span>
          </>
        ) : (
          <span>{buttonText}</span>
        )}
      </button>
    </>
  );
}

export default RazorpayCheckoutButton;
