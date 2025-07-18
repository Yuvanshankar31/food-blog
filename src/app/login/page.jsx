'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');


    if (!username || !email || !password) {
      setMessage("Please fill all fields.");
      setIsLoading(false);
      return;
    }

    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('user', user.username);
      localStorage.setItem('userEmail', user.email);
      setMessage('Login successful!');
      setIsLoading(false);
      router.push('/');
    } else {
      setMessage('Invalid credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}