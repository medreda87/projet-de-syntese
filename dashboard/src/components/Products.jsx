import React, { useEffect, useState } from 'react';
import './Products.css';
import API from '../api/axiosApi';  
const Products = ({ setCurrentPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image: null
  });
  const [newCategory, setNewCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Eco Detergent',
      price: 15.00,
      description: 'High efficiency concentrated pods for all machines.',
      category_id: 'Laundry',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Fabric Softener',
      price: 10.00,
      description: 'Lavender scent for fresh feeling clothes.',
      category_id: 'Laundry',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Stain Remover',
      price: 8.00,
      description: 'Instant action spray for tough stains.',
      category_id: 'Cleaning',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=100&h=100&fit=crop'
    }
  ]);

  const [categories, setCategories] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditProductId(null);
    setNewProduct({
      name: '',
      price: '',
      category_id: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setEditProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id,
      description: product.description,
      image: null
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async(e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.category) {
      const productData = {
        id: isEditMode ? editProductId : products.length + 1,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        category_id: newProduct.category_id,
        image: imagePreview || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&h=100&fit=crop'
      };

      console.log('Saving product:', productData);
const formData = new FormData();
formData.append('name', newProduct.name);
formData.append('price', parseFloat(newProduct.price));
formData.append('category_id', newProduct.category_id);
formData.append('description', newProduct.description);
formData.append('image', newProduct.image); // file
formData.append('laundry_id', 5);

await API.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});


      if (isEditMode) {
        setProducts(products.map(product => 
          product.id === editProductId ? productData : product
        ));
      } else {
        setProducts([...products, productData]);
      }
      
      setIsModalOpen(false);
      setNewProduct({ name: '', price: '', category: '', description: '', image: null });
      setImagePreview(null);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(product => product.id !== productToDelete.id));
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }
  , []);

  const handleAddCategory = async() => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setIsCategoryModalOpen(false);
      setNewCategory('');
    }

    await API.post('/categories', { name: newCategory })
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSearchResults = filteredProducts.length > 0;

  return (
    <div className="products-container">
      {/* Header avec onglets de navigation */}
      <div className="page-header">
        <div className="header-tabs">
          
        </div>
        
        <div className="header-actions">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
          <button className="icon-btn">
            🔔
          </button>
          <div className="user-avatar">
            👨
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="products-content">
        {/* Search Info */}
        {searchTerm && (
          <div className="search-info">
            <span>🔍</span>
            <p>Searching for: <strong>"{searchTerm}"</strong></p>
            <span className="search-results-count">{filteredProducts.length} result(s) found</span>
          </div>
        )}

        {/* Action Row */}
        <div className="action-row">
          <div>
            <h3 className="section-title">Product Catalog</h3>
            <p className="section-subtitle">Review and manage your active inventory</p>
          </div>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => setIsCategoryModalOpen(true)}>
              <span>📁</span>
              Add Category
            </button>
            <button className="btn-primary" onClick={openAddModal}>
              <span>➕</span>
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="table-row">
                    <td>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                    </td>
                    <td className="product-name">{highlightText(product.name)}</td>
                    <td className="product-price">${product.price.toFixed(2)}</td>
                    <td>
                      <div className="product-description">{highlightText(product.description)}</div>
                    </td>
                    <td>
                      <span className={`category-badge ${product.category === 'Laundry' ? 'badge-primary' : 'badge-secondary'}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button className="edit-action-btn" onClick={() => openEditModal(product)}>
                          <span>✏️</span>
                        </button>
                        <button className="delete-action-btn" onClick={() => handleDeleteClick(product)}>
                          <span>🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results Message */}
        {searchTerm && !hasSearchResults && (
          <div className="no-results">
            <span>🔍</span>
            <p>No products found for "<strong>{searchTerm}</strong>"</p>
            <p className="no-results-suggestion">Try searching for: detergent, softener, stain, cleaner</p>
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <span>✕</span>
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category_id"
                  className="form-select"
                  value={newProduct.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.id}>{cat.name}</option>
                  ))  }
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe the product..."
                  rows="3"
                  value={newProduct.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div className="upload-area">
                  <label className="upload-label">
                    <div className="upload-content">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                      ) : (
                        <>
                          <span className="upload-icon">☁️</span>
                          <p className="upload-text">Click to upload or drag and drop</p>
                          <p className="upload-hint">SVG, PNG, JPG (max. 800x400px)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="upload-input"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Add New Category</h3>
              <button className="modal-close" onClick={() => setIsCategoryModalOpen(false)}>
                <span>✕</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsCategoryModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleAddCategory}>
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3 className="modal-title">Delete Product</h3>
              <button className="modal-close" onClick={cancelDelete}>
                <span>✕</span>
              </button>
            </div>
            <div className="modal-body delete-body">
              <div className="delete-icon">🗑️</div>
              <p className="delete-message">
                Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>?
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer delete-footer">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;