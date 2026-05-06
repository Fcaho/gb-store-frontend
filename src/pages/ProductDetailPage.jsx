import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, MapPin, CheckCircle, Minus, Plus } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    productAPI.getById(id)
      .then(res => setProduct(res.data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${qty} × ${product.name} added to cart!`, {
      style: { background: '#1c1917', color: '#fbbf24', border: '1px solid #b45309' }
    });
  };

  if (loading) return (
    <div className="min-h-screen pt-28 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl shimmer-bg" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-8 rounded-xl shimmer-bg" style={{ width: `${80 - i * 10}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const imgSrc = imgError ? `https://images.unsplash.com/photo-1563412886-8b7f6b98ef80?w=800&q=80` : getProductImage(product);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-stone-500 hover:text-amber-300 transition-colors">Home</Link>
          <span className="text-stone-700">/</span>
          <Link to="/products" className="text-stone-500 hover:text-amber-300 transition-colors">Products</Link>
          <span className="text-stone-700">/</span>
          <span className="text-stone-300">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-800">
            {!imgLoaded && <div className="absolute inset-0 shimmer-bg" />}
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {product.featured && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500 text-stone-900 text-xs font-bold rounded-lg">
                ⭐ Featured
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 glass text-amber-300 text-xs font-medium rounded-lg capitalize">
                {product.category.replace('-', ' ')}
              </span>
              {product.stock > 0
                ? <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} />In Stock ({product.stock} {product.unit}s)</span>
                : <span className="text-red-400 text-xs">Out of Stock</span>}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-50 mb-3">{product.name}</h1>

            <div className="flex items-center gap-1.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-600'} />
              ))}
              <span className="text-stone-400 text-sm">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-stone-300 leading-relaxed mb-6 text-sm">{product.description}</p>

            <div className="glass rounded-xl p-4 mb-6 space-y-2.5">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-amber-500 flex-shrink-0" />
                <span className="text-stone-400">Origin:</span>
                <span className="text-stone-200 font-medium">{product.origin || 'Gilgit Baltistan'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package size={14} className="text-amber-500 flex-shrink-0" />
                <span className="text-stone-400">Unit:</span>
                <span className="text-stone-200 font-medium">{product.unit}</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-amber-400">₨{product.price.toLocaleString()}</span>
              <span className="text-stone-400 text-base ml-2">per {product.unit}</span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-stone-400 text-sm">Quantity:</span>
                <div className="flex items-center glass rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-amber-500/10 text-stone-300 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-stone-100 font-semibold min-w-[2.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-amber-500/10 text-stone-300 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-900 font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20"
              >
                <ShoppingCart size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={() => navigate(-1)} className="px-4 glass hover:bg-stone-700/50 text-stone-300 rounded-2xl transition-all">
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPin({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
