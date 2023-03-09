// import React, { Component } from 'react'
// import { PayPalButtons } from "@paypal/react-paypal-js";

// export function Paypal() {
//   function createOrder(data, actions) {
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             value: "0.01",
//           },
//         },
//       ],
//     });
//   }

//   function onApprove(data, actions) {
//     return actions.order.capture().then(function(details) {
//       const paymentData = {
//         paymentID: data.orderID,
//         payerID: data.payerID,
//         amount: details.purchase_units[0].amount.value,
//         currency: details.purchase_units[0].amount.currency_code
//       };
//       // Call your API to save the payment details in your database
//       fetch('/payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData),
//       })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Payment history saved:', data);
//       })
//       .catch(error => {
//         console.error('Error saving payment history:', error);
//       });
//     });
//   }

//   return (
//     <div>
//       <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
//     </div>
//   );
// }