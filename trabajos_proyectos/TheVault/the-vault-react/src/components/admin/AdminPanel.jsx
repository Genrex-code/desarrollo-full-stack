// src/components/admin/AdminPanel.js - VERSIÓN COMPLETA CON CAMPOS NUEVOS
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AdminPanel = () => {
  const { 
    adminProducts, 
    isAdmin, 
    currentUser,
    addProduct, 
    updateProduct, 
    deleteProduct,
    orders 
  } = useApp();
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  
  // ESTADO INICIAL CON CAMPOS NUEVOS
  const [newProduct, setNewProduct] = useState({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    genre: 'Rock',
    format: 'Vinyl',
    price: 29.99,
    stock: 10,
    description: '',
    featured: false,
    heritage: false,
    edition: '',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop',
    // CAMPOS NUEVOS AGREGADOS:
    tracks: 10,
    duration: '40:00',
    sku: `VIN-${new Date().getFullYear()}-001`
  });

  if (!isAdmin || !currentUser?.isAdmin) {
    return (
      <div className="content-view fade-in">
        <div className="container text-center py-5">
          <div className="alert alert-danger p-5">
            <i className="bi bi-shield-lock-fill me-2" style={{ fontSize: '3rem' }}></i>
            <h2 className="mt-3">ACCESO DENEGADO</h2>
            <p className="mb-0">No tienes permisos de administrador.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveEdit = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.artist) {
      alert('Completa los campos obligatorios');
      return;
    }
    
    addProduct(newProduct);
    setNewProduct({
      title: '',
      artist: '',
      year: new Date().getFullYear(),
      genre: 'Rock',
      format: 'Vinyl',
      price: 29.99,
      stock: 10,
      description: '',
      featured: false,
      heritage: false,
      edition: '',
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop',
      // CAMPOS NUEVOS AGREGADOS:
      tracks: 10,
      duration: '40:00',
      sku: `VIN-${new Date().getFullYear()}-001`
    });
    setShowAddForm(false);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  // Generar imágenes aleatorias para productos nuevos
  const imageOptions = [
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519281682544-5f37c4b14c47?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop'
  ];

  const getRandomImage = () => {
    return imageOptions[Math.floor(Math.random() * imageOptions.length)];
  };

  // Generar SKU automático
  const generateSKU = () => {
    const formatCode = newProduct.format === 'Vinyl' ? 'VIN' : newProduct.format === 'CD' ? 'CD' : 'CAS';
    const year = newProduct.year || new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${formatCode}-${year}-${randomNum}`;
  };

  return (
    <div className="content-view fade-in">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-white bungee-font mb-1">
              <i className="bi bi-speedometer2 me-3 text-gold"></i>
              PANEL ADMINISTRATIVO
            </h1>
            <p className="text-muted mb-0">
              <i className="bi bi-person-badge me-2"></i>
              {currentUser?.username} • {currentUser?.email}
            </p>
          </div>
          <div className="text-end">
            <div className="badge bg-success p-2">
              <i className="bi bi-shield-check me-1"></i>
              MODO ADMIN
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-4">
          <div className="nav nav-tabs border-bottom-0">
            <button 
              className={`nav-link ${activeTab === 'products' ? 'active text-white' : 'text-secondary'}`}
              onClick={() => setActiveTab('products')}
              style={{
                background: activeTab === 'products' ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid #333',
                borderBottom: 'none',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <i className="bi bi-box-seam me-2"></i>
              Productos ({adminProducts.length})
            </button>
            <button 
              className={`nav-link ${activeTab === 'orders' ? 'active text-white' : 'text-secondary'}`}
              onClick={() => setActiveTab('orders')}
              style={{
                background: activeTab === 'orders' ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid #333',
                borderBottom: 'none',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <i className="bi bi-receipt me-2"></i>
              Órdenes ({orders.length})
            </button>
            <button 
              className={`nav-link ${activeTab === 'stats' ? 'active text-white' : 'text-secondary'}`}
              onClick={() => setActiveTab('stats')}
              style={{
                background: activeTab === 'stats' ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid #333',
                borderBottom: 'none',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <i className="bi bi-graph-up me-2"></i>
              Estadísticas
            </button>
          </div>
        </div>

        {/* Contenido de pestañas */}
        {activeTab === 'products' && (
          <>
            {/* Estadísticas */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-dark text-white border-neon-pink">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title mb-2">Total Productos</h5>
                    <h2 className="text-pink mb-0">{adminProducts.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-dark text-white border-neon-blue">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title mb-2">Bajo Stock (&lt;10)</h5>
                    <h2 className="text-blue mb-0">
                      {adminProducts.filter(p => p.stock < 10).length}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-dark text-white border-heritage-gold">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title mb-2">Destacados</h5>
                    <h2 className="text-gold mb-0">
                      {adminProducts.filter(p => p.featured).length}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-dark text-white border-success">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title mb-2">Stock Total</h5>
                    <h2 className="text-success mb-0">
                      {adminProducts.reduce((sum, p) => sum + p.stock, 0)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Agregar Producto */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white mb-0">
                <i className="bi bi-box-seam me-2"></i>
                Inventario de Productos
              </h4>
              <button 
                className="btn btn-success"
                onClick={() => setShowAddForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Producto
              </button>
            </div>

            {/* Tabla de Productos */}
            <div className="card bg-dark text-white border-secondary">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Artista</th>
                        <th>Formato</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Canciones</th>
                        <th>Duración</th>
                        <th>Destacado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <small className="text-muted">{product.sku || product.id}</small>
                          </td>
                          <td>
                            <div 
                              className="rounded"
                              style={{
                                width: '50px',
                                height: '50px',
                                background: `url(${product.image}) center/cover`,
                                border: '2px solid #333'
                              }}
                            ></div>
                          </td>
                          <td>
                            <div>
                              <strong className="d-block">{product.title}</strong>
                              <small className="text-muted">
                                {product.genre} • {product.year}
                                <br />
                                {product.tracks && <span>{product.tracks} canciones</span>}
                                {product.duration && <span> • {product.duration}</span>}
                              </small>
                            </div>
                          </td>
                          <td>{product.artist}</td>
                          <td>
                            <span className={`badge ${
                              product.format === 'Vinyl' ? 'bg-pink' : 
                              product.format === 'CD' ? 'bg-blue' : 'bg-secondary'
                            }`}>
                              {product.format}
                            </span>
                          </td>
                          <td>
                            <strong>${product.price.toFixed(2)}</strong>
                          </td>
                          <td>
                            <span className={`badge ${
                              product.stock > 20 ? 'bg-success' :
                              product.stock > 5 ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {product.stock} unidades
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {product.tracks || 'N/A'} canciones
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {product.duration || 'N/A'}
                            </span>
                          </td>
                          <td>
                            {product.featured ? (
                              <i className="bi bi-star-fill text-warning fs-5"></i>
                            ) : (
                              <i className="bi bi-star text-secondary fs-5"></i>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-info"
                                onClick={() => setEditingProduct({ ...product })}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(product.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="card bg-dark text-white border-secondary">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Historial de Órdenes
              </h5>
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-receipt text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-3">No hay órdenes registradas</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>Orden ID</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice().reverse().map(order => (
                        <tr key={order.id}>
                          <td>
                            <small>{order.id}</small>
                          </td>
                          <td>
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td>
                            <div>
                              <strong>{order.user?.username}</strong>
                              <br />
                              <small className="text-muted">{order.user?.email}</small>
                            </div>
                          </td>
                          <td>
                            <small>
                              {order.items.length} productos
                            </small>
                          </td>
                          <td>
                            <strong>${order.total?.toFixed(2)}</strong>
                          </td>
                          <td>
                            <span className="badge bg-success">
                              Completada
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-dark text-white border-secondary mb-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Ventas Totales
                  </h5>
                </div>
                <div className="card-body text-center py-5">
                  <h1 className="text-success">
                    ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                  </h1>
                  <p className="text-muted mb-0">
                    Total generado por {orders.length} órdenes
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-dark text-white border-secondary mb-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-people me-2"></i>
                    Productos Más Vendidos
                  </h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {adminProducts
                      .filter(p => p.totalSold > 0)
                      .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
                      .slice(0, 5)
                      .map(product => (
                        <li key={product.id} className="list-group-item bg-dark text-white border-secondary">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{product.title}</span>
                            <span className="badge bg-primary">
                              {product.totalSold || 0} vendidos
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar Producto */}
        {editingProduct && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.95)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content bg-dark">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-white">
                    <i className="bi bi-pencil me-2"></i>
                    Editar Producto: {editingProduct.title}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={() => setEditingProduct(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label text-white">Título del Álbum</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-white"
                          value={editingProduct.title}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct, 
                            title: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label text-white">Artista</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.artist}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              artist: e.target.value
                            })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-white">Año</label>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.year}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              year: parseInt(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-4">
                          <label className="form-label text-white">Precio ($)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            className="form-control bg-dark text-white"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              price: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">Stock</label>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              stock: parseInt(e.target.value)
                            })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">Género</label>
                          <select 
                            className="form-select bg-dark text-white"
                            value={editingProduct.genre}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              genre: e.target.value
                            })}
                          >
                            <option value="Rock">Rock</option>
                            <option value="Jazz">Jazz</option>
                            <option value="Blues">Blues</option>
                            <option value="Clásica">Clásica</option>
                            <option value="Reggae">Reggae</option>
                            <option value="Hip Hop">Hip Hop</option>
                            <option value="Electrónica">Electrónica</option>
                            <option value="Soul">Soul</option>
                            <option value="R&B">R&B</option>
                            <option value="Country">Country</option>
                            <option value="Funk">Funk</option>
                            <option value="Disco">Disco</option>
                            <option value="Metal">Metal</option>
                            <option value="Pop">Pop</option>
                            <option value="Grunge">Grunge</option>
                            <option value="Hard Rock">Hard Rock</option>
                            <option value="Progressive Rock">Progressive Rock</option>
                            <option value="Soft Rock">Soft Rock</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* NUEVOS CAMPOS: Canciones, Duración, SKU */}
                      <div className="row mt-3">
                        <div className="col-md-4">
                          <label className="form-label text-white">N° Canciones</label>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.tracks || ''}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              tracks: parseInt(e.target.value) || 0
                            })}
                            min="1"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">Duración (MM:SS)</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.duration || ''}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              duration: e.target.value
                            })}
                            placeholder="Ej: 45:30"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">SKU/Código</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.sku || ''}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              sku: e.target.value
                            })}
                            placeholder="Ej: VIN-1970-001"
                          />
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label className="form-label text-white">Formato</label>
                          <select 
                            className="form-select bg-dark text-white"
                            value={editingProduct.format}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              format: e.target.value
                            })}
                          >
                            <option value="Vinyl">Vinyl</option>
                            <option value="CD">CD</option>
                            <option value="Cassette">Cassette</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-white">Edición (Heritage)</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={editingProduct.edition || ''}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct, 
                              edition: e.target.value
                            })}
                            placeholder="Ej: Limited Edition 180g"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="form-label text-white">Descripción</label>
                        <textarea 
                          className="form-control bg-dark text-white"
                          rows="3"
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct, 
                            description: e.target.value
                          })}
                        ></textarea>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input"
                              checked={editingProduct.featured}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct, 
                                featured: e.target.checked
                              })}
                            />
                            <label className="form-check-label text-white">
                              Producto Destacado
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input"
                              checked={editingProduct.heritage}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct, 
                                heritage: e.target.checked
                              })}
                            />
                            <label className="form-check-label text-white">
                              Edición Heritage
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="text-center">
                        <div 
                          className="rounded mb-3 mx-auto"
                          style={{
                            width: '200px',
                            height: '200px',
                            background: `url(${editingProduct.image}) center/cover`,
                            border: '3px solid #444'
                          }}
                        ></div>
                        <p className="text-muted small">
                          URL de la imagen actual
                        </p>
                        <input 
                          type="text" 
                          className="form-control form-control-sm bg-dark text-white"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct, 
                            image: e.target.value
                          })}
                        />
                        <button 
                          className="btn btn-sm btn-outline-secondary mt-2"
                          onClick={() => setEditingProduct({
                            ...editingProduct,
                            image: getRandomImage()
                          })}
                        >
                          <i className="bi bi-shuffle me-1"></i>
                          Cambiar Imagen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    <i className="bi bi-save me-2"></i>
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Agregar Producto */}
        {showAddForm && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.95)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content bg-dark">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-white">
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar Nuevo Producto
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={() => setShowAddForm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label text-white">Título del Álbum *</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-white"
                          value={newProduct.title}
                          onChange={(e) => setNewProduct({
                            ...newProduct, 
                            title: e.target.value
                          })}
                          required
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label text-white">Artista *</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={newProduct.artist}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              artist: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-white">Año</label>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-white"
                            value={newProduct.year}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              year: parseInt(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-4">
                          <label className="form-label text-white">Precio ($)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            className="form-control bg-dark text-white"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              price: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">Stock</label>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-white"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              stock: parseInt(e.target.value)
                            })}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">Género</label>
                          <select 
                            className="form-select bg-dark text-white"
                            value={newProduct.genre}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              genre: e.target.value
                            })}
                          >
                            <option value="Rock">Rock</option>
                            <option value="Jazz">Jazz</option>
                            <option value="Blues">Blues</option>
                            <option value="Clásica">Clásica</option>
                            <option value="Reggae">Reggae</option>
                            <option value="Hip Hop">Hip Hop</option>
                            <option value="Electrónica">Electrónica</option>
                            <option value="Soul">Soul</option>
                            <option value="R&B">R&B</option>
                            <option value="Country">Country</option>
                            <option value="Funk">Funk</option>
                            <option value="Disco">Disco</option>
                            <option value="Metal">Metal</option>
                            <option value="Pop">Pop</option>
                            <option value="Grunge">Grunge</option>
                            <option value="Hard Rock">Hard Rock</option>
                            <option value="Progressive Rock">Progressive Rock</option>
                            <option value="Soft Rock">Soft Rock</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* NUEVOS CAMPOS: Canciones, Duración, SKU */}
                      <div className="row mt-3">
                        <div className="col-md-4">
                          <label className="form-label text-white">N° Canciones</label>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-white"
                            value={newProduct.tracks}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              tracks: parseInt(e.target.value) || 0
                            })}
                            min="1"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">Duración (MM:SS)</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={newProduct.duration}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              duration: e.target.value
                            })}
                            placeholder="Ej: 45:30"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-white">SKU/Código</label>
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control bg-dark text-white"
                              value={newProduct.sku}
                              onChange={(e) => setNewProduct({
                                ...newProduct, 
                                sku: e.target.value
                              })}
                              placeholder="Ej: VIN-1970-001"
                            />
                            <button 
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setNewProduct({
                                ...newProduct,
                                sku: generateSKU()
                              })}
                            >
                              <i className="bi bi-arrow-clockwise"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label className="form-label text-white">Formato</label>
                          <select 
                            className="form-select bg-dark text-white"
                            value={newProduct.format}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              format: e.target.value
                            })}
                          >
                            <option value="Vinyl">Vinyl</option>
                            <option value="CD">CD</option>
                            <option value="Cassette">Cassette</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-white">Edición (Heritage)</label>
                          <input 
                            type="text" 
                            className="form-control bg-dark text-white"
                            value={newProduct.edition}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              edition: e.target.value
                            })}
                            placeholder="Ej: Limited Edition 180g"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="form-label text-white">Descripción</label>
                        <textarea 
                          className="form-control bg-dark text-white"
                          rows="3"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({
                            ...newProduct, 
                            description: e.target.value
                          })}
                        ></textarea>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input"
                              checked={newProduct.featured}
                              onChange={(e) => setNewProduct({
                                ...newProduct, 
                                featured: e.target.checked
                              })}
                            />
                            <label className="form-check-label text-white">
                              Destacar este producto
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input"
                              checked={newProduct.heritage}
                              onChange={(e) => setNewProduct({
                                ...newProduct, 
                                heritage: e.target.checked
                              })}
                            />
                            <label className="form-check-label text-white">
                              Edición Heritage
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="text-center">
                        <h6 className="text-white mb-3">Vista previa</h6>
                        <div 
                          className="rounded mb-3 mx-auto"
                          style={{
                            width: '200px',
                            height: '200px',
                            background: `url(${newProduct.image}) center/cover`,
                            border: '3px solid #444'
                          }}
                        ></div>
                        <div className="bg-secondary p-3 rounded text-start">
                          <strong className="d-block text-white">{newProduct.title || 'Título del álbum'}</strong>
                          <small className="text-light">{newProduct.artist || 'Artista'}</small>
                          <div className="mt-2">
                            <span className="badge bg-dark">{newProduct.format}</span>
                            <span className="badge bg-dark ms-1">{newProduct.year}</span>
                          </div>
                          {(newProduct.tracks || newProduct.duration) && (
                            <div className="mt-2 small">
                              {newProduct.tracks && <span className="text-light">{newProduct.tracks} canciones</span>}
                              {newProduct.duration && <span className="text-light ms-2">• {newProduct.duration}</span>}
                            </div>
                          )}
                          <div className="mt-2">
                            <strong className="text-white">${newProduct.price.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleAddProduct}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;