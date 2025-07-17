'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const API = 'http://localhost:5000/api';

  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', email: '',
    street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });
  const [payment, setPayment] = useState('cod'); // default Cash on Delivery

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const handleInputChange = (e) => {
    setDelivery({ ...delivery, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const orderData = {
      customer: delivery,
      paymentMethod: payment,
      items: cart,
      date: new Date().toISOString()
    };

    // Save locally
    let userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    userOrders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));

    localStorage.removeItem('cart'); // clear cart
    alert('Order placed successfully!');
    // Optionally, redirect to a 'My Orders' page or clear form
    router.push('/orders');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 10;

  return (
    <div className="checkout-page">
      <h2>Delivery Information</h2>
      <div className="form-grid">
        <input name="firstName" placeholder="First name" value={delivery.firstName} onChange={handleInputChange} />
        <input name="lastName" placeholder="Last name" value={delivery.lastName} onChange={handleInputChange} />
        <input name="email" placeholder="Email" value={delivery.email} onChange={handleInputChange} />
        <input name="street" placeholder="Street" value={delivery.street} onChange={handleInputChange} />
        <input name="city" placeholder="City" value={delivery.city} onChange={handleInputChange} />
        <input name="state" placeholder="State" value={delivery.state} onChange={handleInputChange} />
        <input name="zipcode" placeholder="Zipcode" value={delivery.zipcode} onChange={handleInputChange} />
        <input name="country" placeholder="Country" value={delivery.country} onChange={handleInputChange} />
        <input name="phone" placeholder="Phone" value={delivery.phone} onChange={handleInputChange} />
      </div>

      <h2>Payment Method</h2>
      <div className="payment-options">
        <label className={payment === 'cod' ? 'selected' : ''}>
          <input type="radio" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
          Cash on Delivery
        </label>
      </div>  

      <div className="summary">
        <p>Subtotal: ₹{totalPrice}</p>
        <p>Shipping: ₹{shippingFee}</p>
        <h3>Total: ₹{totalPrice + shippingFee}</h3>
      </div>

      <button onClick={handlePlaceOrder}>Place Order</button>

      <style jsx>{`
        .checkout-page {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }
        h2 {
          margin-bottom: 10px;
          color: #333;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.95rem;
          width: 100%;
          box-sizing: border-box;
        }
        .payment-options {
          display: flex;
          gap: 20px;
          margin: 10px 0 20px;
        }
        .payment-options label {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .payment-options label.selected {
          border-color: #4CAF50;
          background: #eafaf0;
        }
        .summary {
          background: #fafafa;
          border: 1px solid #eee;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .summary p {
          margin: 4px 0;
          font-size: 0.95rem;
        }
        .summary h3 {
          margin-top: 8px;
          font-size: 1.1rem;
          color: #333;
        }
        button {
          background: #4CAF50;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 1rem;
        }
        button:hover {
          background: #3e9e45;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .payment-options {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
