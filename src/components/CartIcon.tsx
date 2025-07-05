'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function CartIcon() {
  const { state } = useCart();

  return (
    <Link href="/cart" className="relative group">
      <div className="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-blue-600 transition-colors">
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
          />
        </svg>
        
        {/* Cart Count Badge */}
        {state.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {state.totalItems > 99 ? '99+' : state.totalItems}
          </span>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3">
          <div className="text-sm font-medium text-gray-900">
            Cart ({state.totalItems} {state.totalItems === 1 ? 'item' : 'items'})
          </div>
          {state.items.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <div className="font-medium">
                Total: {state.total > 0 ? `$${state.total.toFixed(2)}` : 'Free'}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 