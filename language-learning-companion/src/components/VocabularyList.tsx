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
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const response = await api.get(`/vocabulary?page=${page}&size=${size}`);
                setVocabulary(response.data.vocabulary);
                setTotalItems(response.data.total_items);
            } catch (error) {
                console.error('Error fetching vocabulary:', error);
            }
        };

        fetchVocabulary();
    }, [page, size]);

    const handleNextPage = () => {
        if (page * size < totalItems) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

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
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button onClick={handleNextPage} disabled={page * size >= totalItems}>Next</button>
            </div>
        </div>
    );
};

export default VocabularyList