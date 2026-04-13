import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Products.css';
import API from '../api/axiosApi';
import AlertModal from './AlertModal';
import { Search, Plus, Pencil, Trash2, X, FolderPlus, ImagePlus } from 'lucide-react';

const Products = ({ setCurrentPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image: null });
  const [newCategory, setNewCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const laundry = JSON.parse(localStorage.getItem('laundry') || '{}');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const getLaundryId = laundry.id

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/products/laundry/${getLaundryId}`);
      setProducts(response.data || []);
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  }, [getLaundryId]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, fetchCategories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    if (!newProduct.name.trim()) { setFormError('Product name is required'); return false; }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) { setFormError('Valid price required'); return false; }
    if (!newProduct.category) { setFormError('Category is required'); return false; }
    return true;
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditProductId(null);
    setNewProduct({ name: '', price: '', category: '', description: '', image: null });
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setEditProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category_id || '',
      description: product.description || '',
      image: null,
    });
    setImagePreview(product.image ? `http://localhost:8000/images/products/${product.image}` : null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setFormError(null);

    const formData = new FormData();
    formData.append('name', newProduct.name.trim());
    formData.append('price', parseFloat(newProduct.price));
    formData.append('category_id', newProduct.category);
    formData.append('description', newProduct.description.trim());
    if (newProduct.image) formData.append('image', newProduct.image);
    formData.append('laundry_id', getLaundryId);

    try {
      if (isEditMode && editProductId) {
formData.append('_method', 'PUT');

await API.post(`/products/${editProductId}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});         setAlert({ isOpen: true, type: 'success', title: 'Updated', message: 'Product updated successfully!' });
      } else {
        await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setAlert({ isOpen: true, type: 'success', title: 'Created', message: 'Product created successfully!' });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setAlert({
      isOpen: true,
      type: 'warning',
      title: 'Delete Product?',
      message: `Are you sure you want to delete "${product.name}"? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => confirmDelete(product.id),
    });
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      setAlert({ isOpen: true, type: 'success', title: 'Deleted', message: 'Product deleted successfully.' });
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to delete product.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await API.post('/categories', { name: newCategory.trim() });
      setCategories([...categories, response.data]);
      setAlert({ isOpen: true, type: 'success', title: 'Added', message: 'Category added successfully!' });
      setIsCategoryModalOpen(false);
      setNewCategory('');
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to add category.' });
    }
  };

  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    try {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.split(regex).map((part, i) => regex.test(part) ? <mark key={i} className="prod-highlight">{part}</mark> : part);
    } catch { return text; }
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="prod-page">
      <AlertModal isOpen={alert.isOpen} onClose={() => setAlert({ ...alert, isOpen: false })} type={alert.type} title={alert.title} message={alert.message} confirmText={alert.confirmText} cancelText={alert.cancelText} onConfirm={alert.onConfirm} autoClose={alert.type === 'success'} />

      {/* Topbar */}
      <div className="prod-topbar">
        <div>
          <h1 className="prod-topbar-title">Products</h1>
          <p className="prod-topbar-sub">Manage your product catalog ({products.length} items)</p>
        </div>
        <div className="prod-topbar-actions">
          <button className="btn btn--outline" onClick={() => setIsCategoryModalOpen(true)} disabled={loading}><FolderPlus size={16} /> Add Category</button>
          <button className="btn btn--primary" onClick={openAddModal} disabled={loading}><Plus size={16} /> Add Product</button>
        </div>
      </div>

      {/* Content */}
      <div className="prod-body">
        {/* Search */}
        <div className="prod-search">
          <Search size={16} />
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={loading} />
          {searchTerm && <button className="prod-search-clear" onClick={() => setSearchTerm('')}><X size={14} /></button>}
        </div>

        {searchTerm && (
          <div className="prod-search-info">
            <Search size={14} />
            <span>Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "<strong>{searchTerm}</strong>"</span>
          </div>
        )}

        {/* Table */}
        {loading && products.length === 0 ? (
          <div className="prod-loading">
            <div className="prod-spinner" />
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="prod-table-wrap">
            <table className="prod-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="prod-img">
                        <img src={`http://localhost:8000/images/products/${product.image}`} alt={product.name} />
                      </div>
                    </td>
                    <td className="prod-name">{highlightText(product.name)}</td>
                    <td className="prod-price">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="prod-desc" title={product.description}>{highlightText(product.description || 'No description')}</td>
                    <td><span className="prod-badge">{product.category?.name}</span></td>
                    <td>
                      <div className="prod-actions-cell">
                        <button className="prod-action-btn" onClick={() => openEditModal(product)} disabled={loading} title="Edit"><Pencil size={14} /></button>
                        <button className="prod-action-btn prod-action-btn--danger" onClick={() => handleDeleteClick(product)} disabled={loading} title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="prod-empty-table">
                <Search size={24} />
                <p>No products found{searchTerm ? ` for "${searchTerm}"` : ''}</p>
                {searchTerm && <button className="btn-link" onClick={() => setSearchTerm('')}>Clear search</button>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="prod-modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="prod-modal" onClick={e => e.stopPropagation()}>
            <div className="prod-modal-header">
              <h2>{isEditMode ? 'Edit Product' : 'New Product'}</h2>
              <button className="prod-modal-close" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="prod-modal-body">
              {formError && <div className="prod-form-error">{formError}</div>}
              <div className="prod-form-row">
                <div className="prod-form-group">
                  <label>Name *</label>
                  <input name="name" value={newProduct.name} onChange={handleInputChange} required disabled={loading} />
                </div>
                <div className="prod-form-group">
                  <label>Price ($) *</label>
                  <input name="price" type="number" step="0.01" value={newProduct.price} onChange={handleInputChange} required disabled={loading} />
                </div>
              </div>
              <div className="prod-form-group">
                <label>Category *</label>
                <select name="category" value={newProduct.category} onChange={handleInputChange} required disabled={loading}>
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="prod-form-group">
                <label>Description</label>
                <textarea name="description" value={newProduct.description} onChange={handleInputChange} rows="3" disabled={loading} />
              </div>
              <div className="prod-form-group">
<label className="prod-upload-area">
  <input type="file" onChange={handleImageChange} accept="image/*" hidden />

  {imagePreview ? (
    <img src={imagePreview} alt="Preview" className="prod-upload-preview" />
  ) : (
    <div className="prod-upload-placeholder">
      <ImagePlus size={24} />
      <span>Click to upload</span>
    </div>
  )}
</label>
              </div>
              <div className="prod-modal-footer">
                <button type="button" className="btn btn--outline" onClick={() => setIsModalOpen(false)} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? 'Saving...' : isEditMode ? 'Update' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="prod-modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="prod-modal prod-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="prod-modal-header">
              <h2>Add Category</h2>
              <button className="prod-modal-close" onClick={() => setIsCategoryModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="prod-modal-body">
              <div className="prod-form-group">
                <label>Category Name</label>
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter category name" />
              </div>
              <div className="prod-modal-footer">
                <button className="btn btn--outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
                <button className="btn btn--primary" onClick={handleAddCategory}>Add Category</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
