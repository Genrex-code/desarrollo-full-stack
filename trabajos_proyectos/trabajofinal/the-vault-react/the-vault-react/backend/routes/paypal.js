import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useApp } from 'trabajos_proyectos\trabajofinal\the-vault-react\the-vault-react\src\context\AppContext.jsx'; // Para obtener el total y el carrito y si no estaba el carrito ahi cambia la direccion y ya 


// declaracion de constantes
//chingue asu amdre el america

const PaypalCheckout = () => {
    const{CalculateCartTotal,cart,clearCart,currentUser} = useApp();
    const [paid,setPaid] = useState(false);
    const [error,setError] = useState(null);
///confugiracion basica 
//chingue su madre el america
const paypalOptions = {
    "cliente-id": "6JEM6FANFRSR8", //este es el id del cliente juan se peude cambiar
    currency: "USD",
    intent: "capture",
};

///estilo de boton generico de estetica retro/neon/qlera
//chingue asu madre el america
const buttonStyles = {
    layout:'vertical',
    color:'gold',
    shape:'rect',
    label:'pay'
};
//logica no tan logica pero sencilla pero no tan sencilla del orden
//chingue asu perra madre el america
const createOrder = (data,actions) => {
    return actions.order.create({
        purchase_units: [
            {
                description:"Compra de Vinilos - RetroSounds Stores",
                amount: {
                    currency_code:"USD",
                    value:CalculateCartTotal.toFixed(2),//esto define 2 decimales en string como lo pide paypal
                    //pablo si lees esto no voy a quitar mis "palabras malsonantes "
                    //puto el que lo lea
                    //chingue asu madre el amercia 
                },
            },
        ],
    });
};

//para que el server espere
//me cagna bien potente los furros
// chingeun asu madre los fans del america
const onApprove = async ( data,actions) => {
    const order = await actions.order.capture();
    console.log("Pago aprobado por Paypal:",order);
//aca empeizas a conectar con lo demas ok?
//pablo si lees esto 
// que chingue asu madre el america 
// y me cagan los judios
    const pedidoData = {
         id_transaccion: order.id,
        cliente: currentUser?.username || 'Invitado',
        total: calculateCartTotal(),
        productos: cart,
        fecha: new Date().toISOString()
     };

    console.log("Enviando pedido a la base de datos qlera",pedidoData);

    //simulacion de exito visual para testeos rapidos
    //me cagan los therians
    setPaid(true);
    clearCart(); //limpiamos carritos tras el pago para que no se truene
};
const onError = (err) => {
    setError(err);
    console.error("Error en el progreso de Paypal")
};
//vista de exito por si funciono sea visual 
//aca metes el estilo ok?
//si ocupas algo mas me dices 
//odio la pizza con piña pinche aberracion qlinaria y qlera
if (paid) { 
    return(
        <div className="card bg-dark border-success text-center p-5 fade-in">
                <i className="bi bi-check-circle-fill text-success fs-1"></i>
                <h2 className="text-white mt-3 bungee-font">¡PAGO COMPLETADO!</h2>
                <p className="text-muted">Tu pedido ha sido procesado y guardado en La Bóveda.</p>
                <button className="btn btn-outline-success mt-3" onClick={() => window.location.href = '/'}>
                    Volver a la tienda
                </button>
            </div>
    );
}
//aca el visual en caso de que la chingadera truene y falle y se rompa y muera todo 
return ( 
    <div className="paypal-container bg-glass-dark p-4 rounded border-pink">
            <h4 className="text-pink mb-4 text-center">FINALIZAR COMPRA</h4>
            
            {error && <div className="alert alert-danger">Hubo un error con el pago. Revisa tu saldo Sandbox.</div>}

            <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons 
                    style={buttonStyles}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                />
            </PayPalScriptProvider>

            <div className="mt-3 text-center">
                <small className="text-muted">
                    Total a pagar: <strong className="text-white">${calculateCartTotal().toFixed(2)} USD</strong>
                </small>
            </div>
        </div>
);
//export de funcionalidad funcional chingona
//por si no quedo claro
// K
//CHINGUE
//A
//SU
//MADRE
//EL
//AMERICA 
// >:V
};
export default PaypalCheckout;