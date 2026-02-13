// src/components/Header.js - VERSIÓN CON VALIDACIÓN DE CARRITO
import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { 
    isLoggedIn, 
    currentUser, 
    isAdmin, 
    logout, 
    login, 
    register,
    calculateCartCount,
    cart
  } = useApp();
  
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ username_or_email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    name: '' 
  });
  const [activeTab, setActiveTab] = useState('login');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(calculateCartCount());
  }, [calculateCartCount, cart]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    
    if (!loginData.username_or_email.trim()) {
      setErrors({...errors, loginUser: 'Ingresa tu usuario o email'});
      return;
    }
    
    if (!loginData.password) {
      setErrors({...errors, loginPass: 'Ingresa tu contraseña'});
      return;
    }
    
    const result = login(loginData);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setLoginData({ username_or_email: '', password: '' });
      setTimeout(() => {
        setShowLoginModal(false);
        setSuccessMessage('');
      }, 1500);
    } else {
      setErrors({...errors, loginGeneral: result.message });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    
    // Validaciones
    const newErrors = {};
    
    if (!registerData.username.trim()) {
      newErrors.registerUser = 'Ingresa un nombre de usuario';
    } else if (registerData.username.length < 3) {
      newErrors.registerUser = 'Mínimo 3 caracteres';
    }
    
    if (!registerData.email.trim()) {
      newErrors.registerEmail = 'Ingresa tu email';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.registerEmail = 'Email inválido';
    }
    
    if (!registerData.password) {
      newErrors.registerPass = 'Ingresa una contraseña';
    } else if (registerData.password.length < 6) {
      newErrors.registerPass = 'Mínimo 6 caracteres';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.registerConfirm = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = register(registerData);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setRegisterData({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        name: '' 
      });
      setTimeout(() => {
        setShowLoginModal(false);
        setSuccessMessage('');
      }, 1500);
    } else {
      setErrors({...errors, registerGeneral: result.message });
    }
  };

  const handleLogout = () => {
    logout();
    alert('👋 Sesión cerrada correctamente');
  };

  // ========== FUNCIÓN PARA MANEJAR CLICK EN CARRITO ==========
  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      e.stopPropagation();
      
      // Mostrar alerta y opción de login
      const userWantsLogin = window.confirm(
        '🔒 CARRITO NO DISPONIBLE\n\n' +
        'Para acceder a tu carrito y guardar productos, necesitas iniciar sesión.\n\n' +
        '¿Quieres iniciar sesión ahora?'
      );
      
      if (userWantsLogin) {
        setShowLoginModal(true);
      }
      
      return false;
    }
    
    // Si está logueado, navegar normalmente
    navigate('/cart');
  };

  return (
    <>
      <nav className="top-access">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="brand-master">
            <span className="logo-brand">RETROSOUND</span>
          </Link>
          
          <div className="d-flex align-items-center gap-4">
            {/* INICIO */}
            <Link 
              to="/" 
              className="text-white fw-bold text-decoration-none fs-5 px-3"
              style={{
                transition: 'all 0.3s',
                padding: '8px 16px',
                borderRadius: '5px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              INICIO
            </Link>
            
            {/* ADMIN LINK (solo para admins) */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-white fw-bold text-decoration-none fs-6 px-3"
                style={{
                  background: 'rgba(212, 175, 55, 0.2)',
                  borderRadius: '5px',
                  padding: '5px 15px',
                  border: '1px solid var(--heritage-gold)'
                }}
              >
                <i className="bi bi-shield-lock me-2"></i>
                ADMIN
              </Link>
            )}
            
            {/* ========== CARRITO CON VALIDACIÓN ========== */}
            {isLoggedIn ? (
              // CARRITO NORMAL (cuando hay sesión)
              <Link 
                to="/cart" 
                className="btn position-relative d-flex align-items-center gap-2 px-4 cart-btn"
                style={{
                  background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  padding: '8px 20px',
                  boxShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
                  transition: 'all 0.3s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.boxShadow = '0 0 10px rgba(255, 0, 255, 0.5)'}
                title={cartCount > 0 ? `Ver carrito (${cartCount} productos)` : 'Ver carrito'}
              >
                <i className="bi bi-cart4 fs-5"></i>
                <span>CARRITO</span>
                {cartCount > 0 && (
                  <span 
                    className="badge-cart"
                    style={{
                      background: '#00F2FF',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            ) : (
              // BOTÓN CARRITO CON VALIDACIÓN (cuando NO hay sesión)
              <button 
                className="btn position-relative d-flex align-items-center gap-2 px-4 cart-btn"
                onClick={handleCartClick}
                style={{
                  background: 'linear-gradient(45deg, #666, #444)',
                  color: '#aaa',
                  fontWeight: 'bold',
                  border: 'none',
                  padding: '8px 20px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #777, #555)';
                  e.target.style.color = '#ccc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #666, #444)';
                  e.target.style.color = '#aaa';
                }}
                title="Inicia sesión para ver el carrito"
              >
                <i className="bi bi-cart4 fs-5"></i>
                <span>CARRITO</span>
                <i 
                  className="bi bi-lock ms-1" 
                  style={{ fontSize: '0.8rem' }}
                ></i>
              </button>
            )}
            
            {/* LOGIN/LOGOUT */}
            <div className="d-flex align-items-center gap-3">
              {isLoggedIn && currentUser && (
                <div 
                  className="d-flex align-items-center user-info"
                  title={`${currentUser.username}${isAdmin ? ' (Administrador)' : ''}`}
                  style={{ cursor: 'help' }}
                >
                  <i className="bi bi-person-circle text-white me-2"></i>
                  <span 
                    className="text-white fw-bold"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {currentUser.username}
                    {isAdmin && (
                      <i className="bi bi-star-fill text-warning ms-1" style={{ fontSize: '0.7rem' }}></i>
                    )}
                  </span>
                </div>
              )}
              
              {isLoggedIn ? (
                <button 
                  className="btn px-4 logout-btn"
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '2px solid var(--neon-blue)',
                    color: 'var(--neon-blue)',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--neon-blue)';
                    e.target.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--neon-blue)';
                  }}
                  title="Cerrar sesión"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  SALIR
                </button>
              ) : (
                <button 
                  className="btn text-white fw-bold px-4 login-btn"
                  onClick={() => setShowLoginModal(true)}
                  style={{
                    background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                    border: 'none',
                    padding: '8px 24px',
                    boxShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.8)'}
                  onMouseLeave={(e) => e.target.style.boxShadow = '0 0 10px rgba(255, 0, 255, 0.5)'}
                  title="Iniciar sesión / Crear cuenta"
                >
                  <i className="bi bi-person me-2"></i>
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MODAL LOGIN/REGISTRO */}
      {showLoginModal && (
        <div className="modal show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.95)', 
          zIndex: 1050,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-neon-pink">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title text-white bungee-font">
                  <i className="bi bi-vinyl-fill me-2 text-pink"></i>
                  ACCESO RETROSOUND VAULT
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowLoginModal(false);
                    setErrors({});
                    setSuccessMessage('');
                  }}
                ></button>
              </div>
              
              <div className="modal-body p-4">
                {successMessage && (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {successMessage}
                  </div>
                )}
                
                {/* Pestañas */}
                <div className="login-tabs mb-4">
                  <button 
                    className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('login');
                      setErrors({});
                      setSuccessMessage('');
                    }}
                  >
                    <i className="bi bi-key me-2"></i>
                    INICIAR SESIÓN
                  </button>
                  <button 
                    className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('register');
                      setErrors({});
                      setSuccessMessage('');
                    }}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    CREAR CUENTA
                  </button>
                </div>

                {/* LOGIN FORM */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLogin}>
                    {errors.loginGeneral && (
                      <div className="alert alert-danger">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {errors.loginGeneral}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="form-label text-white">
                        <i className="bi bi-person-badge me-2 text-blue"></i>
                        Usuario o Email
                      </label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.loginUser ? 'is-invalid' : ''}`}
                        style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
                        placeholder="Ej: admin o admin@retrosound.com"
                        value={loginData.username_or_email}
                        onChange={(e) => setLoginData({...loginData, username_or_email: e.target.value})}
                      />
                      {errors.loginUser && (
                        <div className="invalid-feedback d-block text-danger">
                          {errors.loginUser}
                        </div>
                      )}
                      <small className="text-muted">
                        Demo: admin / admin123
                      </small>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label text-white">
                        <i className="bi bi-lock me-2 text-blue"></i>
                        Contraseña
                      </label>
                      <input 
                        type="password" 
                        className={`form-control ${errors.loginPass ? 'is-invalid' : ''}`}
                        style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      />
                      {errors.loginPass && (
                        <div className="invalid-feedback d-block text-danger">
                          {errors.loginPass}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn w-100 py-2 fw-bold mb-3"
                      style={{
                        background: 'linear-gradient(45deg, #ff00ff, #ff007f)',
                        border: 'none',
                        color: 'white',
                        boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      INICIAR SESIÓN
                    </button>
                  </form>
                )}

                {/* REGISTER FORM */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegister}>
                    {errors.registerGeneral && (
                      <div className="alert alert-danger">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {errors.registerGeneral}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="form-label text-white">
                        <i className="bi bi-person-circle me-2 text-blue"></i>
                        Nombre de Usuario
                      </label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.registerUser ? 'is-invalid' : ''}`}
                        style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
                        placeholder="Elige un nombre único"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      />
                      {errors.registerUser && (
                        <div className="invalid-feedback d-block text-danger">
                          {errors.registerUser}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-white">
                        <i className="bi bi-envelope me-2 text-blue"></i>
                        Email
                      </label>
                      <input 
                        type="email" 
                        className={`form-control ${errors.registerEmail ? 'is-invalid' : ''}`}
                        style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
                        placeholder="tu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      />
                      {errors.registerEmail && (
                        <div className="invalid-feedback d-block text-danger">
                          {errors.registerEmail}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-white">
                        <i className="bi bi-lock me-2 text-blue"></i>
                        Contraseña
                      </label>
                      <input 
                        type="password" 
                        className={`form-control ${errors.registerPass ? 'is-invalid' : ''}`}
                        style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
                        placeholder="Mínimo 6 caracteres"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      />
                      {errors.registerPass && (
                        <div className="invalid-feedback d-block text-danger">
                          {errors.registerPass}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label text-white">
                        <i className="bi bi-lock-fill me-2 text-blue"></i>
                        Confirmar Contraseña
                      </label>
                      <input 
                        type="password" 
                        className={`form-control ${errors.registerConfirm ? 'is-invalid' : ''}`}
                        style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
                        placeholder="Repite la contraseña"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      />
                      {errors.registerConfirm && (
                        <div className="invalid-feedback d-block text-danger">
                          {errors.registerConfirm}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn w-100 py-2 fw-bold mb-3"
                      style={{
                        background: 'linear-gradient(45deg, #00ccff, #0099ff)',
                        border: '2px solid #00ccff',
                        color: 'white',
                        boxShadow: '0 0 15px rgba(0, 204, 255, 0.5)'
                      }}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      CREAR CUENTA
                    </button>
                  </form>
                )}
                
                {/* INFO */}
                <div className="mt-4 text-center">
                  <p className="text-light small">
                    <i className="bi bi-info-circle me-1"></i>
                    Necesitas una cuenta para agregar al carrito y proceder al pago.
                  </p>
                  <p className="text-muted small">
                    <strong>Credenciales demo:</strong><br />
                    Admin: admin / admin123<br />
                    Usuario: coleccionista / coleccion123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;