'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css'; // Make sure this file exists in the same folder

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate all fields
    if (!username || !email || !password) {
      setMessage("Please fill all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          action: 'login'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save to localStorage
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', data.user.username);
        localStorage.setItem('userEmail', data.user.email);
        
        setMessage('Login successful!');
        router.push('/'); // Redirect to homepage
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please try again.');
    } finally {
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