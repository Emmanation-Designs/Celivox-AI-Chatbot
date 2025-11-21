import React from 'react';
import { X, Check, Lock } from 'lucide-react';
import { Button } from './Button';

// DECLARE PAYSTACK GLOBAL
declare const PaystackPop: any;

interface PaywallProps {
  onClose: () => void;
  onSuccess: () => void;
  email: string;
  featureName: string;
}

export const Paywall: React.FC<PaywallProps> = ({ onClose, onSuccess, email, featureName }) => {
  // !!! REPLACE WITH YOUR LIVE KEY HERE !!!
  const PAYSTACK_PUBLIC_KEY = "pk_test_35d4066657995717045c48155189226736427603"; 
  
  const plans = [
    { id: 'monthly', name: 'Monthly', price: 10000, label: '₦10,000/mo', badge: null },
    { id: 'yearly', name: 'Yearly', price: 100000, label: '₦100,000/yr', badge: 'Save ₦20,000' },
    { id: 'lifetime', name: 'Lifetime', price: 250000, label: '₦250,000', badge: 'Most Popular 🔥' }
  ];

  const handlePayment = (amount: number, plan: string) => {
    if (typeof PaystackPop === 'undefined') {
      alert("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    try {
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        metadata: {
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: plan }
          ]
        },
        callback: (transaction: any) => {
          console.log("Payment success:", transaction);
          onSuccess();
        },
        onClose: () => {
          console.log("Payment cancelled");
        }
      });
      handler.openIframe();
    } catch (error) {
      console.error("Paystack execution error:", error);
      alert("Something went wrong with the payment gateway.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side - Marketing */}
        <div className="md:w-2/5 p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
             <h2 className="text-3xl font-bold mb-4">Unlock Celivox</h2>
             <p className="text-blue-100 mb-6">
               You've reached your daily limit for <b>{featureName}</b>. Upgrade now to remove all restrictions forever.
             </p>
             <ul className="space-y-3 mb-8">
               {['Unlimited Messages', 'Unlimited Image Gen', 'Unlimited File Uploads', 'Priority Voice Access', 'Exclusive Personalities'].map((item, i) => (
                 <li key={i} className="flex items-center gap-2 text-sm font-medium">
                   <div className="bg-white/20 p-1 rounded-full"><Check size={14} /></div>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
           <div className="relative z-10 text-xs opacity-70">
             Powered by Gemini 2.5 Flash & Pro
           </div>
        </div>

        {/* Right Side - Plans */}
        <div className="md:w-3/5 p-8 bg-gray-800 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Choose your plan</h3>
            <p className="text-gray-400 text-sm">Secure payment via Paystack</p>
          </div>

          <div className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => handlePayment(plan.price, plan.id)}
                className={`relative group cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 flex items-center justify-between
                  ${plan.id === 'lifetime' ? 'border-blue-500 bg-blue-900/20 hover:bg-blue-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}
                <div>
                  <h4 className={`font-bold text-lg ${plan.id === 'lifetime' ? 'text-blue-400' : 'text-white'}`}>{plan.name}</h4>
                  <p className="text-gray-400 text-xs">Billed once</p>
                </div>
                <div className="text-right">
                   <div className="text-xl font-bold text-white">{plan.label}</div>
                   <div className="text-xs text-blue-400 font-semibold group-hover:underline">Select Plan &rarr;</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
             <p className="text-gray-500 text-xs">
               Payments processed securely by Paystack. Supports Card, Bank Transfer, USSD, and Mobile Money.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};