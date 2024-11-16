import React, { useState } from 'react';

interface FlashcardProps {
    word: string;
    definition: string;
    onRemembered: (remembered: boolean) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, definition, onRemembered }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className='flashcard'>
            <h3>{word}</h3>
            {isRevealed ? (
                <p>{definition}</p>
            ) : (
                <button onClick={() => setIsRevealed(true)}>Reveal Definition</button>
            )}
            <button onClick={() => onRemembered(true)}>Remembered</button>
            <button onClick={() => onRemembered(false)}>Forgot</button>
        </div>
    );
};

export default Flashcard;