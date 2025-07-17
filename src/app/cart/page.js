'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // Replace this path with your image inside /public folder
  const productImage = '/cart-product.png';

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

  const handleProceedToCheckout = () => {
    // You can also save order in DB here before navigation
    router.push('/orders');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <header className="main-header">
        <div className="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
          🍅 Tomato
        </div>
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
                <Image src={item.image || productImage} alt={item.title} width={180} height={120} style={{objectFit:'cover',borderRadius:'12px'}} />
                <h3>{item.title}</h3>
                <p className="price">₹{item.price} × {item.quantity}</p>
                <p>Total: ₹{item.price * item.quantity}</p>
                <button className="remove-btn" onClick={() => handleRemove(idx)}>Remove</button>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: '1rem' }}>Grand Total: ₹{totalPrice}</h3>
          <button className="checkout-btn" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
        </>
      )}

      <style jsx>{`
        .cart-page {
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px;
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0,0,0,0.4);
          color: white;
          padding: 12px 30px;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(4px);
          border-radius: 0 0 12px 12px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        nav {
          display: flex;
          gap: 18px;
        }
        nav a {
          color: white;
          font-weight: 500;
          text-decoration: none;
        }
        nav a:hover {
          text-decoration: underline;
        }
        .cart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .cart-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
          padding: 15px;
          text-align: center;
          transition: transform 0.2s;
        }
        .cart-card:hover {
          transform: translateY(-3px);
        }
        .cart-card img {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 12px;
        }
        .price {
          color: #ff6b3e;
          font-weight: bold;
          font-size: 0.95rem;
        }
        .remove-btn {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          margin-top: 5px;
          transition: background 0.2s;
        }
        .remove-btn:hover {
          background: #b02a37;
        }
        .checkout-btn {
          background: green;
          color: white;
          border: none;
          border-radius: 25px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.2s;
        }
        .checkout-btn:hover {
          background: darkgreen;
        }
      `}</style>
    </div>
  );
}
