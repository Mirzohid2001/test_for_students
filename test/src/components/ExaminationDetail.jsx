import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ExaminationDetail() {
    const { id } = useParams();
    const [examination, setExamination] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/examinations/${id}/`)
            .then(response => {
                setExamination(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the examination details!', error);
            });
    }, [id]);

    if (!examination) return <div>Loading...</div>;

    return (
        <div>
            <h1>Examination Detail</h1>
            <p>{examination.title}</p>
            <p>{examination.description}</p>
            {/* Add more fields as necessary */}
        </div>
    );
}

export default ExaminationDetail;
