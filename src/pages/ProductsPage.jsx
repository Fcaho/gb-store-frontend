import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'all', label: 'All Products' },
  { key: 'dry-fruits', label: 'Dry Fruits' },
  { key: 'nuts', label: 'Nuts & Seeds' },
  { key: 'shilajit', label: 'Shilajit' },
  { key: 'herbs', label: 'Herbs' },
  { key: 'other', label: 'Other' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || 'all';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 24 };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('category');
    else next.set('category', cat);
    next.delete('search');
    setSearch('');
    setSearchInput('');
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    const next = new URLSearchParams();
    if (searchInput.trim()) next.set('search', searchInput.trim());
    setSearchParams(next);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-stone-100 mb-2">
            {search ? `Results for "${search}"` : category !== 'all' ? CATEGORIES.find(c => c.key === category)?.label : 'All Products'}
          </h1>
          <p className="text-stone-400 text-sm">{loading ? 'Loading...' : `${total} products found`}</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-800/60 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchInput && (
              <button type="button" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                <X size={14} />
              </button>
            )}
          </div>
          <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-xl text-sm transition-all">
            Search
          </button>
          {search && (
            <button type="button" onClick={clearSearch} className="px-3 py-2.5 glass hover:bg-stone-700/50 text-stone-400 rounded-xl text-sm transition-all">
              Clear
            </button>
          )}
        </form>

        {/* Category Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(({ key, label }) => (
            <button key={key} onClick={() => setCategory(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${category === key
                  ? 'bg-amber-500 text-stone-900 shadow-lg shadow-amber-500/20'
                  : 'glass text-stone-300 hover:text-amber-300 hover:border-amber-500/30'
                }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl shimmer-bg" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-2xl font-bold text-stone-300 mb-2">No products found</h3>
            <p className="text-stone-500 mb-6">Try adjusting your search or category filter.</p>
            <button onClick={clearSearch} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-xl transition-all">
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => <ProductCard key={p._id} product={p} delay={i * 60} />)}
          </div>
        )}
      </div>
    </div>
  );
}
