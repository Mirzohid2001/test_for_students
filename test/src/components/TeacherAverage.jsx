import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TeacherAverage = () => {
    const { teacherId } = useParams();
    const [average, setAverage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/teachers/${teacherId}/average/`)
            .then(response => {
                setAverage(response.data.teacher_average);
            })
            .catch(error => {
                console.error('There was an error fetching the teacher average!', error);
            });
    }, [teacherId]);

    return (
        <div className="container">
            <h1>Teacher Average</h1>
            {average !== null ? <p>Average: {average}%</p> : <p>Loading...</p>}
        </div>
    );
};

export default TeacherAverage;

