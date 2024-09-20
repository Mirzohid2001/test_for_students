import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import '../static/teacher.css'


const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/teachers/')
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the teachers!', error);
            });
    }, []);

    return (
        <div className="container">
            <div>
                <Menu />
            </div>
            <div className="teachers">
                <div className="teacher__title">
                    <h1>Teachers</h1>
                    <span>All Teacher's List</span>
                </div>
                <div className="teacher__list">
                    {teachers.map(teacher => (
                        <div className="teacher__box" key={teacher.id}>
                            <div className="teacher__content">
                                <span className='number'>№{teacher.id}</span>
                                <h1>{teacher.name}</h1>
                                <Link to={`/teachers/${teacher.id}`}><button className='teacher__button'>More</button></Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default TeacherList;





