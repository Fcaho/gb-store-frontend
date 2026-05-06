import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, RefreshCw, Database, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', category: 'dry-fruits', imageUrl: '', stock: '', unit: 'kg', origin: 'Gilgit Baltistan', featured: false };
const CATEGORIES = ['dry-fruits', 'shilajit', 'nuts', 'seeds', 'herbs', 'other'];
const UNITS = ['kg', 'g', 'ml', 'l', 'pack', 'piece'];

function toastOpts() {
  return { style: { background: '#1c1917', color: '#fbbf24', border: '1px solid #b45309' } };
}

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ limit: 100 });
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products', toastOpts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (product) => {
    setForm({ ...product, price: product.price.toString(), stock: product.stock.toString() });
    setEditId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return toast.error('Fill required fields', toastOpts());
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editId) {
        await productAPI.update(editId, payload);
        toast.success('Product updated!', toastOpts());
      } else {
        await productAPI.create(payload);
        toast.success('Product created!', toastOpts());
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to save', toastOpts());
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await productAPI.delete(id);
      toast.success('Deleted!', toastOpts());
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete', toastOpts());
    } finally {
      setDeleting(null);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('This will DELETE all products and add sample data. Continue?')) return;
    setSeeding(true);
    try {
      const res = await productAPI.seed();
      toast.success(`Seeded ${res.data.products.length} products!`, toastOpts());
      fetchProducts();
    } catch (err) {
      toast.error('Seeding failed', toastOpts());
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Featured', value: products.filter(p => p.featured).length, icon: TrendingUp },
    { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-100">Admin Panel</h1>
            <p className="text-stone-400 text-sm mt-1">Manage products & inventory</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-2 px-4 py-2.5 glass hover:bg-amber-500/10 text-amber-300 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
              <Database size={15} className={seeding ? 'animate-spin' : ''} />
              {seeding ? 'Seeding...' : 'Seed Data'}
            </button>
            <button onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-xl text-sm transition-all hover:scale-105">
              {showForm ? <X size={15} /> : <Plus size={15} />}
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-100">{value}</div>
                <div className="text-xs text-stone-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
            <h2 className="font-display text-xl font-bold text-stone-100 mb-5">
              {editId ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'name', label: 'Product Name *', type: 'text', placeholder: 'e.g. Hunza Walnuts', span: 2 },
                { name: 'price', label: 'Price (₨) *', type: 'number', placeholder: '1200' },
                { name: 'stock', label: 'Stock *', type: 'number', placeholder: '50' },
                { name: 'origin', label: 'Origin', type: 'text', placeholder: 'Gilgit Baltistan' },
                { name: 'imageUrl', label: 'Image URL', type: 'url', placeholder: 'https://...', span: 2 },
              ].map(({ name, label, type, placeholder, span }) => (
                <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs text-stone-400 mb-1.5 font-medium">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    min={type === 'number' ? 0 : undefined}
                    className="w-full px-3 py-2.5 bg-stone-800/60 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-stone-400 mb-1.5 font-medium">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-stone-800/60 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500/50 transition-colors capitalize">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1.5 font-medium">Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-stone-800/60 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs text-stone-400 mb-1.5 font-medium">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the product..."
                  className="w-full px-3 py-2.5 bg-stone-800/60 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange}
                  className="w-4 h-4 accent-amber-500" />
                <label htmlFor="featured" className="text-sm text-stone-300">Mark as Featured</label>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                  className="px-5 py-2.5 glass hover:bg-stone-700/50 text-stone-300 rounded-xl text-sm transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl text-sm transition-all hover:scale-105 disabled:opacity-50">
                  <Save size={14} />
                  {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-stone-800">
            <h2 className="font-semibold text-stone-100">Products ({products.length})</h2>
            <button onClick={fetchProducts} className="p-2 hover:bg-amber-500/10 rounded-lg text-stone-400 hover:text-amber-300 transition-all">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-stone-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-stone-500 mb-4">No products found. Add one or seed sample data.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-800 text-left">
                    <th className="px-4 py-3 text-xs text-stone-500 font-medium uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-xs text-stone-500 font-medium uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-xs text-stone-500 font-medium uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-xs text-stone-500 font-medium uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3 text-xs text-stone-500 font-medium uppercase tracking-wider">Featured</th>
                    <th className="px-4 py-3 text-xs text-stone-500 font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/50">
                  {products.map((p, i) => (
                    <tr key={p._id} className="hover:bg-amber-500/5 transition-colors group animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl || `https://images.unsplash.com/photo-1563412886-8b7f6b98ef80?w=60&q=70`}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1563412886-8b7f6b98ef80?w=60&q=70'; }}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                          <span className="font-medium text-stone-100 group-hover:text-amber-300 transition-colors">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 glass text-amber-300 text-xs rounded-lg capitalize">{p.category.replace('-', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-amber-400 font-semibold">₨{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.featured ? <span className="text-amber-400 text-xs">⭐ Yes</span> : <span className="text-stone-600 text-xs">No</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(p)}
                            className="p-1.5 hover:bg-amber-500/10 text-stone-400 hover:text-amber-300 rounded-lg transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id}
                            className="p-1.5 hover:bg-red-500/10 text-stone-400 hover:text-red-400 rounded-lg transition-all">
                            <Trash2 size={14} className={deleting === p._id ? 'animate-pulse' : ''} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
