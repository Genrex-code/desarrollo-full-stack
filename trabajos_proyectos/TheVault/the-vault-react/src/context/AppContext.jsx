// src/context/AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

// ========== INVENTARIO COMPLETO ==========
const initialProducts = [
  // ===== INVENTARIO PRINCIPAL =====
  {
    id: 1,
    title: "Ritchie Blackmore's Rainbow",
    artist: "Rainbow",
    year: 1975,
    genre: "Hard Rock / Heavy Metal",
    format: "Cassette",
    price: 28.00,
    image: "/assets/albums/RAINBOWCASTTE.jpg",
    description: "Álbum debut de Rainbow con Ritchie Blackmore.",
    featured: false,
    stock: 15,
    sku: "CAS-1975-001",
    tracks: 8,
    duration: "42:15",
    heritage: false
  },
  {
    id: 2,
    title: "Mellon Collie and the Infinite Sadness",
    artist: "The Smashing Pumpkins",
    year: 1995,
    genre: "Alternative Rock",
    format: "Vinyl",
    price: 45.00,
    image: "/assets/albums/mellon_collie.jpg",
    description: "Doble álbum conceptual del rock alternativo.",
    featured: false,
    stock: 8,
    sku: "VIN-1995-002",
    tracks: 28,
    duration: "121:50",
    heritage: false
  },
  {
    id: 3,
    title: "Let It Be",
    artist: "The Beatles",
    year: 1970,
    genre: "Rock",
    format: "Vinyl",
    price: 40.00,
    image: "/assets/albums/let_it_be.jpg",
    description: "Último álbum de estudio de The Beatles.",
    featured: false,
    stock: 12,
    sku: "VIN-1970-003",
    tracks: 12,
    duration: "35:10",
    heritage: false
  },
  {
    id: 4,
    title: "Definitely Maybe",
    artist: "Oasis",
    year: 1994,
    genre: "Britpop / Rock",
    format: "Vinyl",
    price: 38.00,
    image: "/assets/albums/DEFINITELYVYNIL1.jpg",
    description: "Álbum debut de Oasis que definió el Britpop.",
    featured: false,
    stock: 10,
    sku: "VIN-1994-004",
    tracks: 11,
    duration: "51:43",
    heritage: false
  },
  {
    id: 5,
    title: "Ballbreaker",
    artist: "AC/DC",
    year: 1995,
    genre: "Hard Rock",
    format: "CD",
    price: 27.00,
    image: "/assets/albums/ballbreaker.jpg",
    description: "Duodécimo álbum de estudio de AC/DC.",
    featured: false,
    stock: 14,
    sku: "CD-1995-005",
    tracks: 10,
    duration: "47:15",
    heritage: false
  },
  {
    id: 6,
    title: "Flashback",
    artist: "Electric Light Orchestra",
    year: 1979,
    genre: "Rock / Pop Rock",
    format: "Vinyl",
    price: 35.00,
    image: "/assets/albums/flashback.jpg",
    description: "Compilación de grandes éxitos de ELO.",
    featured: false,
    stock: 7,
    sku: "VIN-1979-006",
    tracks: 14,
    duration: "58:20",
    heritage: false
  },
  {
    id: 7,
    title: "Rumours",
    artist: "Fleetwood Mac",
    year: 1977,
    genre: "Soft Rock",
    format: "Cassette",
    price: 22.00,
    image: "/assets/albums/rumours.jpg",
    description: "Álbum grabado durante rupturas amorosas del grupo.",
    featured: false,
    stock: 18,
    sku: "CAS-1977-007",
    tracks: 11,
    duration: "39:43",
    heritage: false
  },
  {
    id: 8,
    title: "Parachutes",
    artist: "Coldplay",
    year: 2000,
    genre: "Alternative Rock",
    format: "CD",
    price: 24.00,
    image: "/assets/albums/parachutes.jpg",
    description: "Álbum debut de Coldplay que los lanzó a la fama.",
    featured: false,
    stock: 16,
    sku: "CD-2000-008",
    tracks: 10,
    duration: "41:45",
    heritage: false
  },
  {
    id: 9,
    title: "The Gold Experience",
    artist: "Prince",
    year: 1995,
    genre: "Funk / R&B",
    format: "CD",
    price: 29.00,
    image: "/assets/albums/gold_experience.jpg",
    description: "Álbum de Prince bajo el símbolo amor.",
    featured: false,
    stock: 8,
    sku: "CD-1995-009",
    tracks: 13,
    duration: "67:32",
    heritage: false
  },
  {
    id: 10,
    title: "Carnavas",
    artist: "Silversun Pickups",
    year: 2006,
    genre: "Alternative Rock",
    format: "CD",
    price: 22.00,
    image: "/assets/albums/carnavas.jpg",
    description: "Álbum debut de Silversun Pickups.",
    featured: false,
    stock: 11,
    sku: "CD-2006-010",
    tracks: 10,
    duration: "49:58",
    heritage: false
  },
  {
    id: 11,
    title: "Fearless",
    artist: "Taylor Swift",
    year: 2008,
    genre: "Country Pop",
    format: "CD",
    price: 26.00,
    image: "/assets/albums/fearless.jpg",
    description: "Segundo álbum de estudio de Taylor Swift.",
    featured: false,
    stock: 25,
    sku: "CD-2008-011",
    tracks: 13,
    duration: "53:41",
    heritage: false
  },
  {
    id: 12,
    title: "GUTS",
    artist: "Olivia Rodrigo",
    year: 2023,
    genre: "Pop Rock",
    format: "CD",
    price: 23.00,
    image: "/assets/albums/guts.jpg",
    description: "Segundo álbum de estudio de Olivia Rodrigo.",
    featured: false,
    stock: 30,
    sku: "CD-2023-012",
    tracks: 12,
    duration: "39:12",
    heritage: false
  },
  {
    id: 13,
    title: "Get a Grip",
    artist: "Aerosmith",
    year: 1993,
    genre: "Hard Rock",
    format: "Cassette",
    price: 20.00,
    image: "/assets/albums/get_a_grip.jpg",
    description: "Undécimo álbum de estudio de Aerosmith.",
    featured: false,
    stock: 13,
    sku: "CAS-1993-013",
    tracks: 14,
    duration: "62:11",
    heritage: false
  },
  // ===== PRODUCTOS HERITAGE =====
  {
    id: 101,
    title: "Definitely Maybe (30th Anniversary)",
    artist: "Oasis",
    year: 2024,
    originalYear: 1994,
    genre: "Britpop / Rock",
    format: "Vinyl",
    price: 75.00,
    image: "/assets/albums/heritage/definitely_maybe_30th.jpg",
    description: "Edición 30th Anniversary con bonus tracks y arte exclusivo.",
    featured: true,
    stock: 5,
    sku: "HER-2024-101",
    tracks: 25,
    duration: "120:30",
    heritage: true,
    limited: true,
    certificate: true,
    edition: "30th Anniversary Deluxe"
  },
  {
    id: 102,
    title: "Rumours (Deluxe Edition)",
    artist: "Fleetwood Mac",
    year: 2023,
    originalYear: 1977,
    genre: "Soft Rock",
    format: "Vinyl",
    price: 65.00,
    image: "/assets/albums/heritage/rumours_deluxe.jpg",
    description: "Edición Deluxe remasterizada con material inédito.",
    featured: true,
    stock: 6,
    sku: "HER-2023-102",
    tracks: 30,
    duration: "150:20",
    heritage: true,
    limited: true,
    certificate: true,
    edition: "Deluxe Remastered"
  },
  {
    id: 103,
    title: "Sgt. Pepper's Lonely Hearts Club Band (Deluxe)",
    artist: "The Beatles",
    year: 2017,
    originalYear: 1967,
    genre: "Rock",
    format: "Vinyl",
    price: 80.00,
    image: "/assets/albums/heritage/sgt_pepper_deluxe.jpg",
    description: "Edición 50th Anniversary con mezclas stereo y mono.",
    featured: true,
    stock: 4,
    sku: "HER-2017-103",
    tracks: 35,
    duration: "180:45",
    heritage: true,
    limited: true,
    certificate: true,
    edition: "50th Anniversary Deluxe"
  },
  {
    id: 104,
    title: "Bad (25th Anniversary)",
    artist: "Michael Jackson",
    year: 2012,
    originalYear: 1987,
    genre: "Pop",
    format: "Vinyl",
    price: 70.00,
    image: "/assets/albums/heritage/bad_25th.jpg",
    description: "Edición 25th Anniversary con demos y rarezas.",
    featured: true,
    stock: 7,
    sku: "HER-2012-104",
    tracks: 20,
    duration: "95:15",
    heritage: true,
    limited: true,
    certificate: true,
    edition: "25th Anniversary Edition"
  }
];

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);

  // Usuarios demo pre-registrados (incluye admin)
  const demoUsers = [
    { 
      id: 1, 
      username: 'admin', 
      email: 'admin@retrosound.com', 
      password: 'admin123', 
      isAdmin: true,
      name: 'Administrador',
      joined: '2024-01-01'
    },
    { 
      id: 2, 
      username: 'coleccionista', 
      email: 'user@retrosound.com', 
      password: 'coleccion123', 
      isAdmin: false,
      name: 'Coleccionista Demo',
      joined: '2024-02-01'
    },
    { 
      id: 3, 
      username: 'vinylfan', 
      email: 'fan@email.com', 
      password: 'vinyl123', 
      isAdmin: false,
      name: 'Vinyl Fan',
      joined: '2024-02-15'
    }
  ];

  // Cargar estado inicial
  useEffect(() => {
    console.log('🔍 Iniciando carga del contexto...');
    
    // Cargar usuario
    const savedUser = localStorage.getItem('retrosound_user');
    const savedLogin = localStorage.getItem('retrosound_loggedIn') === 'true';
    
    if (savedLogin && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
      console.log('✅ Usuario cargado:', JSON.parse(savedUser).username);
    }
    
    // Cargar carrito
    const savedCart = JSON.parse(localStorage.getItem('retrosound_cart') || '[]');
    setCart(savedCart);
    console.log('🛒 Carrito cargado:', savedCart.length, 'items');
    
    // Cargar pedidos
    const savedOrders = JSON.parse(localStorage.getItem('retrosound_orders') || '[]');
    setOrders(savedOrders);
    
    // Verificar si es admin
    const adminStatus = localStorage.getItem('retrosound_isAdmin') === 'true';
    setIsAdmin(adminStatus);
    
    // ==== ¡¡¡PARTE CRÍTICA - CARGA DE PRODUCTOS!!! ====
    const savedProducts = JSON.parse(localStorage.getItem('retrosound_adminProducts'));
    
    // FORZAR SIEMPRE los nuevos productos
    if (savedProducts && savedProducts.length > 0) {
      // Verificar si son los productos nuevos o los viejos
      const isNewProductFormat = savedProducts.some(p => p.id === 101); // Verificar si tiene productos heritage
      
      if (isNewProductFormat) {
        console.log('📦 Productos nuevos encontrados en localStorage');
        setAdminProducts(savedProducts);
      } else {
        console.log('🔄 Reemplazando productos viejos por nuevos');
        setAdminProducts(initialProducts);
        localStorage.setItem('retrosound_adminProducts', JSON.stringify(initialProducts));
      }
    } else {
      console.log('✨ Cargando productos iniciales por primera vez');
      setAdminProducts(initialProducts);
      localStorage.setItem('retrosound_adminProducts', JSON.stringify(initialProducts));
    }
    
    console.log('📊 Total de productos cargados:', adminProducts.length);
    
    // Guardar usuarios demo si no existen
    if (!localStorage.getItem('retrosound_demoUsers')) {
      localStorage.setItem('retrosound_demoUsers', JSON.stringify(demoUsers));
      console.log('👥 Usuarios demo creados');
    }
    
    console.log('✅ Contexto cargado completamente');
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('retrosound_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Guardar productos admin
  useEffect(() => {
    if (adminProducts.length > 0) {
      localStorage.setItem('retrosound_adminProducts', JSON.stringify(adminProducts));
    }
  }, [adminProducts]);

  // ========== AUTH FUNCTIONS ==========
  const login = (credentials) => {
    const users = JSON.parse(localStorage.getItem('retrosound_demoUsers') || JSON.stringify(demoUsers));
    
    // Buscar usuario por username o email
    const user = users.find(u => 
      (u.username === credentials.username_or_email || u.email === credentials.username_or_email) &&
      u.password === credentials.password
    );
    
    if (!user) {
      return { success: false, message: 'Credenciales incorrectas' };
    }
    
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      joined: user.joined
    };
    
    setIsLoggedIn(true);
    setCurrentUser(userData);
    
    if (user.isAdmin) {
      setIsAdmin(true);
      localStorage.setItem('retrosound_isAdmin', 'true');
    }
    
    localStorage.setItem('retrosound_user', JSON.stringify(userData));
    localStorage.setItem('retrosound_loggedIn', 'true');
    
    return { 
      success: true, 
      message: `¡Bienvenido ${user.username}!`,
      user: userData 
    };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('retrosound_demoUsers') || JSON.stringify(demoUsers));
    
    // Verificar si ya existe
    const userExists = users.some(u => 
      u.username === userData.username || u.email === userData.email
    );
    
    if (userExists) {
      return { success: false, message: 'Usuario o email ya registrado' };
    }
    
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.username,
      isAdmin: false,
      joined: new Date().toISOString().split('T')[0]
    };
    
    const updatedUsers = [...users, newUser];
    localStorage.setItem('retrosound_demoUsers', JSON.stringify(updatedUsers));
    
    // Auto-login después de registro
    setIsLoggedIn(true);
    setCurrentUser({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      isAdmin: false
    });
    
    localStorage.setItem('retrosound_user', JSON.stringify(newUser));
    localStorage.setItem('retrosound_loggedIn', 'true');
    
    return { 
      success: true, 
      message: `¡Cuenta creada exitosamente, ${newUser.username}!`,
      user: newUser 
    };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('retrosound_user');
    localStorage.setItem('retrosound_loggedIn', 'false');
    localStorage.setItem('retrosound_isAdmin', 'false');
    return { success: true, message: 'Sesión cerrada correctamente' };
  };

  // ========== CART FUNCTIONS ==========
  const addToCart = (product, quantity = 1) => {
    if (!isLoggedIn) {
      return { 
        success: false, 
        message: 'Debes iniciar sesión para agregar al carrito',
        requiresLogin: true 
      };
    }
    
    // Verificar stock
    const productStock = adminProducts.find(p => p.id === product.id)?.stock || 0;
    const currentInCart = cart.find(item => item.id === product.id)?.quantity || 0;
    
    if (currentInCart + quantity > productStock) {
      return { 
        success: false, 
        message: `Stock insuficiente. Solo quedan ${productStock} unidades`
      };
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
    
    return { 
      success: true, 
      message: `${product.title} agregado al carrito`,
      cartCount: calculateCartCount() + quantity
    };
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    // Verificar stock
    const productStock = adminProducts.find(p => p.id === productId)?.stock || 0;
    if (quantity > productStock) {
      alert(`Stock máximo: ${productStock} unidades`);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // ========== PAYMENT FUNCTIONS ==========
  const processPayment = (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const order = {
          id: orderId,
          date: new Date().toISOString(),
          items: [...cart],
          subtotal: calculateCartTotal(),
          shipping: 5.99,
          tax: calculateCartTotal() * 0.16,
          total: calculateCartTotal() + 5.99 + (calculateCartTotal() * 0.16),
          user: currentUser,
          payment: {
            method: paymentData.method || 'Tarjeta',
            last4: paymentData.last4 || '****',
            status: 'completed'
          },
          shippingAddress: paymentData.shippingAddress || {},
          status: 'processing',
          trackingNumber: `TRK-${Date.now().toString().slice(-8)}`
        };
        
        // Actualizar stock
        const updatedProducts = adminProducts.map(product => {
          const purchasedItem = cart.find(item => item.id === product.id);
          if (purchasedItem) {
            return {
              ...product,
              stock: Math.max(0, product.stock - purchasedItem.quantity),
              lastSold: new Date().toISOString(),
              totalSold: (product.totalSold || 0) + purchasedItem.quantity
            };
          }
          return product;
        });
        
        setAdminProducts(updatedProducts);
        localStorage.setItem('retrosound_adminProducts', JSON.stringify(updatedProducts));
        
        // Guardar orden
        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        localStorage.setItem('retrosound_orders', JSON.stringify(updatedOrders));
        
        // Limpiar carrito
        clearCart();
        
        resolve({
          success: true,
          orderId: order.id,
          trackingNumber: order.trackingNumber,
          total: order.total,
          message: '¡Pago procesado exitosamente! Tu orden está en camino.'
        });
      }, 2000);
    });
  };

  // ========== ADMIN FUNCTIONS ==========
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      sku: `PROD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      ...productData
    };
    
    setAdminProducts(prev => {
      const updated = [...prev, newProduct];
      localStorage.setItem('retrosound_adminProducts', JSON.stringify(updated));
      return updated;
    });
    
    return { success: true, product: newProduct };
  };

  const updateProduct = (productId, updates) => {
    setAdminProducts(prev => {
      const updated = prev.map(product =>
        product.id === productId 
          ? { ...product, ...updates, updatedAt: new Date().toISOString() } 
          : product
      );
      localStorage.setItem('retrosound_adminProducts', JSON.stringify(updated));
      return updated;
    });
    
    return { success: true };
  };

  const deleteProduct = (productId) => {
    setAdminProducts(prev => {
      const updated = prev.filter(product => product.id !== productId);
      localStorage.setItem('retrosound_adminProducts', JSON.stringify(updated));
      return updated;
    });
    
    return { success: true };
  };

  const promoteToAdmin = (userId) => {
    const users = JSON.parse(localStorage.getItem('retrosound_demoUsers') || JSON.stringify(demoUsers));
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isAdmin: true } : user
    );
    
    localStorage.setItem('retrosound_demoUsers', JSON.stringify(updatedUsers));
    
    if (currentUser?.id === userId) {
      setIsAdmin(true);
      setCurrentUser({ ...currentUser, isAdmin: true });
      localStorage.setItem('retrosound_isAdmin', 'true');
    }
    
    return { success: true };
  };

  // ========== CALCULATIONS ==========
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const calculateCartTax = () => {
    return calculateCartTotal() * 0.16;
  };

  const calculateCartShipping = () => {
    return cart.length > 0 ? 5.99 : 0;
  };

  const calculateCartGrandTotal = () => {
    return calculateCartTotal() + calculateCartShipping() + calculateCartTax();
  };

  return (
    <AppContext.Provider
      value={{
        // State
        isLoggedIn,
        currentUser,
        cart,
        adminProducts,
        isAdmin,
        orders,
        
        // Auth
        login,
        register,
        logout,
        
        // Cart
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        
        // Payment
        processPayment,
        
        // Admin
        addProduct,
        updateProduct,
        deleteProduct,
        promoteToAdmin,
        
        // Calculations
        calculateCartTotal,
        calculateCartCount,
        calculateCartTax,
        calculateCartShipping,
        calculateCartGrandTotal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);