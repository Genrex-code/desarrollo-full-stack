// src/context/AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { discosService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- ESTADOS ---
  const [adminProducts, setAdminProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Usuarios demo (por si falla la conexión a la DB)
  const demoUsers = [
    { id: 1, username: 'admin', email: 'admin@retrosound.com', password: 'admin123', isAdmin: true },
    { id: 2, username: 'coleccionista', email: 'user@retrosound.com', password: 'coleccion123', isAdmin: false }
  ];

  // --- 1. CARGA INICIAL DE DATOS (API Y LOCALSTORAGE) ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Iniciando carga de la Bóveda...');
        
        // Cargar discos desde tu API (MySQL)
        const data = await discosService.getAll();
        setAdminProducts(data);
        
        // Cargar Sesión
        const savedUser = localStorage.getItem('retrosound_user');
        const savedLogin = localStorage.getItem('retrosound_loggedIn') === 'true';
        if (savedLogin && savedUser) {
          const user = JSON.parse(savedUser);
          setIsLoggedIn(true);
          setCurrentUser(user);
          setIsAdmin(user.isAdmin || false);
        }
        
        // Cargar Carrito y Órdenes
        setCart(JSON.parse(localStorage.getItem('retrosound_cart') || '[]'));
        setOrders(JSON.parse(localStorage.getItem('retrosound_orders') || '[]'));

      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // --- 2. EFECTOS PARA GUARDAR CAMBIOS ---
  useEffect(() => {
    localStorage.setItem('retrosound_cart', JSON.stringify(cart));
  }, [cart]);

  // --- 3. FUNCIONES DE AUTENTICACIÓN ---
  const login = (credentials) => {
    // Aquí podrías conectar con tu API /login, por ahora usamos los demo o locales
    const users = JSON.parse(localStorage.getItem('retrosound_demoUsers') || JSON.stringify(demoUsers));
    const user = users.find(u => 
      (u.username === credentials.username_or_email || u.email === credentials.username_or_email) &&
      u.password === credentials.password
    );
    
    if (!user) return { success: false, message: 'Credenciales incorrectas' };
    
    const userData = { ...user };
    setIsLoggedIn(true);
    setCurrentUser(userData);
    setIsAdmin(userData.isAdmin);
    
    localStorage.setItem('retrosound_user', JSON.stringify(userData));
    localStorage.setItem('retrosound_loggedIn', 'true');
    localStorage.setItem('retrosound_isAdmin', userData.isAdmin ? 'true' : 'false');
    
    return { success: true, user: userData };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('retrosound_user');
    localStorage.setItem('retrosound_loggedIn', 'false');
    return { success: true };
  };

  const register = (userData) => {
    // Lógica simple de registro local
    const newUser = { id: Date.now(), ...userData, isAdmin: false };
    localStorage.setItem('retrosound_user', JSON.stringify(newUser));
    return { success: true };
  };

  // --- 4. FUNCIONES DEL CARRITO ---
  const addToCart = (product, quantity = 1) => {
    if (!isLoggedIn) return { success: false, message: 'Inicia sesión primero' };
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    return { success: true };
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateCartQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  // --- 5. CÁLCULOS ---
  const calculateCartTotal = () => cart.reduce((t, i) => t + (i.price * i.quantity), 0);
  const calculateCartCount = () => cart.reduce((c, i) => c + i.quantity, 0);

  // --- 6. FUNCIONES DE ADMIN (MOCK) ---
  const addProduct = (p) => setAdminProducts([...adminProducts, { ...p, id: Date.now() }]);
  const deleteProduct = (id) => setAdminProducts(adminProducts.filter(p => p.id !== id));

  return (
    <AppContext.Provider
      value={{
        isLoggedIn, currentUser, cart, adminProducts, isAdmin, orders, loading,
        login, register, logout,
        addToCart, removeFromCart, updateCartQuantity, clearCart,
        addProduct, deleteProduct,
        calculateCartTotal, calculateCartCount,
        calculateCartTax: () => calculateCartTotal() * 0.16,
        calculateCartShipping: () => cart.length > 0 ? 5.99 : 0,
        calculateCartGrandTotal: () => calculateCartTotal() * 1.16 + (cart.length > 0 ? 5.99 : 0)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);