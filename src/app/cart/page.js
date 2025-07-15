'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleCheckout = () => {
    alert('Payment successful! (Dummy payment)');
    setCart([]);
    localStorage.removeItem('cart');
    router.push('/');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <header className="main-header">
        <div className="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>🍅 Tomato</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>
        </nav>
      </header>

      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((item, idx) => (
              <div className="cart-card" key={idx}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="price">₹{item.price} × {item.quantity}</p>
                <p>Total: ₹{item.price * item.quantity}</p>
                <button className="remove-btn" onClick={() => handleRemove(idx)}>Remove</button>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: '1rem' }}>Grand Total: ₹{totalPrice}</h3>
          <button className="checkout-btn" onClick={handleCheckout}>Pay Now</button>
        </>
      )}
    </div>
  );
}
