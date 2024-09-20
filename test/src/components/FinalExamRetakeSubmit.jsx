import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const FinalExamRetakeSubmit = () => {
    const { userId, groupId } = useParams();
    const location = useLocation();
    const { questions, overallScore, checkpointId } = location.state;
    const [answers, setAnswers] = useState({});
    const [resultMessage, setResultMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers({
            ...answers,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            checkpoint_id: checkpointId,
            ...answers
        };
        questions.forEach((question, index) => {
            postData[`question${index + 1}_id`] = question.id;
        });
        try {
            const response = await axios.post(`http://localhost:8000/blog/final-exam-retake-submit/${userId}/${groupId}/`, postData);
            setResultMessage(response.data.result);
        } catch (error) {
            console.error('There was an error submitting the final exam!', error);
        }
    };

    return (
        <div>
            <h1>Submit Final Exam Retake</h1>
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={index}>
                        <p>{question.text}</p>
                        <input
                            type="number"
                            name={`answer${index + 1}`}
                            min="1"
                            max="5"
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
                {resultMessage && <p>{resultMessage}</p>}
            </form>
        </div>
    );
};

export default FinalExamRetakeSubmit;
