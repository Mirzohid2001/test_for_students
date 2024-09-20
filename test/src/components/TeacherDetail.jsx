import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../static/teacherdetail.css'


const TeacherDetail = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState({});
    const [groups, setGroups] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkpoints, setCheckpoints] = useState([]);
    const [checkpointId, setCheckpointId] = useState('');
    const [checkpointName, setCheckpointName] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/blog/api/checkpoints/')
            .then(response => {
                setCheckpoints(response.data);
                if (response.data.length > 0) {
                    setCheckpointId(response.data[0].id);
                    setCheckpointName(response.data[0].title);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the checkpoints!', error);
            });
    }, []);

    useEffect(() => {
        if (checkpointId) {
            axios.get(`http://localhost:8000/blog/teacher-detail/${id}/?checkpoint_id=${checkpointId}`)
                .then(response => {
                    setTeacher(response.data);
                    setGroups(response.data.groups);
                    setAverage(response.data.overall_average);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the teacher details!', error);
                    setLoading(false);
                });
        }
    }, [id, checkpointId]);

    if (loading) {
        return <div className="load"><div className='loading'><h1>Loading...</h1></div><div class="loader"></div></div>;
    }

    const handleCheckpointChange = (event) => {
        const selectedCheckpointId = event.target.value;
        const selectedCheckpointName = event.target.options[event.target.selectedIndex].text;
        setCheckpointId(selectedCheckpointId);
        setCheckpointName(selectedCheckpointName);
    };

    console.log(teacher);

    return (
        <>
            <div className="teacher__container">
                <div className="teacher__name">
                    <h1>{teacher.teacher_name}</h1>
                    <p>Full-Stack Developer</p>
                </div>
                {groups.map(group => (
                    <div className="teacher__boxes">
                        <div className="teacher__minibox">
                            <h1>Groups</h1>
                            <span>All Groups</span>
                            <ol className='student__list'>
                                <li key={group.group_id}>
                                    {group.group_name}
                                    <br />
                                    Group Average: {group.average_percentage}%
                                </li>
                            </ol>
                        </div>
                        <div className="teacher__minibox">
                            <h1>Studens</h1>
                            <span>All Students</span>
                            <ol className='student__list'>
                                {group.students.map(student => (
                                    <li key={student.student_id}>
                                        {student.student_name}
                                        <br />
                                        Average Percentage: {student.average_percentage}%
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="teacher__minibox">
                            <h1>Checkpoint</h1>
                            <div className="select">
                                <h3>Select Checkpoint</h3>
                                <select id="checkpoint" value={checkpointId} onChange={handleCheckpointChange}>
                                    {checkpoints.map(checkpoint => (
                                        <option key={checkpoint.id} value={checkpoint.id}>
                                            {checkpoint.title}
                                        </option>
                                    ))}
                                </select>
                                <h3 style={{fontSize: '20px', color: '#ACD3CC'}}>Selected Checkpoint: <br />{checkpointName}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <h1>{teacher.teacher_name}</h1>
            <label htmlFor="checkpoint">Select Checkpoint:</label>
            <select id="checkpoint" value={checkpointId} onChange={handleCheckpointChange}>
                {checkpoints.map(checkpoint => (
                    <option key={checkpoint.id} value={checkpoint.id}>
                        {checkpoint.title}
                    </option>
                ))}
            </select>
            <h2>Selected Checkpoint: {checkpointName}</h2>
            <h2>Groups:</h2>
            <ul>
                {groups.map(group => (
                    <li key={group.group_id}>
                        <strong>{group.group_name}</strong>
                        <p>Group Average: {group.average_percentage}%</p>
                        <h3>Students:</h3>
                        <ul>
                            {group.students.map(student => (
                                <li key={student.student_id}>
                                    {student.student_name} - Average Percentage: {student.average_percentage}%
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            {average !== null && (
                <div>
                    <h3>Overall Average Percentage: {average}%</h3>
                </div> */}
        </>
    );
};

export default TeacherDetail;



















