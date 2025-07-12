'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { formatPrice } from '@/utils/api';

interface AddToCartButtonProps {
  product: any;
  config: any;
  selectedColor?: string;
  selectedOptions?: { [key: string]: string };
  selectedVariant?: any;
}

export default function AddToCartButton({ product, config, selectedColor, selectedOptions, selectedVariant }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.current_stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  const variantPrice = selectedVariant ? selectedVariant.price : product.unit_price;
  const variantStock = selectedVariant ? selectedVariant.qty : product.current_stock;

  const handleAddToCart = async () => {
    if (variantStock <= 0) return;
    
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, selectedColor, selectedOptions, selectedVariant);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = variantStock <= 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={variantStock || 999}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 text-center border-0 focus:ring-0"
            disabled={isOutOfStock}
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= (product.current_stock || 999) || isOutOfStock}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
        className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>

      {/* Total Price */}
      <div className="text-sm text-gray-600">
        Total: {formatPrice((variantPrice - (product.discount || 0)) * quantity, config)}
      </div>
    </div>
  );
} 