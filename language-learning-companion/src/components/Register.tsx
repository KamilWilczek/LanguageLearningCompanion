import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: ''});
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData.username, formData.email, formData.password);
            setMessage(response.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Registartion failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type='text' name='username' placeholder='Username' onChange={handleChange} />
                <input type='email' name='email' placeholder='Email' onChange={handleChange} />
                <input type='password' name='password' placeholder='Password' onChange={handleChange} />
                <button type='submit'>Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register