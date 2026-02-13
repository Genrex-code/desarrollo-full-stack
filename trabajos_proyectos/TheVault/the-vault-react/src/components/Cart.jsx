// src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { 
    cart, 
    isLoggedIn, 
    currentUser,
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    calculateCartTotal,
    calculateCartTax,
    calculateCartShipping,
    calculateCartGrandTotal,
    processPayment
  } = useApp();
  
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    zipCode: '',
    country: 'México'
  });
  const [processing, setProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert('⚠️ Debes iniciar sesión para proceder al pago');
      return;
    }
    
    setCheckoutStep('shipping');
  };

  const handleShippingSubmit = () => {
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
      alert('Completa todos los datos de pago');
      return;
    }
    
    setProcessing(true);
    
    try {
      const result = await processPayment({
        method: 'Tarjeta de crédito',
        last4: paymentData.cardNumber.slice(-4),
        shippingAddress: shippingData
      });
      
      setOrderResult(result);
      setCheckoutStep('confirmation');
    } catch (error) {
      alert('Error procesando el pago: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  if (checkoutStep === 'confirmation' && orderResult) {
    return (
      <div className="content-view fade-in">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="cart-container text-center py-5">
                <div className="py-5">
                  <div className="mb-4">
                    <div className="checkmark-circle">
                      <div className="background"></div>
                      <div className="checkmark draw"></div>
                    </div>
                  </div>
                  
                  <h1 className="text-white bungee-font mb-3">¡PAGO EXITOSO!</h1>
                  <p className="text-light fs-5 mb-4">
                    Tu orden ha sido procesada correctamente
                  </p>
                  
                  <div className="alert alert-success mb-4">
                    <h4 className="alert-heading">
                      <i className="bi bi-receipt me-2"></i>
                      Orden #{orderResult.orderId}
                    </h4>
                    <p className="mb-0">
                      Número de seguimiento: <strong>{orderResult.trackingNumber}</strong>
                    </p>
                    <hr />
                    <p className="mb-0">
                      Total pagado: <strong>${orderResult.total.toFixed(2)}</strong>
                    </p>
                  </div>
                  
                  <div className="row text-start mb-4">
                    <div className="col-md-6">
                      <h5 className="text-white mb-3">
                        <i className="bi bi-truck me-2"></i>
                        Envío a:
                      </h5>
                      <div className="bg-dark p-3 rounded">
                        <p className="text-light mb-1">
                          <strong>{shippingData.address}</strong>
                        </p>
                        <p className="text-light mb-1">
                          {shippingData.city}, {shippingData.zipCode}
                        </p>
                        <p className="text-light">{shippingData.country}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h5 className="text-white mb-3">
                        <i className="bi bi-clock-history me-2"></i>
                        Estimado de entrega:
                      </h5>
                      <div className="bg-dark p-3 rounded">
                        <p className="text-light">
                          <strong>3-5 días hábiles</strong>
                        </p>
                        <p className="text-muted small">
                          Recibirás un correo con actualizaciones
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <Link 
                      to="/"
                      className="btn"
                      style={{
                        background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                        border: '2px solid #ff00ff',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '12px 30px'
                      }}
                    >
                      <i className="bi bi-house me-2"></i>
                      VOLVER AL INICIO
                    </Link>
                    
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => window.print()}
                    >
                      <i className="bi bi-printer me-2"></i>
                      IMPRIMIR RECIBO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'payment') {
    return (
      <div className="content-view fade-in">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="cart-container p-4">
                <div className="d-flex align-items-center mb-4">
                  <button 
                    className="btn btn-link text-white me-3"
                    onClick={() => setCheckoutStep('shipping')}
                  >
                    <i className="bi bi-arrow-left"></i>
                  </button>
                  <h2 className="text-white bungee-font mb-0">
                    <i className="bi bi-credit-card me-3"></i>
                    INFORMACIÓN DE PAGO
                  </h2>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="card bg-dark text-white border-secondary mb-4">
                      <div className="card-header">
                        <h5 className="mb-0">Detalles de la tarjeta</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label text-white">Número de tarjeta</label>
                          <input 
                            type="text" 
                            className="form-control bg-darker text-white"
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData({
                              ...paymentData,
                              cardNumber: formatCardNumber(e.target.value)
                            })}
                            maxLength="19"
                          />
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label text-white">Fecha de expiración</label>
                            <input 
                              type="text" 
                              className="form-control bg-darker text-white"
                              placeholder="MM/AA"
                              value={paymentData.expiry}
                              onChange={(e) => setPaymentData({
                                ...paymentData,
                                expiry: e.target.value
                              })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-white">CVV</label>
                            <input 
                              type="text" 
                              className="form-control bg-darker text-white"
                              placeholder="123"
                              value={paymentData.cvv}
                              onChange={(e) => setPaymentData({
                                ...paymentData,
                                cvv: e.target.value
                              })}
                              maxLength="3"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3 mt-3">
                          <label className="form-label text-white">Nombre en la tarjeta</label>
                          <input 
                            type="text" 
                            className="form-control bg-darker text-white"
                            placeholder={currentUser?.name || 'Nombre completo'}
                            value={paymentData.name}
                            onChange={(e) => setPaymentData({
                              ...paymentData,
                              name: e.target.value
                            })}
                          />
                        </div>
                        
                        <div className="form-check mt-4">
                          <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="saveCard"
                          />
                          <label className="form-check-label text-white" htmlFor="saveCard">
                            Guardar tarjeta para futuras compras
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card bg-dark text-white border-secondary">
                      <div className="card-header">
                        <h5 className="mb-0">
                          <i className="bi bi-shield-check me-2 text-success"></i>
                          Pago seguro
                        </h5>
                      </div>
                      <div className="card-body">
                        <p className="text-light small">
                          <i className="bi bi-lock-fill me-2"></i>
                          Tu información está encriptada y protegida.
                        </p>
                        <div className="d-flex gap-2">
                          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" height="30" />
                          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" height="30" />
                          <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" height="30" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="cart-total-container p-4 sticky-top">
                      <h4 className="text-white bungee-font mb-4">
                        <i className="bi bi-receipt me-2"></i>
                        RESUMEN
                      </h4>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-light">Subtotal</span>
                          <span className="text-light">${calculateCartTotal().toFixed(2)}</span>
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-light">Envío</span>
                          <span className="text-light">${calculateCartShipping().toFixed(2)}</span>
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-light">IVA (16%)</span>
                          <span className="text-light">${calculateCartTax().toFixed(2)}</span>
                        </div>
                        
                        <hr className="border-secondary my-3" />
                        
                        <div className="d-flex justify-content-between">
                          <span className="text-white fw-bold fs-5">TOTAL</span>
                          <span className="text-success fw-bold fs-5">
                            ${calculateCartGrandTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        className="btn w-100 py-3 fw-bold mt-3"
                        onClick={handlePaymentSubmit}
                        disabled={processing}
                        style={{
                          background: processing 
                            ? 'linear-gradient(45deg, #666, #444)' 
                            : 'linear-gradient(45deg, #00ff88, #00cc66)',
                          border: 'none',
                          color: 'white',
                          opacity: processing ? 0.7 : 1
                        }}
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            PROCESANDO PAGO...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lock-fill me-2"></i>
                            PAGAR ${calculateCartGrandTotal().toFixed(2)}
                          </>
                        )}
                      </button>
                      
                      <p className="text-center text-muted small mt-3">
                        <i className="bi bi-info-circle me-1"></i>
                        Esta es una simulación. No se realizará ningún cargo real.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'shipping') {
    return (
      <div className="content-view fade-in">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="cart-container p-4">
                <div className="d-flex align-items-center mb-4">
                  <button 
                    className="btn btn-link text-white me-3"
                    onClick={() => setCheckoutStep('cart')}
                  >
                    <i className="bi bi-arrow-left"></i>
                  </button>
                  <h2 className="text-white bungee-font mb-0">
                    <i className="bi bi-geo-alt me-3"></i>
                    DIRECCIÓN DE ENVÍO
                  </h2>
                </div>
                
                <div className="row">
                  <div className="col-md-8">
                    <div className="card bg-dark text-white border-secondary mb-4">
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label text-white">Dirección</label>
                          <input 
                            type="text" 
                            className="form-control bg-darker text-white"
                            placeholder="Calle y número"
                            value={shippingData.address}
                            onChange={(e) => setShippingData({
                              ...shippingData,
                              address: e.target.value
                            })}
                          />
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label text-white">Ciudad</label>
                            <input 
                              type="text" 
                              className="form-control bg-darker text-white"
                              placeholder="Ciudad"
                              value={shippingData.city}
                              onChange={(e) => setShippingData({
                                ...shippingData,
                                city: e.target.value
                              })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-white">Código Postal</label>
                            <input 
                              type="text" 
                              className="form-control bg-darker text-white"
                              placeholder="CP"
                              value={shippingData.zipCode}
                              onChange={(e) => setShippingData({
                                ...shippingData,
                                zipCode: e.target.value
                              })}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label text-white">País</label>
                          <select 
                            className="form-select bg-darker text-white"
                            value={shippingData.country}
                            onChange={(e) => setShippingData({
                              ...shippingData,
                              country: e.target.value
                            })}
                          >
                            <option value="México">México</option>
                            <option value="Estados Unidos">Estados Unidos</option>
                            <option value="España">España</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Argentina">Argentina</option>
                          </select>
                        </div>
                        
                        <div className="form-check mt-4">
                          <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="saveAddress"
                          />
                          <label className="form-check-label text-white" htmlFor="saveAddress">
                            Guardar esta dirección
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      <button 
                        className="btn btn-outline-light"
                        onClick={() => setCheckoutStep('cart')}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        VOLVER AL CARRITO
                      </button>
                      
                      <button 
                        className="btn"
                        onClick={handleShippingSubmit}
                        style={{
                          background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                          border: 'none',
                          color: 'white',
                          padding: '10px 30px'
                        }}
                      >
                        CONTINUAR AL PAGO
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="cart-total-container p-4">
                      <h5 className="text-white mb-3">Resumen del pedido</h5>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-light">Productos</span>
                        <span className="text-light">{cart.length}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-light">Total</span>
                        <span className="text-success">${calculateCartGrandTotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="border-top border-secondary pt-3">
                        <p className="text-light small">
                          <i className="bi bi-truck me-2"></i>
                          Envío estándar: 3-5 días
                        </p>
                        <p className="text-light small">
                          <i className="bi bi-shield-check me-2"></i>
                          Garantía de entrega
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista normal del carrito
  return (
    <div className="content-view fade-in">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-white bungee-font">
            <i className="bi bi-cart4 me-3 text-pink"></i>
            TU CARRITO
          </h1>
          {cart.length > 0 && (
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
                  clearCart();
                }
              }}
            >
              <i className="bi bi-trash me-2"></i>
              Vaciar Carrito
            </button>
          )}
        </div>
        
        {cart.length === 0 ? (
          <div className="cart-container text-center py-5">
            <div className="py-5">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
              <h3 className="text-white mt-4">Tu carrito está vacío</h3>
              <p className="text-muted">Agrega algunos productos para comenzar</p>
              
              <Link 
                to="/"
                className="btn mt-4"
                style={{
                  background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                  border: '2px solid #ff00ff',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 40px',
                  fontSize: '1.1rem',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)'
                }}
              >
                <i className="bi bi-shop me-2"></i>
                EXPLORAR TIENDA
              </Link>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Lista de productos */}
            <div className="col-lg-8">
              <div className="cart-container">
                {cart.map(item => (
                  <div key={item.id} className="cart-item border-bottom border-secondary pb-4 mb-4">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <div 
                          className="rounded p-2 text-center"
                          style={{ 
                            background: `url(${item.image}) center/cover`,
                            height: '80px',
                            width: '80px'
                          }}
                        >
                        </div>
                      </div>
                      
                      <div className="col-md-5">
                        <h5 className="text-white mb-1">{item.title}</h5>
                        <p className="text-muted mb-1">{item.artist}</p>
                        <span className="badge bg-dark text-info">{item.format}</span>
                      </div>
                      
                      <div className="col-md-3">
                        <div className="input-group input-group-sm" style={{ width: '120px' }}>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          
                          <input 
                            type="text" 
                            className="form-control text-center bg-dark text-white border-secondary"
                            value={item.quantity}
                            readOnly
                          />
                          
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-2 text-end">
                        <h5 className="text-success mb-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </h5>
                        <small className="text-muted">
                          ${item.price.toFixed(2)} c/u
                        </small>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-end">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resumen */}
            <div className="col-lg-4">
              <div className="cart-total-container p-4 sticky-top">
                <h4 className="text-white bungee-font mb-4">
                  <i className="bi bi-receipt me-2"></i>
                  RESUMEN DEL PEDIDO
                </h4>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Subtotal</span>
                    <span className="text-light">
                      ${calculateCartTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Envío</span>
                    <span className="text-light">
                      ${calculateCartShipping().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">IVA (16%)</span>
                    <span className="text-light">
                      ${calculateCartTax().toFixed(2)}
                    </span>
                  </div>
                  
                  <hr className="border-secondary my-3" />
                  
                  <div className="d-flex justify-content-between">
                    <span className="text-white fw-bold fs-5">TOTAL</span>
                    <span className="text-success fw-bold fs-5">
                      ${calculateCartGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {!isLoggedIn && (
                  <div className="alert alert-warning mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Inicia sesión para pagar</strong>
                    <p className="mb-0 small mt-1">
                      Necesitas una cuenta para completar tu compra.
                    </p>
                  </div>
                )}
                
                <div className="d-flex flex-column gap-3 mt-4">
                  <Link 
                    to="/"
                    className="btn text-center py-3 fw-bold"
                    style={{
                      background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                      border: '2px solid #ff00ff',
                      color: 'white',
                      boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
                      textDecoration: 'none'
                    }}
                  >
                    <i className="bi bi-shop me-2"></i>
                    SEGUIR EXPLORANDO
                  </Link>
                  
                  <button 
                    className="btn text-center py-3 fw-bold"
                    onClick={handleCheckout}
                    disabled={!isLoggedIn}
                    style={{
                      background: isLoggedIn
                        ? 'linear-gradient(45deg, #00ff88, #00cc66)'
                        : 'linear-gradient(45deg, #666, #444)',
                      border: `2px solid ${isLoggedIn ? '#00ff88' : '#666'}`,
                      color: 'white',
                      boxShadow: isLoggedIn 
                        ? '0 0 15px rgba(0, 255, 136, 0.5)'
                        : 'none',
                      opacity: isLoggedIn ? 1 : 0.6,
                      cursor: isLoggedIn ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <i className={`bi ${isLoggedIn ? 'bi-lock-fill' : 'bi-lock'} me-2`}></i>
                    {isLoggedIn ? 'PROCEDER AL PAGO' : 'INICIA SESIÓN PARA PAGAR'}
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Pago 100% seguro · Envío garantizado
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;