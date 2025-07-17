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

  const API = 'http://localhost:5000/api';
  const fallbackImage = '/fallback.png'; 

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await fetch(`${API}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error loading items:', err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !price || !imageUrl || !category) {
      alert('Please fill all fields.');
      return;
    }

    const newItem = { title, price, image: imageUrl, category };

    try {
      if (editItemId) {
        await fetch(`${API}/items/${editItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
      } else {
        await fetch(`${API}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
      }

      setTitle('');
      setPrice('');
      setImageUrl('');
      setCategory('');
      setEditItemId(null);
      loadItems();
      alert('Saved!');
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save item.');
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setPrice(item.price);
    setImageUrl(item.image);
    setCategory(item.category);
    setEditItemId(item._id);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await fetch(`${API}/items/${id}`, { method: 'DELETE' });
      loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
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
