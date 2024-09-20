import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Menu from './Menu';
import '../static/retake.css'

const RetakeList = () => {
    const [retakes, setRetakes] = useState([]);
    const groupId = 1;

    const fetchRetakes = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/blog/retakes/${groupId}/`);
            setRetakes(response.data);
        } catch (error) {
            console.error('There was an error fetching the retakes!', error);
        }
    };

    useEffect(() => {
        fetchRetakes();
    }, [groupId]);

    const handleRetake = async (userId, groupId) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/blog/retake-exam/${userId}/${groupId}/`,
                {
                    checkpoint_id: 1,
                    question1: 4,
                    question2: 3,
                    question3: 5,
                    question4: 2,
                    question5: 4,
                    question6: 1,
                    question7: 5,
                    question8: 2,
                    question9: 4,
                    question10: 3
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Retake exam submitted successfully:', response.data);
            fetchRetakes();
        } catch (error) {
            console.error('There was an error submitting the retake exam!', error);
        }
    };

    return (
        <div className='container'>
            <div>
                <Menu />
            </div>
            <div className="retake">
                <div className="retake__list">
                    <div class="retake__table">
                        <div class="retake__subtitle">
                            <h1>Retakes</h1>
                            <div class="retake-subtitles">
                                <div class="r-subtitle-1">
                                    <span>All Retakes</span>
                                </div>
                            </div>
                        </div>
                        <table class="r_table">
                            <thead style={{ color: '#55597D' }}>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Group Name</th>
                                    <th>Teacher Name</th>
                                    <th>Percentage</th>
                                    <th>Retakes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {retakes.map(retake => (
                                    <tr key={retake.id}>
                                        <td>{retake.student_name}</td>
                                        <td>{retake.group_name}</td>
                                        <td>{retake.teacher_name}</td>
                                        <td>{retake.percentage}%</td>
                                        <Link to={`/start-exam/${retake.user_id}/${groupId}/`} className='-retakeprofile'><td> <span> Ratake Exam </span></td></Link>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Group Name</th>
                        <th>Teacher Name</th>
                        <th>Percentage</th>
                        <th>Retake</th>
                    </tr>
                </thead>
                <tbody>
                    {retakes.map((retake, index) => (
                        <tr key={index}>
                            <td>{retake.student_name}</td>
                            <td>{retake.group_name}</td>
                            <td>{retake.teacher_name}</td>
                            <td>{retake.percentage}%</td>
                            <td>
                                <Link to={`/start-exam/${retake.user_id}/${groupId}/`}>
                                    Retake Exam
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
            </div>
        </div>
    );
};

export default RetakeList;












