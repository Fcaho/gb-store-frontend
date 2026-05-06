import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, total, dispatch } = useCart();

  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const remove = (id, name) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success(`${name} removed from cart`, { style: { background: '#1c1917', color: '#fbbf24', border: '1px solid #b45309' } });
  };

  if (items.length === 0) return (
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6 animate-float">🛒</div>
      <h2 className="font-display text-3xl font-bold text-stone-200 mb-3">Your cart is empty</h2>
      <p className="text-stone-500 mb-8 max-w-sm">Looks like you haven't added any products yet. Explore our premium selection!</p>
      <Link to="/products" className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-2xl transition-all hover:scale-105">
        <ShoppingBag size={18} /> Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/products" className="p-2 glass rounded-xl hover:bg-amber-500/10 text-stone-400 hover:text-amber-300 transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-100">Shopping Cart</h1>
            <p className="text-stone-500 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <div key={item._id} className="glass rounded-2xl p-4 flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <Link to={`/products/${item._id}`} className="flex-shrink-0">
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1563412886-8b7f6b98ef80?w=200&q=80'; }}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`}>
                    <h3 className="font-semibold text-stone-100 hover:text-amber-300 transition-colors text-sm truncate">{item.name}</h3>
                  </Link>
                  <p className="text-stone-500 text-xs mt-0.5 capitalize">{item.category?.replace('-', ' ')}</p>
                  <p className="text-amber-400 font-bold mt-1.5">₨{item.price.toLocaleString()}<span className="text-stone-500 font-normal text-xs">/{item.unit}</span></p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center glass rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-amber-500/10 text-stone-300 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="px-3 py-1.5 text-stone-100 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-amber-500/10 text-stone-300 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => remove(item._id, item.name)} className="p-1.5 text-stone-600 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-stone-100">₨{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-stone-500 text-xs">{item.quantity} × ₨{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => { dispatch({ type: 'CLEAR_CART' }); toast.success('Cart cleared'); }}
              className="text-stone-500 hover:text-red-400 text-sm transition-colors flex items-center gap-1"
            >
              <Trash2 size={13} /> Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="glass rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl font-bold text-stone-100 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-stone-400 truncate flex-1 mr-2">{item.name} × {item.quantity}</span>
                  <span className="text-stone-200 flex-shrink-0">₨{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-700 pt-4 mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-400">Subtotal</span>
                <span className="text-stone-200">₨{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-stone-400">Delivery</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span className="text-stone-100">Total</span>
                <span className="text-amber-400 text-xl">₨{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => toast.success('Checkout coming soon! Contact us to place an order.', { duration: 4000, style: { background: '#1c1917', color: '#fbbf24', border: '1px solid #b45309' } })}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <p className="text-center text-xs text-stone-600 mt-3">Secure checkout via WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
