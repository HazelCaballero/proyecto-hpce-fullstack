import React, {useState} from 'react'
import '../styles/Scomponents/DonacionUser.css'
import {PayPalScriptProvider,PayPalButtons} from "@paypal/react-paypal-js"
import Swal from 'sweetalert2';
export default function DonacionUser() {

    const [monto, setMonto] = useState("5");
    const [customValue, setCustomValue] = useState("");

    
    const initianlOptions ={
        "clientId":"Adt2kXZO5-wR-wcI2Wv9gzPKFHjhCOJNpRkoCbxCWcDVIFbngtzNBZg6LJ00pFof-Pm41cWk1ce8xaW2",
         currency:"USD",
         intent:"capture"
    }

        const createOrder = (data, actions) => {
  // Usa el valor seleccionado o el personalizado
  const amountToPay = monto === "custom" ? customValue : monto;
  return actions.order.create({
    purchase_units: [
      {
        amount: {
          currency: "USD",
          value: amountToPay || "1", // Valor mínimo por defecto
        },
      },
    ],
  });
};

    const onApprove = (data,actions)=> {
      return actions.order.capture().then(function(details){
        Swal.fire({
          icon: 'success',
          title: '¡Pago Completado!',
          text: `Gracias, ${details.payer.name.given_name}`,
        });
      })
    }
    const onCancel = () => {
        Swal.fire({
          icon: 'info',
          title: 'Pago Cancelado',
          text: 'El pago fue cancelado por el usuario.',
        });
    };

  return (
    <div className='donacion-User-Cont'>
        <div className='dona-info'>
            <h2>Dona hoy por las mujeres del mañana</h2>
                 <p>Conexíon Creativa es un proyecto desarrollado por para mujeres, con el fin de comportatir 
                    conocimiento y herramientas para mejorar nuestras vidas y el futuro de todos, por medio de
                    donaciones podemos ayudar a mujeres en necesidad y que este proyecto continue, por cada donación
                    45% se dirije a mujeres en situaciones de pobreza, 20% a fundaciones que apoyan la formacion
                    educativa de mujeres y 35% a mantener esta comunidad.
                 </p>
        </div>


        <div>
           <label className='dona-label' htmlFor="valor-pagar">Selecione el monto a pagar</label> 
           <select className='dona-input'
             id="valor-pagar"
             value={monto}
             onChange={e => setMonto(e.target.value)}
           >
             <option value="1">$1</option>
             <option value="5">$5</option>
             <option value="10">$10</option>
             <option value="50">$50</option>
             <option value="custom"> Otro monto </option>
           </select>
           {monto === "custom" && (
                    <input
                  className='otroM'
                        type="text"
                        min="1"
                        placeholder="Ingrese el monto"
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    />
                )}
        </div>

    <div className='btn-pay-cont'>
      
          <div className='pay-btn'>
              <PayPalScriptProvider options={initianlOptions} >
                  <PayPalButtons
                  style={{
                      layout: "horizontal",
                      color: "blue",
                      shape:"rect",
                      label: "paypal"
                  }}
                  createOrder={(data,actions)=>createOrder(data,actions)}
                  onApprove={(data,actions)=> onApprove(data,actions)}
                  onCancel={onCancel}
                  />
              </PayPalScriptProvider>
          </div>
    </div>





    </div>
  )
}
