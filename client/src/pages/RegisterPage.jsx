import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiBuildingLine,
  RiLockLine,
  RiUserLine,
  RiMailLine,
  RiShieldUserLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'User',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.email) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the Employee Management Portal</p>
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
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <RiMailLine className="input-icon" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
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
                placeholder="Min 6 characters"
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

          <div className="form-group">
            <label>Role</label>
            <div className="input-icon-wrap">
              <RiShieldUserLine className="input-icon" />
              <select name="role" value={form.role} onChange={handleChange} className="auth-select">
                <option value="User">User — View Only</option>
                <option value="Admin">Admin — Full Access</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? (
              <><div className="btn-spinner"></div> Creating Account...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
