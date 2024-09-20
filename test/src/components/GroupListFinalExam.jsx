import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import '../static/finalexamgroups.css'

const GroupListFinalExam = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8000/blog/groups/');
                setGroups(response.data);
            } catch (error) {
                console.error('There was an error fetching the groups!', error);
            }
        };

        fetchGroups();
    }, []);

    return (
        <>
        <div className='container'>
            <div>
                <Menu/>
            </div>
            <div className="final-exam__groups">
                <div className="final-exam__group-title">
                    <h1>Final Exam Groups</h1>
                    <span>All Group`s List</span>
                </div>
                <div className="final-exam-group__list">
                    {groups.map((group) => (
                        <div className="final-exam-group__box" key={group.id}>
                            <div className="final-exam-group__content">
                                <span className='number'>№{group.id}</span>
                                <h1>{group.title}</h1>
                                <Link to={`/finalexam-groups/${group.id}`}><button className='final-exam-group__button'>More</button></Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
        </>
    );
};

export default GroupListFinalExam;
