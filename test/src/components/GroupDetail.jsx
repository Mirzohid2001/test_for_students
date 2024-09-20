import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../static/groupdetail.css'

const GroupDetail = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [students, setStudents] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkpoint, setCheckpoint] = useState('');
    const [checkpoints, setCheckpoints] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/api/checkpoints/`)
            .then(response => {
                setCheckpoints(response.data);
                if (response.data.length > 0) {
                    setCheckpoint(response.data[0].id);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the checkpoints!', error);
            });
    }, []);

    useEffect(() => {
        if (checkpoint) {
            axios.get(`http://localhost:8000/blog/groups/${id}/?checkpoint_id=${checkpoint}`)
                .then(response => {
                    setGroup(response.data);
                    setStudents(response.data.students);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the group details!', error);
                    setLoading(false);
                });
        }
    }, [id, checkpoint]);

    const handleFinalize = async () => {
        console.log(`http://localhost:8000/blog/group-average/${id}/?checkpoint_id=${checkpoint}`)
        try {
            const response = await axios.get(`http://localhost:8000/blog/group-average/${id}/?checkpoint_id=${checkpoint}`);
            setAverage(response.data.average_percentage);
        } catch (error) {
            console.error('There was an error fetching the group average!', error);
            setAverage('')
        }
    };
    console.log(checkpoint);
    useEffect(() => {
        handleFinalize()
    }, [checkpoint])

    if (loading) {
        return <div className="load"><div className='loading'><h1>Loading...</h1></div><div class="loader"></div></div>;
    }

    return (
        <>
            <div className="group-detail__container">
                <div className="group-detail__title">
                    <h1>{group.group_name}</h1>
                    <span>About Group</span>
                </div>
                <div className="group-detail__about">
                    <div className="group-detail__teacher">
                        <h1>Teacher: </h1><span>{group.teacher_name}</span>
                    </div>
                    <div className='group-detail__academy'>
                        <h1>Academy:  </h1><span>{group.academy_name}</span>
                    </div>
                    <div className='group-detail__select'>
                        <h1>Select Checkpoint:  </h1>
                        <select value={checkpoint} onChange={e => setCheckpoint(e.target.value)}>
                            {checkpoints.map(cp => (
                                <option key={cp.id} value={cp.id}>{cp.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className='group-detail__students'>
                        <h1 className='g-title'>Students:</h1>
                        {students.map(student => (
                            <div key={student.student_id} className="group-detail__student-list">
                                <div style={{ marginTop: '10px' }} className='g-student'>
                                    <h1 className='g-student-name'>{student.student_name}</h1>
                                    <h1 className='g-student-name'>Exam Taken: {student.exam_taken ? 'Yes' : 'No'}
                                        {!student.exam_taken && (
                                            <Link to={`/start-exam/${student.student_id}/${id}`}>
                                                <button className='exam__button'>Start Exam</button>
                                            </Link>
                                        )}
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="group-detail__total">
                        <h1>Total Percentage: </h1><span>{average}%</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupDetail;






















