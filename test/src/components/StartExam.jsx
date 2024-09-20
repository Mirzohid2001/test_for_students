import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StartExam = () => {
    const { userId, groupId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [checkpointId, setCheckpointId] = useState(null); // Add checkpoint ID state
    const [checkpointName, setCheckpointName] = useState(''); // Add checkpoint Name state
    const [error, setError] = useState('');

    const handleCheckpointChange = (e) => {
        const selectedCheckpointId = e.target.value;
        setCheckpointId(selectedCheckpointId);
        const selectedCheckpointName = e.target.options[e.target.selectedIndex].text;
        setCheckpointName(selectedCheckpointName);

        fetchQuestions(selectedCheckpointId);
    };

    const fetchQuestions = async (checkpointId) => {
        try {
            const response = await axios.get(`http://localhost:8000/blog/start-exam/${userId}/${groupId}/?checkpoint_id=${checkpointId}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('There was an error fetching the questions!', error);
        }
    };

    useEffect(() => {
        if (checkpointId) {
            fetchQuestions(checkpointId);
        }
    }, [userId, groupId, checkpointId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers({
            ...answers,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8000/blog/start-exam/${userId}/${groupId}/`,
                {
                    checkpoint_id: checkpointId,
                    ...answers
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Exam submitted successfully:', response.data);
            navigate('/retakes');
        } catch (error) {
            console.error('There was an error submitting the exam!', error);
            setError('There was an error submitting the exam. Please try again.');
        }
    };

    return (
        <div>
            <h1>Start Exam</h1>
            <label>
                Select Checkpoint:
                <select onChange={handleCheckpointChange}>
                    <option value="">Select a checkpoint</option>
                    <option value="1">Checkpoint 1</option>
                    <option value="2">Checkpoint 2</option>
                    <option value="3">Checkpoint 3</option>
                    {/* Add more options as needed */}
                </select>
            </label>
            {checkpointName && <h2>Selected Checkpoint: {checkpointName}</h2>}
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={index}>
                        <label>
                            {index + 1}. {question.text}
                            <input
                                type="number"
                                name={`question${question.id}`}
                                value={answers[`question${question.id}`] || ''}
                                onChange={handleChange}
                                required
                                min="1"
                                max="5"
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">Submit</button>
                {error && alert(error)}
            </form>
        </div>
    );
};

export default StartExam;




































