import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const GroupDetailFinalExam = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/finalexam-groups/${id}/`)
            .then(response => {
                setGroup(response.data);
                setStudents(response.data.students);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the group details!', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }
    console.log(students)
    return (
        <div className="container">
            <h1>{group.group_name}</h1>
            <p>Teacher: {group.teacher_name}</p>
            <p>Academy: {group.academy_name}</p>
            <h2>Students:</h2>
            <ul>
                {students.map(student => (
                    <li key={student.student_id}>
                        {student.student_name} - Exam Taken: {student.exam_taken ? `Yes (${student.average_percentage}%)` : 'No'}
                        {!student.exam_taken && (
                            <Link to={`/final-exam-start/${student.student_id}/${id}`}>
                                <button>Start Final Exam</button>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupDetailFinalExam;








