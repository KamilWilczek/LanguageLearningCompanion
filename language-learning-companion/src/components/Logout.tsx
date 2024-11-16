import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;