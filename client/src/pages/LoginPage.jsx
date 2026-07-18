import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine, RiBuildingLine, RiLockLine, RiUserLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ username: 'admin', password: 'Admin@123' });
    else setForm({ username: 'user', password: 'User@123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb orb-1"></div>
        <div className="auth-orb orb-2"></div>
        <div className="auth-orb orb-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <RiBuildingLine />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to Employee Management Portal</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrap">
              <RiUserLine className="input-icon" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <RiLockLine className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? (
              <><div className="btn-spinner"></div> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-label">Quick Demo Login</p>
          <div className="demo-btns">
            <button className="demo-btn admin" onClick={() => fillDemo('admin')}>
              👑 Admin
            </button>
            <button className="demo-btn user" onClick={() => fillDemo('user')}>
              👤 User
            </button>
          </div>
        </div>

        <p className="auth-link">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
