import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', { username, password });
            const user = response.data;
            sessionStorage.setItem('user', JSON.stringify(user));
            if (user.userType === 'client') {
                navigate('/client-dashboard');
            } else {
                navigate('/freelancer-dashboard');
            }
        } catch (error) {
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && (
                <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid var(--danger-color)',
                    color: '#fca5a5',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="flex-column">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter your username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="flex-column">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                New user? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};
export default Login;