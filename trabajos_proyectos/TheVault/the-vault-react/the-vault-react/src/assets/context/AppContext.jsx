// src/context/AppContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { discosService } from '../services/api';

const AppContext = createContext();

// URL base del backend
const API_URL = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
  const [adminProducts, setAdminProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await discosService.getAll();
        setAdminProducts(data);
        
        const savedUser = localStorage.getItem('retrosound_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setIsLoggedIn(true);
          setCurrentUser(user);
          setIsAdmin(user.isAdmin || false);
        }
        
        const savedCart = localStorage.getItem('retrosound_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('retrosound_cart', JSON.stringify(cart));
  }, [cart]);

  // LOGIN con URL completa
  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.ok) {
        const user = data.user;
        setIsLoggedIn(true);
        setCurrentUser(user);
        setIsAdmin(user.isAdmin);
        localStorage.setItem('retrosound_user', JSON.stringify(user));
        return { 
          success: true, 
          message: `Bienvenido ${user.username}!` 
        };
      } else {
        return { 
          success: false, 
          message: data.error || "Credenciales incorrectas" 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: "Error de conexión con el servidor" 
      };
    }
  };

  // REGISTRO con URL completa
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          nombre: userData.name || userData.username
        })
      });

      const data = await response.json();

      if (data.ok) {
        return { 
          success: true, 
          message: "Cuenta creada! Ahora inicia sesión." 
        };
      } else {
        return { 
          success: false, 
          message: data.error || "Error al registrar" 
        };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { 
        success: false, 
        message: "Error de conexión con el servidor" 
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('retrosound_user');
    localStorage.removeItem('retrosound_cart');
    return { success: true };
  };

  const addProduct = async (productData) => {
    try {
      const datosParaDB = {
        titulo: productData.title,
        artista: productData.artist,
        genero: productData.genre,
        formato: productData.format,
        imagen_path: productData.image,
        anio: productData.year,
        descripcion: productData.description,
        top: productData.featured ? 1 : 0,
        precio: productData.price || 25.00,
        stock: productData.stock || 10,
        heritage: productData.heritage ? 1 : 0,
        tracks: productData.tracks || 10,
        duration: productData.duration || '45:00',
        sku: productData.sku || `VAULT-${Date.now()}`,
        edition: productData.edition || null,
        admin: true
      };

      const response = await fetch(`${API_URL}/discos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaDB), 
      });

      const data = await response.json();

      if (data.ok) {
        const updatedDiscos = await discosService.getAll();
        setAdminProducts(updatedDiscos);
        return { success: true };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error("Error en POST:", error);
      return { success: false, message: "Error de conexión" };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const datosParaDB = {
        titulo: productData.title,
        artista: productData.artist,
        genero: productData.genre,
        formato: productData.format,
        imagen_path: productData.image,
        anio: productData.year,
        descripcion: productData.description,
        top: productData.featured ? 1 : 0,
        precio: productData.price || 25.00,
        stock: productData.stock || 10,
        heritage: productData.heritage ? 1 : 0,
        tracks: productData.tracks || 10,
        duration: productData.duration || '45:00',
        sku: productData.sku || `VAULT-${id}`,
        edition: productData.edition || null,
        admin: true
      };

      const response = await fetch(`${API_URL}/discos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaDB), 
      });

      const data = await response.json();

      if (data.ok) {
        const updatedDiscos = await discosService.getAll();
        setAdminProducts(updatedDiscos);
        return { success: true };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error("Error en PUT:", error);
      return { success: false, message: "Error de conexión" };
    }
  };

  const deleteProduct = async (id) => {
    if(!window.confirm("¿Borrar disco?")) return;
    try {
      const response = await fetch(`${API_URL}/discos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin: true })
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setAdminProducts(prev => prev.filter(p => p.id !== id));
        return { success: true };
      } else {
        return { success: false, message: data.error };
      }
    } catch (e) { 
      console.error(e); 
      return { success: false, message: "Error de conexión" };
    }
  };

  // ===== FUNCIONES DEL CARRITO =====
  
  const addToCart = (product, quantity = 1) => {
    if (!isLoggedIn) {
      return { success: false, message: "Debes iniciar sesión" };
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    
    return { success: true };
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cálculos del carrito
  const calculateCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const calculateCartTax = useCallback(() => {
    const subtotal = calculateCartTotal();
    return subtotal * 0.16; // 16% IVA
  }, [calculateCartTotal]);

  const calculateCartShipping = useCallback(() => {
    const subtotal = calculateCartTotal();
    if (subtotal === 0) return 0;
    if (subtotal > 1000) return 0; // Envío gratis para compras mayores a $1000
    return 99; // Costo fijo de envío
  }, [calculateCartTotal]);

  const calculateCartGrandTotal = useCallback(() => {
    return calculateCartTotal() + calculateCartTax() + calculateCartShipping();
  }, [calculateCartTotal, calculateCartTax, calculateCartShipping]);

  const calculateCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Procesar pago (simulación)
  const processPayment = useCallback(async (paymentDetails) => {
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar orden ficticia
    const orderResult = {
      success: true,
      orderId: Math.floor(Math.random() * 1000000),
      trackingNumber: `TRK${Math.floor(Math.random() * 10000000)}`,
      total: calculateCartGrandTotal(),
      date: new Date().toISOString(),
      ...paymentDetails
    };
    
    // Limpiar carrito después del pago exitoso
    clearCart();
    
    return orderResult;
  }, [calculateCartGrandTotal, clearCart]);

  return (
    <AppContext.Provider
      value={{
        // Estados existentes
        isLoggedIn,
        currentUser,
        cart,
        adminProducts,
        isAdmin,
        loading,
        
        // Auth
        login,
        logout,
        register,
        
        // Productos
        addProduct,
        updateProduct,
        deleteProduct,
        
        // Carrito
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        
        // Cálculos del carrito 
        calculateCartTotal,
        calculateCartTax,
        calculateCartShipping,
        calculateCartGrandTotal,
        calculateCartCount,
        
        // Pago 
        processPayment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);