import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const FinalExamRetakeList = () => {
    const [retakes, setRetakes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRetakes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/blog/final-exam-retake-list/');
                setRetakes(response.data);
            } catch (error) {
                console.error('There was an error fetching the retake exams!', error);
            }
        };

        fetchRetakes();
    }, []);

    const handleRetakeExam = (userId, groupId) => {
        navigate(`/finalexam-retake/${userId}/${groupId}`);
    };

    return (
        <div className='container'>
            <div>
                <Menu/>
            </div>
            <h2>Final Exam Retakes</h2>
            <ul>
                {retakes.map((retake, index) => (
                    <li key={index}>
                        {retake.student_name} - {retake.group_name} - {retake.teacher_name} - {retake.percentage}%
                        <button onClick={() => handleRetakeExam(retake.user_id, retake.group_id)}>Retake Exam</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FinalExamRetakeList;







