'use client';
import React, { useState, useEffect } from 'react';
import './admin.css';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [editItemId, setEditItemId] = useState(null);
  const [orders, setOrders] = useState([]);

  const fallbackImage = '/fallback.png'; 

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
    setItems(storedItems);
  };

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    setOrders(storedOrders);
  };

  const handleSubmit = () => {
    if (!title || !price || !imageUrl || !category) {
      alert('Please fill all fields.');
      return;
    }

    let storedItems = JSON.parse(localStorage.getItem('items') || '[]');
    if (editItemId) {
      storedItems = storedItems.map(item =>
        item._id === editItemId ? { ...item, title, price, image: imageUrl, category } : item
      );
    } else {
      const newItem = { _id: Date.now().toString(), title, price, image: imageUrl, category };
      storedItems.push(newItem);
    }
    localStorage.setItem('items', JSON.stringify(storedItems));
    setTitle('');
    setPrice('');
    setImageUrl('');
    setCategory('');
    setEditItemId(null);
    loadItems();
    alert('Saved!');
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setPrice(item.price);
    setImageUrl(item.image);
    setCategory(item.category);
    setEditItemId(item._id);
    setActiveTab('add');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete?')) return;
    let storedItems = JSON.parse(localStorage.getItem('items') || '[]');
    storedItems = storedItems.filter(item => item._id !== id);
    localStorage.setItem('items', JSON.stringify(storedItems));
    loadItems();
  };

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <div
          className={`sidebar-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('add');
            setEditItemId(null);
            setTitle('');
            setPrice('');
            setImageUrl('');
            setCategory('');
          }}
        >
          ➕ {editItemId ? 'Update' : 'Add'} Item
        </div>
        <div
          className={`sidebar-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          ✅ List Items
        </div>
        <div
          className={`sidebar-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('orders');
            loadOrders();
          }}
        >
          📦 Orders
        </div>
      </aside>

      <main className="content">
        {activeTab === 'add' && (
          <div className="form-section fade-in">
            <h2>{editItemId ? 'Edit' : 'Add New'} Item</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g., Briyani)"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                className="preview"
                alt="Preview"
                onError={(e) => (e.target.src = fallbackImage)}
              />
            )}
            <button onClick={handleSubmit}>
              {editItemId ? 'Update' : 'Add'} Item
            </button>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="item-list fade-in">
            {items.length === 0 ? (
              <p>No items.</p>
            ) : (
              <div className="cards">
                {items.map((item) => (
                  <div key={item._id} className="item-card hover-pop">
                    <img
                      src={item.image || fallbackImage}
                      alt={item.title}
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <h4>{item.title}</h4>
                    <p>₹{item.price} | {item.category}</p>
                    <div>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section fade-in">
            <h2>Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              orders.map((order, idx) => (
                <div key={idx} className="order-card">
                  <p><b>User:</b> {order.user || order.customer?.firstName || 'Anonymous'}</p>
                  <p><b>Date:</b> {new Date(order.date).toLocaleString()}</p>
                  <ul>
                    {order.items.map((it, i) => (
                      <li key={i}>{it.title} x {it.quantity}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
