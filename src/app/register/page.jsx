'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './register.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate all fields
    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
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
          action: 'register'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Registration successful! Please login.');
        // Clear form
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Register</h2>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
} 