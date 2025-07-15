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
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedItems = localStorage.getItem('items');
    if (storedItems) setItems(JSON.parse(storedItems));
  }, []);

  const handleSubmit = () => {
    if (!title || !price || !imageUrl || !category) {
      alert('Please fill all fields.');
      return;
    }
    const newItem = { title, price, image: imageUrl, category };
    let updatedItems;
    if (editIndex !== null) {
      updatedItems = [...items];
      updatedItems[editIndex] = newItem;
    } else {
      updatedItems = [...items, newItem];
    }
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setTitle(''); setPrice(''); setImageUrl(''); setCategory('');
    setEditIndex(null);
    alert('Saved!');
  };

  const handleEdit = (idx) => {
    const item = items[idx];
    setTitle(item.title); setPrice(item.price); setImageUrl(item.image); setCategory(item.category);
    setActiveTab('add'); setEditIndex(idx);
  };

  const handleDelete = (idx) => {
    if (!window.confirm('Delete?')) return;
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    localStorage.setItem('items', JSON.stringify(updated));
  };

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <div className={`sidebar-button ${activeTab==='add'?'active':''}`} onClick={()=>{setActiveTab('add'); setEditIndex(null); setTitle(''); setPrice(''); setImageUrl(''); setCategory('');}}>➕ {editIndex!==null?'Update':'Add'} Item</div>
        <div className={`sidebar-button ${activeTab==='list'?'active':''}`} onClick={()=>setActiveTab('list')}>✅ List Items</div>
      </aside>
      <main className="content">
        {activeTab==='add' && (
          <div className="form-section fade-in">
            <h2>{editIndex!==null?'Edit':'Add New'} Item</h2>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
            <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price"/>
            <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL"/>
            <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category (e.g., Briyani)"/>
            {imageUrl && <img src={imageUrl} className="preview"/>}
            <button onClick={handleSubmit}>{editIndex!==null?'Update':'Add'} Item</button>
          </div>
        )}
        {activeTab==='list' && (
          <div className="item-list fade-in">
            {items.length===0?<p>No items.</p>:
              <div className="cards">
                {items.map((item,idx)=>(
                  <div key={idx} className="item-card hover-pop">
                    <img src={item.image}/><h4>{item.title}</h4><p>₹{item.price} | {item.category}</p>
                    <div>
                      <button onClick={()=>handleEdit(idx)}>Edit</button>
                      <button onClick={()=>handleDelete(idx)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>}
          </div>
        )}
      </main>
    </div>
  );
}
