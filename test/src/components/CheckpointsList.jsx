import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CheckpointsList() {
    const [checkpoints, setCheckpoints] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/checkpoints/')
            .then(response => {
                setCheckpoints(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the checkpoints!', error);
            });
    }, []);

    return (
        <div>
            <h1>Checkpoints List</h1>
            <ul>
                {checkpoints.map(checkpoint => (
                    <li key={checkpoint.id}>
                        <Link to={`/checkpoints/${checkpoint.id}`}>{checkpoint.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CheckpointsList;
