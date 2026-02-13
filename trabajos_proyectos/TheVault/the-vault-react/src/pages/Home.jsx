// src/pages/Home.jsx - VERSIÓN FINAL
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Home() {
  const { adminProducts, addToCart, isLoggedIn, cart, calculateCartCount } = useApp();
  const navigate = useNavigate();
  
  const [displayProducts, setDisplayProducts] = useState([]);
  const [lastAddedProduct, setLastAddedProduct] = useState(null);

  const topProducts = useMemo(() => {
    return adminProducts.slice(0, 5);
  }, [adminProducts]);

  useEffect(() => {
    setDisplayProducts(topProducts);
  }, [topProducts]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert('🔒 DEBES INICIAR SESIÓN\n\nPara agregar productos al carrito, primero inicia sesión en tu cuenta.');
      return;
    }
    
    if (product.stock === 0) {
      alert(`😔 AGOTADO\n\n"${product.title}" no está disponible en este momento.`);
      return;
    }
    
    const result = addToCart(product, 1);
    
    if (result.success) {
      setLastAddedProduct(product.id);
      setTimeout(() => setLastAddedProduct(null), 1000);
      
      const cartCount = calculateCartCount();
      alert(`🎉 ¡AGREGADO AL CARRITO!\n\n✅ "${product.title}"\n🎵 ${product.artist}\n💲 $${product.price.toFixed(2)}\n\n🛒 Ahora tienes ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'} en el carrito`);
    } else {
      alert(`❌ ERROR\n\n${result.message || 'No se pudo agregar al carrito'}`);
    }
  };

  const handleNavigation = (path, pageName) => {
    navigate(path);
  };

  // Determinar clase del botón
  const getButtonClass = (product) => {
    if (product.stock === 0) return 'btn-adaptivo btn-sin-stock';
    if (!isLoggedIn) return 'btn-adaptivo btn-sin-sesion';
    return 'btn-adaptivo btn-con-sesion';
  };

  return (
    <div id="main-store" className="content-view fade-in">
      <header className="hero-section text-center">
        <h1 className="logo-text-main">THE VAULT</h1>
        <p className="hero-subtitle">A Retrosound Store</p>
      </header>

      <div className="container">
        <div className="main-dashboard">
          <div className="top-five-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="dashboard-title">
                <i className="bi bi-fire me-2"></i>
                TOP 5 VAULT SELECTIONS
              </h6>
              <div className="text-light" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                {isLoggedIn ? `🛍️ ${calculateCartCount()} en carrito` : 'Destacados de la semana'}
              </div>
            </div>
            
            <div className="row row-cols-2 row-cols-lg-5 g-3" id="top-discos-container">
              {displayProducts.map((product, index) => (
                <div key={product.id} className="col">
                  <Link to={`/album/${product.id}`} className="text-decoration-none">
                    <div className={`format-item-card clickable-card ${lastAddedProduct === product.id ? 'item-added' : ''}`}
                         style={{ minHeight: '320px' }}>
                      
                      <div 
                        className="format-item-image" 
                        style={{
                          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${product.image}) center/cover no-repeat`,
                          height: '150px',
                          position: 'relative',
                          borderRadius: '8px 8px 0 0'
                        }}
                      >
                        {index === 0 && (
                          <span className="format-featured-badge" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                            ★ TOP PICK
                          </span>
                        )}
                        
                        <span className={`badge position-absolute bottom-0 start-0 m-2 ${
                          product.format === 'Vinyl' ? 'bg-pink' : 
                          product.format === 'CD' ? 'bg-blue' : 'bg-gold'
                        }`} style={{ fontSize: '0.65rem' }}>
                          {product.format}
                        </span>
                        
                        <span className="badge bg-dark position-absolute bottom-0 end-0 m-2" style={{ fontSize: '0.65rem' }}>
                          {product.year}
                        </span>
                      </div>
                      
                      <div className="format-item-info p-2">
                        <h6 className="format-item-title mb-1" style={{ 
                          fontSize: '0.85rem',
                          lineHeight: '1.2',
                          height: '2.4rem',
                          overflow: 'hidden',
                          color: '#fff'
                        }}>
                          {product.title.length > 30 ? `${product.title.substring(0, 30)}...` : product.title}
                        </h6>
                        
                        <p className="format-item-artist mb-2" style={{ 
                          color: '#e0e0e0',
                          fontSize: '0.75rem',
                          fontWeight: '300'
                        }}>
                          {product.artist}
                        </p>
                        
                        <div className="mb-2">
                          <span className="badge bg-dark" style={{ fontSize: '0.65rem' }}>
                            {product.genre?.split('/')[0]?.trim() || product.genre}
                          </span>
                          {product.heritage && (
                            <span className="badge bg-gold ms-1" style={{ fontSize: '0.65rem' }}>
                              <i className="bi bi-award me-1"></i>Heritage
                            </span>
                          )}
                        </div>
                        
                        <div className="format-item-footer mt-2">
                          <div>
                            <span className="format-item-price d-block" style={{ fontSize: '0.9rem' }}>
                              ${product.price.toFixed(2)}
                            </span>
                            <small className="text-light" style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                              {product.stock > 5 ? 'Disponible' : product.stock > 0 ? 'Últimas unidades' : 'Agotado'}
                            </small>
                          </div>
                          
                          <button 
                            className={getButtonClass(product)}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            {product.stock === 0 ? (
                              <i className="bi bi-x-circle" style={{ fontSize: '0.8rem' }}></i>
                            ) : !isLoggedIn ? (
                              <i className="bi bi-lock" style={{ fontSize: '0.8rem' }}></i>
                            ) : (
                              <i className="bi bi-cart-plus" style={{ fontSize: '0.8rem' }}></i>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <div className="nav-side-panel">
            <button 
              className="nav-btn btn-h"
              onClick={() => handleNavigation('/heritage', 'Heritage Collection')}
            >
              <i className="bi bi-shield-lock"></i>
              <span>HERITAGE</span>
              <small className="text-white mt-1" style={{ opacity: 0.9, fontWeight: 300 }}>
                Ediciones limitadas
              </small>
            </button>
            
            <button 
              className="nav-btn btn-f"
              onClick={() => handleNavigation('/formatos', 'Formatos disponibles')}
            >
              <i className="bi bi-disc"></i>
              <span>FORMATOS</span>
              <small className="text-white mt-1" style={{ opacity: 0.9, fontWeight: 300 }}>
                Todos los formatos
              </small>
            </button>
            
            <button 
              className="nav-btn btn-c"
              onClick={() => handleNavigation('/boveda', 'Bóveda completa')}
            >
              <i className="bi bi-collection-play"></i>
              <span>BÓVEDA</span>
              <small className="text-white mt-1" style={{ opacity: 0.9, fontWeight: 300 }}>
                Catálogo completo
              </small>
            </button>
          </div>
        </div>

        <div className="row g-4 my-5 text-center">
          <div className="col-md-4">
            <div className="info-card-white">
              <i className="bi bi-bullseye text-danger fs-1"></i>
              <h4>NUESTRA MISIÓN</h4>
              <p>Preservar la cultura musical física para el coleccionista moderno.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card-white card-border-blue">
              <i className="bi bi-eye text-primary fs-1"></i>
              <h4>NUESTRA VISIÓN</h4>
              <p>Ser la plataforma líder global en formatos físicos.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card-white">
              <i className="bi bi-gem text-warning fs-1"></i>
              <h4>VALORES</h4>
              <p>Autenticidad y pasión inquebrantable por el sonido.</p>
            </div>
          </div>
        </div>

        <div className="contact-section mb-5 p-4">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h2 className="text-pink bungee-font">CONTACTO</h2>
              <p className="text-white">
                <i className="bi bi-geo-alt-fill text-info me-2"></i> 
                Av. Generica #123, GDL
              </p>
              <p className="text-white">
                <i className="bi bi-envelope-at-fill text-info me-2"></i> 
                hello@retrosound.com
              </p>
            </div>
            <div className="col-md-7">
              <form className="bg-glass-form p-3">
                <input 
                  type="text" 
                  className="form-control-custom mb-2 text-white" 
                  placeholder="Nombre" 
                />
                <input 
                  type="email" 
                  className="form-control-custom mb-2 text-white" 
                  placeholder="Email" 
                />
                <textarea 
                  className="form-control-custom mb-2 text-white" 
                  placeholder="Mensaje"
                ></textarea>
                <button 
                  type="button"
                  className="btn btn-neon-solid w-100"
                  style={{
                    background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                    border: '2px solid #ff00ff',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  ENVIAR
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;