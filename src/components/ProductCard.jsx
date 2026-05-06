import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Package, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Category-based colored placeholder (always works, no network needed)
const CATEGORY_COLORS = {
  'dry-fruits': '#92400e',
  'shilajit': '#1c1917',
  'nuts': '#78350f',
  'seeds': '#166534',
  'herbs': '#14532d',
  'other': '#7c2d12',
};

const CATEGORY_EMOJI = {
  'dry-fruits': '🍑',
  'shilajit': '🪨',
  'nuts': '🥜',
  'seeds': '🌱',
  'herbs': '🌿',
  'other': '🧴',
};

export default function ProductCard({ product, delay = 0 }) {
  const { dispatch } = useCart();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#1c1917', color: '#fbbf24', border: '1px solid #b45309' },
      iconTheme: { primary: '#f59e0b', secondary: '#1c1917' }
    });
    setTimeout(() => setAdding(false), 500);
  };

  const bgColor = CATEGORY_COLORS[product.category] || '#292524';
  const emoji = CATEGORY_EMOJI[product.category] || '📦';
  const hasImage = product.imageUrl && product.imageUrl.startsWith('http') && !imgError;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block card-hover"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="glass rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square" style={{ backgroundColor: bgColor }}>
          
          {/* Fallback placeholder — always visible if image fails */}
          {(!hasImage) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontSize: '64px', lineHeight: 1 }}>{emoji}</span>
              <span className="text-white/60 text-xs mt-2 capitalize">{product.category.replace('-', ' ')}</span>
            </div>
          )}

          {/* Real image — load on top of placeholder */}
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgError ? 'opacity-0' : 'opacity-100'}`}
              loading="lazy"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="px-2.5 py-1 bg-amber-500 text-stone-900 text-xs font-bold rounded-lg">Featured</span>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="px-2.5 py-1 bg-red-500/80 text-white text-xs font-bold rounded-lg">Low Stock</span>
            )}
            {product.stock === 0 && (
              <span className="px-2.5 py-1 bg-stone-600 text-stone-300 text-xs font-bold rounded-lg">Out of Stock</span>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 glass text-amber-300 text-xs font-medium rounded-lg capitalize">
              {product.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-display font-semibold text-stone-100 text-base leading-tight flex-1 group-hover:text-amber-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <MapPin size={11} className="text-amber-500" />
            <span className="text-xs text-stone-500">{product.origin || 'Gilgit Baltistan'}</span>
          </div>

          <p className="text-stone-400 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-600'} />
              ))}
            </div>
            <span className="text-xs text-stone-400">{product.rating} ({product.reviews})</span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-amber-400">₨{product.price.toLocaleString()}</span>
              <span className="text-xs text-stone-500 ml-1">/{product.unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                ${product.stock === 0
                  ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                  : adding
                    ? 'bg-amber-300 text-stone-900 scale-95'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-900 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20'
                }`}
            >
              <ShoppingCart size={13} />
              {product.stock === 0 ? 'Sold Out' : adding ? 'Added!' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
