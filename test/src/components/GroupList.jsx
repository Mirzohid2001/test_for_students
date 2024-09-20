import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import '../static/group.css'

const GroupList = () => {
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
        <div className='container'>
            <div>
                <Menu/>
            </div>
            <div className="groups">
                <div className="group-title">
                    <h1>Groups</h1>
                    <span>All Group`s List</span>
                </div>
                <div className="teacher__list">
                    {groups.map((group) => (
                        <div className="group__box" key={group.id}>
                            <div className="group__content">
                                <span className='number'>№{group.id}</span>
                                <h1>{group.title}</h1>
                                <Link to={`/groups/${group.id}`}><button className='group__button'>More</button></Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            {/* <h2>Groups</h2>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        <Link to={`/groups/${group.id}`}>{group.title}</Link>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default GroupList;



