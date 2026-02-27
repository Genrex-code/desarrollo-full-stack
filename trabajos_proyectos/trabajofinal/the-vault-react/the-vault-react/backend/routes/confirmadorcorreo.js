//pablo para conectar esto ocupas:
//orderID que gnera paypal
//userEmail correo de usuario
// cartdata= arreglo de productos que se compraron
// totalamount? = no se si sellamaba asi pero es el monto final
//sabes porque se cayo la niña del columpio
// por pndj 
//JAJASJASJAS
//ijnstalate esto tambioen 
//npm install @emailjs/browser

import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

const ConfirmadorCorreo = ({ datosPedido }) => {
  const [estadoEmail, setEstadoEmail] = useState('preparando'); // preparando | enviado | error

  useEffect(() => {
    if (datosPedido) {
      // --- LÓGICA DE ENVÍO REAL CON EMAILJS ---
      const enviarEmail = async () => {
        try {
          const templateParams = {
            user_name: datosPedido.cliente || "Melómano",
            user_email: datosPedido.email,
            order_id: datosPedido.idPaypal,
            total_price: `$${datosPedido.total.toFixed(2)}`,
            detalle_productos: datosPedido.productos.map(p => p.title).join(', ')
          };
/////////
//////aca cambias el registro y ya queda para enviar correos 
          await emailjs.send(
            'TU_SERVICE_ID',    // <--- Reemplazar
            'TU_TEMPLATE_ID',   // <--- Reemplazar
            templateParams,
            'TU_PUBLIC_KEY'     // <--- Reemplazar
          );

          setEstadoEmail('enviado');
          console.log(" Correo real enviado con éxito");
        } catch (error) {
          console.error(" Falló el envío del correo:", error);
          setEstadoEmail('error');
        }
      };

      enviarEmail();
    }
  }, [datosPedido]);

  return (
    <div className="confirmador-wrapper">
      {estadoEmail === 'preparando' && (
        <div className="status-box">
          <h2>Enviando confirmación a tu correo...</h2>
          <div className="loader-esqueleto"></div> 
        </div>
      )}

      {estadoEmail === 'enviado' && (
        <div className="status-box success fade-in">
          <header>
            <h1>¡Pedido Confirmado!</h1>
            <p>Revisa tu bandeja de entrada en: <strong>{datosPedido.email}</strong></p>
          </header>

          <section className="resumen-ticket">
            <h3>Ticket de Venta</h3>
            <p>ID: {datosPedido.idPaypal}</p>
            <hr />
            <ul>
              {datosPedido.productos.map((item, idx) => (
                <li key={idx}>{item.title} x{item.quantity}</li>
              ))}
            </ul>
            <h4>Total: ${datosPedido.total.toFixed(2)} USD</h4>
          </section>

          <div className="acciones">
            <button onClick={() => window.print()}>Imprimir Recibo</button>
            <button onClick={() => window.location.href = '/'}>Volver a Inicio</button>
          </div>
        </div>
      )}

      {estadoEmail === 'error' && (
        <div className="status-box error">
          <h2>Pago exitoso, pero hubo un error de red</h2>
          <p>Tu pedido está seguro, pero no pudimos enviar el correo de confirmación.</p>
          <button onClick={() => window.location.href = '/'}>Ir a Inicio</button>
        </div>
      )}
    </div>
  );
};



export default ConfirmadorCorreo;