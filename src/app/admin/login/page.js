'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check admin credentials
    if (email === 'sksyuvanshankar@gmail.com' && password === 'Yuvan@gmail.com') {
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_user', email);
      router.push('/admin/dashboard');
    } else {
      alert('Invalid admin credentials!');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.adminTitle}>Login</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.loginInput}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
          />
        </div>
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}
