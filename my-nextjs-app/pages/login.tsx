import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8888';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Head>
        <title>Login - Seniorly</title>
      </Head>
      
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/">
            <img src="/Logo-removebg-preview.png" alt="Logo" className="auth-logo" />
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to continue your learning journey</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          padding: 20px;
          transition: background-color 0.3s ease;
        }
        .auth-card {
          background: var(--bg-card);
          padding: 40px;
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          width: 100%;
          max-width: 400px;
          border: 1px solid var(--border-color);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .auth-logo {
          height: 60px;
          margin-bottom: 10px;
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          transition: transform 0.2s;
        }
        .auth-logo:hover {
          transform: scale(1.05);
        }
        .auth-header h2 {
          color: var(--text-primary);
          margin: 0;
          font-size: 24px;
        }
        .auth-header p {
          color: var(--text-secondary);
          margin: 10px 0 0;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        .form-group input {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 16px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .auth-submit-btn {
          background: #667eea;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .auth-submit-btn:hover {
          background: #5a67d8;
        }
        .auth-submit-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        .auth-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
        }
        .auth-footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Login;
