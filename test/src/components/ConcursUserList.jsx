import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../static/ConcursUserList.css';

const ConcursUserList = () => {
    const { groupId } = useParams();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/blog/concurs/groups/${groupId}/users/`)
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, [groupId]);

    return (
        <div className="group-container">
            <h2 className="group-title">Users in Group</h2>
            <ul className="user-list">
                {users.map(user => (
                    <li key={user.id} className="user-item">
                        <Link to={`/concurs-submit/${groupId}/${user.id}`} className="user-link">
                            {user.name} {user.surname}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConcursUserList;



