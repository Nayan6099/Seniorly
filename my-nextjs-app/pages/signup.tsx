import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8888';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/">
            <img src="/Logo-removebg-preview.png" alt="Logo" className="auth-logo" />
          </Link>
          <h2>Join Seniorly</h2>
          <p>Start your journey to smarter learning</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
      
      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          padding: 2rem;
          transition: background-color 0.3s ease;
        }
        .auth-card {
          background: var(--bg-card);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          width: 100%;
          max-width: 500px;
          border: 1px solid var(--border-color);
          transition: background-color 0.3s ease;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-logo {
          height: 60px;
          margin-bottom: 1rem;
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          transition: transform 0.2s;
        }
        .auth-logo:hover {
          transform: scale(1.05);
        }
        h2 {
          text-align: center;
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        p {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .auth-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        input:focus {
          border-color: #667eea;
        }
        .auth-btn {
          width: 100%;
          background: #667eea;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }
        .auth-btn:hover {
          background: #5a67d8;
        }
        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .auth-footer :global(a) {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Signup;
