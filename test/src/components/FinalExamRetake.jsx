import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FinalExamRetake = () => {
    const { userId, groupId } = useParams();
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCheckpoints = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/blog/final-exam-checkpoints/`);
                setCheckpoints(response.data);
            } catch (error) {
                console.error('There was an error fetching the checkpoints!', error);
            }
        };

        fetchCheckpoints();
    }, []);

    const handleStartExam = async () => {
        if (!selectedCheckpoint) {
            alert('Please select a checkpoint');
            return;
        }

        const data = {
            checkpoint_id: selectedCheckpoint
        };
        console.log('Sending data:', data);

        try {
            const response = await axios.post(`http://localhost:8000/blog/final-exam-start/${userId}/${groupId}/`, data);
            setQuestions(response.data.questions);
        } catch (error) {
            console.error('There was an error starting the exam!', error);
            console.log(error.response.data);
        }
    };

    const handleAnswerChange = (index, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [`answer${index + 1}`]: value
        }));
    };

    const handleSubmitExam = async () => {
        const postData = {
            checkpoint_id: selectedCheckpoint,
            ...answers
        };

        questions.forEach((question, index) => {
            postData[`question${index + 1}_id`] = question.id;
        });

        console.log('Submitting data:', postData);

        try {
            const response = await axios.post(`http://localhost:8000/blog/final-exam-retake/${userId}/${groupId}/`, postData);
            console.log(response.data);
            navigate(`/finalexam-retake-result/${userId}/${groupId}`);
        } catch (error) {
            console.error('There was an error submitting the exam!', error);
        }
    };

    return (
        <div>
            <h1>Start Final Exam Retake</h1>
            <div>
                <label>Select Checkpoint: </label>
                <select onChange={e => setSelectedCheckpoint(e.target.value)} value={selectedCheckpoint}>
                    <option value="">Select</option>
                    {checkpoints.map(checkpoint => (
                        <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.title}</option>
                    ))}
                </select>
                <button onClick={handleStartExam}>Start Exam</button>
            </div>
            {questions.length > 0 && (
                <div>
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.text}</p>
                            <input
                                type="number"
                                name={`answer${index + 1}`}
                                min="1"
                                max="5"
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                            />
                            <input type="hidden" name={`question${index + 1}_id`} value={question.id} />
                        </div>
                    ))}
                    <button onClick={handleSubmitExam}>Submit Exam</button>
                </div>
            )}
        </div>
    );
};

export default FinalExamRetake;











