import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/products?category=shilajit', label: 'Shilajit' },
    { to: '/products?category=dry-fruits', label: 'Dry Fruits' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-2xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Leaf size={18} className="text-stone-900" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-none text-amber-300">GB Harvest</div>
                <div className="text-[10px] text-stone-400 leading-none tracking-widest uppercase">Gilgit Baltistan</div>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-amber-300 hover:bg-amber-500/10 ${location.pathname === to ? 'text-amber-300' : 'text-stone-300'}`}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-amber-500/10 text-stone-300 hover:text-amber-300 transition-all">
                <Search size={20} />
              </button>
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-amber-500/10 text-stone-300 hover:text-amber-300 transition-all">
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-amber-500/10 text-stone-300 hover:text-amber-300 transition-all">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="mt-3 animate-slide-up">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-stone-800/80 border border-amber-500/20 rounded-xl px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 text-sm"
                />
                <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-xl transition-all text-sm">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden animate-slide-up">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="block px-5 py-3 text-stone-300 hover:text-amber-300 hover:bg-amber-500/10 transition-all text-sm border-b border-stone-800/50 last:border-0">
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
