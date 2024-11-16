import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddVocabulary: React.FC = () => {
    const [formData, setFormData] = useState({ word: '', definition: '', part_of_speech: ''});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/vocabulary', formData);
            setMessage('Word added successfully!');
            setFormData({ word: '', definition: '', part_of_speech: ''});
        } catch (error) {
            console.error('Error adding word:', error);
            setMessage('Failed to add word.');
        }
    };

    return (
        <div>
            <h2>Add Vocabulary</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Word:</label>
                    <input type='text' name='word' value={formData.word} onChange={handleChange} required />
                </div>
                <div>
                    <label>Definition:</label>
                    <input type='text' name='definition' value={formData.definition} onChange={handleChange} required />
                </div>
                <div>
                    <label>Part of Speech:</label>
                    <input type='text' name='part_of_speech' value={formData.part_of_speech} onChange={handleChange} required />
                </div>
                <button type='submit'>Add Word</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={() => navigate('/review')}>Go to Review</button>
        </div>
    )
};

export default AddVocabulary;