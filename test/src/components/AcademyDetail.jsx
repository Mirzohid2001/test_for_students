import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../static/academydetail.css'

const AcademyDetail = () => {
    const { id } = useParams();
    const [academy, setAcademy] = useState('');
    const [groups, setGroups] = useState([]);
    const [overallAverage, setOverallAverage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkpointId, setCheckpointId] = useState(1);
    const [checkpoints, setCheckpoints] = useState([]);
    const [checkpointName, setCheckpointName] = useState('Checkpoint 1');

    useEffect(() => {
        axios.get('http://localhost:8000/blog/api/checkpoints/')
            .then(response => {
                setCheckpoints(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the checkpoints!', error);
            });
    }, []);

    useEffect(() => {
        if (checkpointId) {
            axios.get(`http://localhost:8000/blog/academy-detail/${id}/?checkpoint_id=${checkpointId}`)
                .then(response => {
                    setAcademy(response.data.academy_name);
                    setGroups(response.data.groups);
                    setOverallAverage(response.data.overall_academy_average);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the academy details!', error);
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

    return (
        <>
            <div className="academy__container">
                <div className="academy__title">
                    <h1>{academy}</h1>
                    <span>About {academy}</span>
                </div>
                <div className="a-detail__boxes">
                    <div className="a-detail__box">
                        <h1>Groups</h1>

                        <ol className='a-detail__list'>
                            {groups.map(group => (
                                <li key={group.group_id}>
                                    {group.group_name}
                                    <br />
                                    Group Average: {group.average_percentage}%
                                    {group.students.map(student => (
                                        <ul>
                                            <li>{student.student_name} - Average Percentage: {student.average_percentage}
                                                <br />
                                                <Link to={`/start-exam/${student.student_id}/${group.group_id}`}>
                                                    <span style={{ marginTop: '60px' }}>Start Exam</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    ))}
                                </li>
                            ))}

                        </ol>
                    </div>
                    <div className="a-detail__box">
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
                            <h3 style={{ fontSize: '20px', color: '#ACD3CC' }}>Selected Checkpoint: <br />{checkpointName}</h3>
                        </div>
                    </div>
                </div>
                <div className="overall">
                    <h1>Overall Academy Average Percentage:</h1>
                    <h1>{overallAverage}%</h1>
                </div>
            </div>
            {/* <hr />
            <div className="container">
                <h1>{academy}</h1>
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
                            <h3>{group.group_name}</h3>
                            <p>Group Average: {group.group_average_percentage}%</p>
                            <h4>Students:</h4>
                            <ul>
                                {group.students.map(student => (
                                    <li key={student.student_id}>
                                        {student.student_name} - Average Percentage: {student.average_percentage}
                                        {!student.exam_taken && (
                                            <Link to={`/start-exam/${student.student_id}/${group.group_id}`}>
                                                <button>Start Exam</button>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                <h2>Overall Academy Average Percentage: {overallAverage}%</h2>
            </div> */}
        </>
    );
};

export default AcademyDetail;



