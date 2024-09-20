import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GroupAverage = () => {
    const { groupId } = useParams();
    const [average, setAverage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/groups/${groupId}/average/`)
            .then(response => {
                setAverage(response.data.group_average);
            })
            .catch(error => {
                console.error('There was an error fetching the group average!', error);
            });
    }, [groupId]);

    return (
        <div className="container">
            <h1>Group Average</h1>
            {average !== null ? <p>Average: {average}%</p> : <p>Loading...</p>}
        </div>
    );
};

export default GroupAverage;

