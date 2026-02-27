const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const db = require("../db");

// Cargar variables de entorno
require('dotenv').config();

const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Obtener token de acceso
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  return data.access_token;
}

// Crear orden en PayPal
router.post("/create-order", async (req, res) => {
  try {
    const { cart, subtotal, tax, shipping, total, shippingAddress, usuario_id } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const accessToken = await getPayPalAccessToken();

    // Formatear items para PayPal
    const items = cart.map(item => ({
      name: `${item.title} - ${item.artist}`,
      unit_amount: {
        currency_code: 'MXN',
        value: item.price.toFixed(2)
      },
      quantity: item.quantity,
      description: `${item.format} - ${item.genre || ''}`
    }));

    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [{
        items: items,
        amount: {
          currency_code: 'MXN',
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'MXN',
              value: subtotal.toFixed(2)
            },
            tax_total: {
              currency_code: 'MXN',
              value: tax.toFixed(2)
            },
            shipping: {
              currency_code: 'MXN',
              value: shipping.toFixed(2)
            }
          }
        },
        shipping: {
          address: {
            address_line_1: shippingAddress.address,
            admin_area_2: shippingAddress.city,
            postal_code: shippingAddress.zipCode,
            country_code: shippingAddress.country === 'México' ? 'MX' : 'US'
          }
        }
      }],
      application_context: {
        brand_name: 'The Vault',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'http://localhost:3000/pago-exitoso',
        cancel_url: 'http://localhost:3000/carrito'
      }
    };

    console.log('Creando orden PayPal:', paypalOrder);

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paypalOrder),
    });

    const data = await response.json();
    console.log('Respuesta PayPal:', data);

    res.json(data);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Error al crear orden de pago' });
  }
});

// Capturar pago de PayPal
router.post("/capture-order", async (req, res) => {
  const { orderId } = req.body;

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log('Pago capturado:', data);

    res.json(data);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: 'Error al capturar el pago' });
  }
});

module.exports = router;