import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface VocabularyItem {
    id: number;
    word: string;
    definition: string;
    part_of_speech: string;
}

const VocabularyList: React.FC = () => {
    const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const response = await api.get('/vocabulary');
                setVocabulary(response.data);
            } catch (error) {
                console.error('Error fetching vocabulary:', error);
            }
        };

        fetchVocabulary();
    }, []);

    return (
        <div>
            <h2>Vocabulary List</h2>
            <ul>
                {vocabulary.map((item) => (
                    <li key={item.id}>
                        <strong>{item.word}</strong> ({item.part_of_speech}): {item.definition}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VocabularyList