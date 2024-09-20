import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AcademyAverage = () => {
    const { academyId } = useParams();
    const [average, setAverage] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/academies/${academyId}/average/`)
            .then(response => {
                setAverage(response.data.academy_average);
                setStatus(response.data.status);
            })
            .catch(error => {
                console.error('There was an error fetching the academy average!', error);
            });
    }, [academyId]);

    return (
        <div className="container">
            <h1>Academy Average</h1>
            {average !== null ? <p>Average: {average}%</p> : <p>Loading...</p>}
            {status && <p>Status: {status}</p>}
        </div>
    );
};

export default AcademyAverage;

