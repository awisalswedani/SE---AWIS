"use client";
import { useState, useMemo } from 'react';
import AddToCartButton from './AddToCartButton';

export default function VariantSelectionWrapper({ product, config }: { product: any, config: any }) {
  // Extract variant data
  const colors = product.colors_formatted || [];
  const choiceOptions = product.choice_options || [];
  const variations = product.variation || [];

  // State for selections
  const [selectedColor, setSelectedColor] = useState(colors.length > 0 ? colors[0].name : '');
  const [selectedColorCode, setSelectedColorCode] = useState(colors.length > 0 ? colors[0].code : '');
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    choiceOptions.forEach((opt: any) => {
      if (opt.options && opt.options.length > 0) initial[opt.title] = opt.options[0];
    });
    return initial;
  });

  // Find the selected variant
  const selectedVariant = useMemo(() => {
    let typeParts = [];
    if (colors.length > 0 && selectedColor) typeParts.push(selectedColor);
    choiceOptions.forEach((opt: any) => {
      if (selectedOptions[opt.title]) typeParts.push(selectedOptions[opt.title]);
    });
    const typeStr = typeParts.join('-').replace(/ /g, '');
    const found = variations.find((v: any) => v.type.replace(/ /g, '') === typeStr) || null;
    if (found && colors.length > 0 && selectedColor) {
      found.color_code = selectedColorCode;
    }
    return found;
  }, [selectedColor, selectedColorCode, selectedOptions, colors, choiceOptions, variations]);

  const handleColorSelect = (color: any) => {
    setSelectedColor(color.name);
    setSelectedColorCode(color.code);
    // Dispatch event for ProductImageGallery
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('product-color-select', { detail: { colorCode: color.code } }));
    }
  };

  // Render color buttons and dropdowns
  return (
    <div className="space-y-4 mb-6">
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Color:</label>
          <div className="flex space-x-2">
            {colors.map((color: any) => (
              <button
                key={color.name}
                type="button"
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedColor === color.name ? 'border-blue-600' : 'border-gray-300'}`}
                style={{ backgroundColor: color.code }}
                onClick={() => handleColorSelect(color)}
                aria-label={color.name}
              >
                {selectedColor === color.name && (
                  <span className="inline-block w-4 h-4 bg-white rounded-full border border-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {choiceOptions.map((opt: any) => (
        <div key={opt.title}>
          <label className="block text-sm font-medium mb-1">{opt.title}:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedOptions[opt.title] || ''}
            onChange={e => setSelectedOptions(prev => ({ ...prev, [opt.title]: e.target.value }))}
          >
            {opt.options.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
      <AddToCartButton
        product={product}
        config={config}
        selectedColor={selectedColorCode}
        selectedOptions={selectedOptions}
        selectedVariant={selectedVariant}
      />
    </div>
  );
} 