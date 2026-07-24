import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('freelancer');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/users/register', { username, password, email, userType });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Username or email may be taken.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '520px' }}>
            <h2>Create Account</h2>
            
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

            {success && (
                <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid var(--success-color)',
                    color: '#a7f3d0',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                }}>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="flex-column">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Username</label>
                    <input 
                        type="text" 
                        placeholder="Choose a username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="flex-column">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="flex-column">
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="Choose a password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <div className="flex-column" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Join as</label>
                    <div className="role-cards">
                        <div 
                            className={`role-card ${userType === 'freelancer' ? 'selected' : ''}`}
                            onClick={() => setUserType('freelancer')}
                        >
                            <span className="role-card-icon">⚡</span>
                            <span className="role-card-title">Freelancer</span>
                        </div>
                        <div 
                            className={`role-card ${userType === 'client' ? 'selected' : ''}`}
                            onClick={() => setUserType('client')}
                        >
                            <span className="role-card-icon">💼</span>
                            <span className="role-card-title">Client</span>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};
export default Register;