import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Flashcard from './Flashcard';
import { useNavigate } from 'react-router-dom';

interface ReviewItem {
    id: number;
    word: string;
    definition: string;
}

const ReviewDashboard: React.FC = () => {
    const [reviewList, setReviewList] = useState<ReviewItem[]>([]);
    const [page, setPage] = useState(1);
    const [size] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviewItems = async () => {
          try {
            const response = await api.get(`/vocabulary/review?page=${page}&size=${size}`);
            setReviewList(response.data.review_list);
            setTotalItems(response.data.total_items);
          } catch (error) {
            console.error('Error fetching review items:', error);
          }
        };
      
        fetchReviewItems();
      }, [page, size]);

    const handleRemembered = async (id: number, remembered: boolean) => {
        try {
            await api.post('/vocabulary/progress', {
                vocab_id: id,
                remembered,
            });
            setReviewList((prevList) => prevList.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

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
            <h2>Review Dashboard</h2>
            <button onClick={() => navigate('/vocabulary')}>Vocabulary List</button>
            {reviewList.map((item) => (
                <Flashcard
                key={item.id}
                word={item.word}
                definition={item.definition}
                onRemembered={(remembered) => handleRemembered(item.id, remembered)}
                />
            ))}
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button onClick={handleNextPage} disabled={page * size >= totalItems}>Next</button>
            </div>
            <button onClick={() => navigate('/add-vocabulary')}>Add New Word</button>
        </div>
    );
};

export default ReviewDashboard