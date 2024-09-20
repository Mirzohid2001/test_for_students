import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import '../static/MasterClassList.css';


const MasterClassList = () => {
    const [masterClasses, setMasterClasses] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [teacher, setTeacher] = useState('');
    const [day, setDay] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchMasterClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/blog/masterclass/');
                setMasterClasses(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/blog/teachers/');
                setTeachers(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMasterClasses();
        fetchTeachers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/blog/masterclass/', {
                title,
                content,
                teacher,
                day
            });
            setMasterClasses([...masterClasses, response.data]);
            setTitle('');
            setContent('');
            setTeacher('');
            setDay('');
            setSuccessMessage('Master class added successfully');
        } catch (err) {
            setError('Error adding master class');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container'>
            <div>
                <Menu/>
            </div>
            <h1>Master Classes</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <ul className="masterclass-list">
                {masterClasses.map((masterClass) => (
                    <li key={masterClass.id} className="masterclass-item">
                        <h2>{masterClass.title}</h2>
                        <p>{masterClass.content}</p>
                        <p>Teacher: {masterClass.teacher.name}</p>
                        <p>Day: {masterClass.day}</p>
                    </li>
                ))}
            </ul>
            <h2>Add Master Class</h2>
            <form onSubmit={handleSubmit} className="masterclass-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teacher:</label>
                    <select
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                        required
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Day:</label>
                    <input
                        type="text"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Master Class</button>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default MasterClassList;


