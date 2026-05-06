import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award, Leaf, Star, ChevronDown } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80',
];

const features = [
  { icon: Shield, title: '100% Authentic', desc: 'Directly sourced from GB farmers' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Fast shipping across Pakistan' },
  { icon: Award, title: 'Premium Quality', desc: 'Lab-tested and certified' },
  { icon: Leaf, title: 'All Natural', desc: 'No preservatives or additives' },
];

const categories = [
  { key: 'dry-fruits', label: 'Dry Fruits', emoji: '🍇', desc: 'Hunza Apricots, Mulberries & more' },
  { key: 'nuts', label: 'Nuts & Seeds', emoji: '🥜', desc: 'Walnuts, Almonds, Chilgoza' },
  { key: 'shilajit', label: 'Shilajit', emoji: '⛰️', desc: 'Authentic high-altitude resin' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImg, setHeroImg] = useState(0);

  useEffect(() => {
    productAPI.getAll({ featured: 'true', limit: 4 })
      .then(res => setFeatured(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroImg(h => (h + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images with crossfade */}
        {HERO_IMAGES.map((img, i) => (
          <div key={img} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === heroImg ? 1 : 0 }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/60 to-stone-950/90" />
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6 animate-fade-in">
            <MapPin size={14} className="text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">Sourced from Gilgit Baltistan, Pakistan</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-stone-50">Nature's Finest</span>
            <br />
            <span className="text-gradient">from the Karakoram</span>
          </h1>
          <p className="text-stone-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Premium dry fruits, exotic nuts, and authentic Shilajit — handpicked from the pristine valleys of Gilgit Baltistan at altitudes above 3,000 meters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="group flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/25 text-base">
              Explore Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products?category=shilajit" className="flex items-center gap-2 px-8 py-4 glass hover:bg-amber-500/10 text-amber-300 font-semibold rounded-2xl transition-all duration-300 border border-amber-500/30 text-base">
              Discover Shilajit
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-stone-500 text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="text-amber-500" />
        </div>

        {/* Hero dots */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroImg ? 'bg-amber-400 w-6' : 'bg-stone-600'}`} />
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 px-4 border-y border-stone-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-amber-400" />
              </div>
              <div>
                <div className="font-semibold text-stone-100 text-sm">{title}</div>
                <div className="text-stone-500 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-stone-100 mb-3">Shop by Category</h2>
            <p className="text-stone-400 text-base">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categories.map(({ key, label, emoji, desc }) => (
              <Link key={key} to={`/products?category=${key}`}
                className="group glass rounded-2xl p-8 text-center hover:bg-amber-500/5 transition-all duration-300 hover:border-amber-500/30 card-hover">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{emoji}</div>
                <h3 className="font-display text-xl font-bold text-stone-100 mb-2 group-hover:text-amber-300 transition-colors">{label}</h3>
                <p className="text-stone-500 text-sm">{desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-amber-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold text-stone-100 mb-2">Featured Products</h2>
              <p className="text-stone-400">Our best sellers, loved by customers</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="h-80 rounded-2xl shimmer-bg" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((p, i) => <ProductCard key={p._id} product={p} delay={i * 100} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-500 mb-4">No featured products yet.</p>
              <Link to="/admin" className="text-amber-400 hover:text-amber-300 text-sm underline">Add products in Admin →</Link>
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium text-sm">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials strip */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-stone-100 mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Ahmed K.', city: 'Karachi', rating: 5, text: 'The Chilgoza pine nuts are absolutely divine. Pure, fresh and from genuine GB source. Will order again!' },
              { name: 'Sara M.', city: 'Lahore', rating: 5, text: 'Shilajit quality is unmatched. Noticed improvements in energy levels within 2 weeks. Highly recommended.' },
              { name: 'Bilal R.', city: 'Islamabad', rating: 5, text: 'Hunza walnuts are so fresh and tasty. Great packaging, fast delivery. Excellent customer service too.' },
            ].map(({ name, city, rating, text }) => (
              <div key={name} className="glass rounded-2xl p-6 text-left">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(rating)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-stone-300 text-sm leading-relaxed mb-4 italic">"{text}"</p>
                <div>
                  <div className="font-semibold text-stone-100 text-sm">{name}</div>
                  <div className="text-stone-500 text-xs">{city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-700 rounded-xl flex items-center justify-center">
              <Leaf size={16} className="text-stone-900" />
            </div>
            <div>
              <div className="font-display font-bold text-amber-300">GB Harvest</div>
              <div className="text-xs text-stone-500">Gilgit Baltistan, Pakistan</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-500">
            <Link to="/products" className="hover:text-amber-300 transition-colors">Shop</Link>
            <Link to="/cart" className="hover:text-amber-300 transition-colors">Cart</Link>
            <Link to="/admin" className="hover:text-amber-300 transition-colors">Admin</Link>
          </div>
          <div className="text-xs text-stone-600">© 2024 GB Harvest. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function MapPin({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
