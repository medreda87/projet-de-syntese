import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Products.css';
import API from '../api/axiosApi';

const Products = ({ setCurrentPage }) => {
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: null
  });
  const [newCategory, setNewCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // UI states (like Services)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const successTimeoutRef = useRef(null);

  // Get laundry_id (consistent with Services)
  const getLaundryId = useCallback(() => parseInt(localStorage.getItem('laundry_id')) || 6, []);

  // Fetch products
const fetchProducts = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const laundryId = getLaundryId();

    const response = await API.get(`/products/laundry/${laundryId}`);

    setProducts(response.data || []);

  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Failed to load products');
  } finally {
    setLoading(false);
  }
}, [getLaundryId]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Auto-dismiss success
  useEffect(() => {
    if (success) {
      successTimeoutRef.current = setTimeout(() => setSuccess(null), 4000);
    }
    return () => { if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current); };
  }, [success]);

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
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!newProduct.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      setError('Valid price required');
      return false;
    }
    if (!newProduct.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditProductId(null);
    setNewProduct({ name: '', price: '', category: '', description: '', image: null });
    setImagePreview(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setEditProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      image: null
    });
    setImagePreview(product.image ? `/images/products/${product.image}` : null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', newProduct.name.trim());
    formData.append('price', parseFloat(newProduct.price));
    formData.append('category_id', newProduct.category); // controller expects 'category_id' string
    formData.append('description', newProduct.description.trim());
    if (newProduct.image) formData.append('image', newProduct.image);
    formData.append('laundry_id', getLaundryId());

    try {
      let savedProduct;
      if (isEditMode && editProductId) {
        await API.put(`/products/${editProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        savedProduct = { ...newProduct, id: editProductId, price: parseFloat(newProduct.price), imagePreview: imagePreview };
        setProducts(products.map(p => p.id === editProductId ? savedProduct : p));
      } else {
        const response = await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        savedProduct = response.data;
        setProducts([...products, savedProduct]);
      }
      setSuccess(isEditMode ? 'Product updated!' : 'Product created!');
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await API.delete(`/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setSuccess('Product deleted!');
    } catch (err) {
      setError('Delete failed');
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await API.post('/categories', { name: newCategory.trim() });
      setCategories([...categories, response.data]);
      setSuccess('Category added!');
      setIsCategoryModalOpen(false);
      setNewCategory('');
    } catch (err) {
      setError('Category add failed');
    }
  };

  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    try {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.split(regex).map((part, i) => 
        regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
      );
    } catch {
      return text;
    }
  };


// get les products du backend la fonction show





  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSearchResults = filteredProducts.length > 0;

  return (
    <div className="products-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-tabs"></div>
        <div className="header-actions">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            {searchTerm && !loading && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>
          <button className="icon-btn" disabled={loading}>🔔</button>
          <div className="user-avatar" />
        </div>
      </div>

      <div className="products-content">
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="toast success-toast">
            {success}
            <button onClick={() => setSuccess(null)}>×</button>
          </div>
        )}

        {searchTerm && (
          <div className="search-info">
            <span>🔍</span>
            <p>Searching for: <strong>"{searchTerm}"</strong></p>
            <span className="search-results-count">{filteredProducts.length} result(s)</span>
          </div>
        )}

        <div className="action-row">
          <div>
            <h3 className="section-title">Product Catalog</h3>
            <p className="section-subtitle">Manage your inventory ({products.length} products)</p>
          </div>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => setIsCategoryModalOpen(true)} disabled={loading}>
              📁 Add Category
            </button>
            <button className="btn-primary" onClick={openAddModal} disabled={loading}>
              ➕ Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-image">
                          <img src={`http://localhost:8000/images/products/${product.image}`} alt={product.name} />
                        </div>
                      </td>
                      <td>{highlightText(product.name)}</td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td title={product.description}>{highlightText(product.description || 'No description')}</td>
                      <td>
                        <span className={`category-badge ${product.category === 'Laundry' ? 'badge-primary' : 'badge-secondary'}`}>
                          {product.category?.name}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button className="edit-action-btn" onClick={() => openEditModal(product)} disabled={loading}>✏️</button>
                          <button className="delete-action-btn" onClick={() => handleDeleteClick(product)} disabled={loading}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {searchTerm && !hasSearchResults && (
              <div className="no-results">
                <span>🔍</span>
                <p>No products found for "<strong>{searchTerm}</strong>"</p>
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>Clear Search</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals - same structure */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Product' : 'Add Product'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input name="name" value={newProduct.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Price ($)*</label>
                  <input name="price" type="number" step="0.01" value={newProduct.price} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={newProduct.category} onChange={handleInputChange} required>
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={newProduct.description} onChange={handleInputChange} rows="3" />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem'}} />}
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" disabled={loading} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3>Add Category</h3>
              <button className="modal-close" onClick={() => setIsCategoryModalOpen(false)}>✕</button>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleAddCategory}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>Delete Product?</h3>
            <p>Are you sure? <strong>{productToDelete?.name}</strong></p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete} disabled={loading}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

