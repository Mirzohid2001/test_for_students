import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FinalExamStart = () => {
    const { userId, groupId } = useParams();
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [overallScore, setOverallScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCheckpoints = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/blog/final-exam-start/${userId}/${groupId}/`);
                setCheckpoints(response.data);
            } catch (error) {
                console.error('There was an error fetching the checkpoints!', error);
            }
        };

        fetchCheckpoints();
    }, [userId, groupId]);

    const handleStartExam = async () => {
        if (!selectedCheckpoint) {
            alert('Please select a checkpoint');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/blog/final-exam-start/${userId}/${groupId}/`, {
                checkpoint_id: selectedCheckpoint
            });
            setQuestions(response.data.questions);
            setOverallScore(response.data.overall_score);
        } catch (error) {
            console.error('There was an error starting the exam!', error);
        }
    };

    const handleSubmitExam = () => {
        navigate(`/finalexam-submit/${userId}/${groupId}`, { state: { questions, overallScore, checkpointId: selectedCheckpoint } });
    };

    return (
        <div>
            <h1>Start Final Exam</h1>
            <div>
                <label>Select Checkpoint: </label>
                <select onChange={e => setSelectedCheckpoint(e.target.value)}>
                    <option value="" disabled>Select</option>
                    {checkpoints.map(checkpoint => (
                        <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.title}</option>
                    ))}
                </select>
                <button onClick={handleSubmitExam}>Start Exam</button>
            </div>
            {questions.length > 0 && (
                <div>
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.text}</p>
                            <input type="number" name={`answer${index + 1}`} min="1" max="5" />
                            <input type="hidden" name={`question${index + 1}_id`} value={question.id} />
                        </div>
                    ))}
                    <button onClick={handleSubmitExam}>Submit Exam</button>
                </div>
            )}
        </div>
    );
};

export default FinalExamStart;

