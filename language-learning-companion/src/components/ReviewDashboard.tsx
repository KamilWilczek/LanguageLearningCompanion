import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Flashcard from './Flashcard';

interface ReviewItem {
    id: number;
    word: string;
    definition: string;
}

const ReviewDashboard: React.FC = () => {
    const [reviewList, setReviewList] = useState<ReviewItem[]>([]);

    useEffect(() => {
        const fetchReviewItems = async () => {
          try {
            const response = await api.get('/vocabulary/review');
            setReviewList(response.data);
          } catch (error) {
            console.error('Error fetching review items:', error);
          }
        };
      
        fetchReviewItems();
      }, []);

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

    return (
        <div>
            <h2>Review Dashboard</h2>
            {reviewList.map((item) => (
                <Flashcard
                key={item.id}
                word={item.word}
                definition={item.definition}
                onRemembered={(remembered) => handleRemembered(item.id, remembered)}
                />
            ))}
        </div>
    );
};

export default ReviewDashboard