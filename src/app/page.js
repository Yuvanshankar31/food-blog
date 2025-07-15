'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  const categories = [
    { name: 'All', image: 'https://i.pinimg.com/1200x/77/32/2f/77322f963a2876b7580127c8fa16082f.jpg' },
    { name: 'Briyani', image: 'https://i.pinimg.com/736x/47/bf/7d/47bf7de55cdb95fdbec84526af98ccdd.jpg' },
    { name: 'Deserts', image: 'https://i.pinimg.com/1200x/42/b1/3a/42b13acee066b8e5ff2bac26e0f881ce.jpg' },
    { name: 'Beverages', image: 'https://i.pinimg.com/1200x/7d/9f/0d/7d9f0df2974c4d27a8db9e9548ba2f9a.jpg' },
    { name: 'Veg', image: 'https://i.pinimg.com/1200x/bf/08/2f/bf082ffd965d180fc23d0f65585b2329.jpg' },
    { name: 'Soup', image: 'https://i.pinimg.com/1200x/2c/81/7b/2c817b5bea67741e3d61b840275b692f.jpg' },
    { name: 'Starters', image: 'https://i.pinimg.com/736x/8a/c7/93/8ac793a9a06488953b21624153285829.jpg' },
    { name: 'Meals', image: 'https://i.pinimg.com/1200x/f7/41/5f/f7415f93ecdccc842224b4790f541112.jpg' },
    { name: 'Seafood', image: 'https://i.pinimg.com/1200x/6f/7b/14/6f7b1462deac16b25c4a3398b0040315.jpg' },
    { name: 'Chinese', image: 'https://i.pinimg.com/736x/e3/ac/a4/e3aca4310acc6d2a0712baf724e64041.jpg' }
  ];

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
    setItems(storedItems);
    const user = localStorage.getItem('user');
    if (user) setName(user);
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const handleAddToCart = (item) => {
    const existingIndex = cart.findIndex((cartItem) => cartItem.title === item.title);
    let updatedCart;
    if (existingIndex !== -1) {
      updatedCart = cart.map((cartItem, idx) =>
        idx === existingIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="home">
      <header className="main-header">
        <div className="logo">🍅 Tomato</div>
        <nav>
          <span className="welcome-text">Welcome, {name}</span>
          <Link href="/">Home</Link>
          <Link href="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h1>Order your <br /><span>favourite food</span> here</h1>
          <p>Choose from a diverse menu crafted with the finest ingredients and expertise.</p>
          <button className="view-menu-btn">View Menu</button>
        </div>
      
      </section>

      {/* Categories */}
      <section className="categories">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </section>

      {/* Menu */}
      <section className="menu">
        <h2>Explore our menu</h2>
        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <p>No items found in {selectedCategory}.</p>
          ) : (
            filteredItems.map((item, idx) => (
              <div className="food-card" key={idx}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="price">₹{item.price}</p>
                <button className="add-btn" onClick={() => handleAddToCart(item)}>+</button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
