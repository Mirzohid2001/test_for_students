import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../static/ConcursSubmitAnswers.css';

const ConcursSubmitAnswers = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/concurs/checkpoints/`)
            .then(response => setCheckpoints(response.data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (selectedCheckpoint) {
            axios.get(`http://localhost:8000/blog/concurs/checkpoints/${selectedCheckpoint}/questions/`)
                .then(response => setQuestions(response.data))
                .catch(error => console.error(error));
        }
    }, [selectedCheckpoint]);

    const handleCheckpointChange = (event) => {
        setSelectedCheckpoint(event.target.value);
        setQuestions([]); // Oldingi savollarni tozalash
    };

    const handleChange = (questionId, answerId) => {
        setAnswers({ ...answers, [questionId]: answerId });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const postRequests = Object.entries(answers).map(([questionId, answerId]) => {
            return axios.post(`http://localhost:8000/blog/concurs/submit-answer/${userId}/${questionId}/`, {
                answer_id: answerId
            });
        });

        Promise.all(postRequests)
            .then(() => navigate(`/concurs-groups/`))
            .catch(error => console.error(error));
    };

    return (
        <div className="container">
            <h2>Submit Answers</h2>
            <form onSubmit={handleSubmit}>
                <label>Select Checkpoint: </label>
                <select
                    className="checkpoint-select"
                    onChange={handleCheckpointChange}
                    value={selectedCheckpoint || ''}
                >
                    <option value="" disabled>Select Checkpoint</option>
                    {checkpoints.map(checkpoint => (
                        <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.title}</option>
                    ))}
                </select>
                {questions.length > 0 ? (
                    <div className="question-list">
                        {questions.map(question => (
                            <div key={question.id} className="question-container">
                                <label>{question.text}</label>
                                <div className="answer-list">
                                    {question.answers && question.answers.length > 0 ? (
                                        question.answers.map(answer => (
                                            <div key={answer.id} className="answer">
                                                <input
                                                    type="checkbox"
                                                    checked={answers[question.id] === answer.id}
                                                    onChange={() => handleChange(question.id, answer.id)}
                                                />
                                                <label>{answer.text}</label>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No answers available for this question.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    selectedCheckpoint && <p>No questions available for this checkpoint.</p>
                )}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ConcursSubmitAnswers;










