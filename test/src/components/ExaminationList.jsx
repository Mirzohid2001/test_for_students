import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExaminationList() {
    const [examinations, setExaminations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/examinations/')
            .then(response => {
                setExaminations(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the examinations!', error);
            });
    }, []);

    return (
        <div>
            <h1>Examination List</h1>
            <ul>
                {examinations.map(examination => (
                    <li key={examination.id}>{examination.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default ExaminationList;
