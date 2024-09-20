import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ConcursWinner = () => {
    const { checkpointId } = useParams();
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/concurs/winner/${checkpointId}/`)
            .then(response => setWinners(response.data))
            .catch(error => console.error(error));
    }, [checkpointId]);

    return (
        <div>
            <h2>Concurs Winners</h2>
            <ul>
                {winners.map(winner => (
                    <li key={winner.user_id}>
                        User ID: {winner.user_id} - Total Correct: {winner.total_correct}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConcursWinner;

