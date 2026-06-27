import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            alert('Invalid credentials');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            <p>New user? <Link to="/register">Register here</Link></p>
        </div>
    );
};
export default Login;