import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, setAuthToken } from '../services/api';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const response = await loginUser(formData.email, formData.password);
            const token = response.data.access_token;
            setAuthToken(token);
            setMessage('Login successful!');
            navigate('/review')
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type='email' name='email' placeholder='Email' onChange={handleChange}/>
                <input type='password' name='password' placeholder='Password' onChange={handleChange}/>
                <button type='submit'>Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login