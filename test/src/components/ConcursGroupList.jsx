import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../static/ConcursGroupList.css';

const ConcursGroupList = () => {
    const [groups, setGroups] = useState([]);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/concurs/groups/')
            .then(response => {
                console.log(response.data);
                setGroups(response.data);
            })
            .catch(error => console.error('There was an error fetching the groups!', error));
    }, []);

    const finalizeConcurs = () => {
        axios.get(`http://localhost:8000/blog/concurs/winner/`)
            .then(response => {
                setWinner(response.data[0]);
                alert(`Overall Winner: User ID: ${response.data[0].user_id}, Correct Answers: ${response.data[0].total_correct}`);
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred while finalizing the concurs.');
            });
    };

    return (
        <div className="groups-container">
            <h2>Groups</h2>
            <ul>
                {groups.map(group => (
                    <li key={group.id} className="group-item">
                        <h3>{group.title}</h3>
                        <p>Academy ID: {group.academy}</p>
                        <p>Teacher ID: {group.teacher}</p>
                        <p>Number of Students: {group.students.length}</p>
                        {/* Qo'shilayotgan link */}
                        <Link to={`/concurs/groups/${group.id}/users`}>View Students</Link>
                    </li>
                ))}
            </ul>
            <button className="finalize-button" onClick={finalizeConcurs}>Finalize Concurs</button>
            {winner && (
                <div className="overall-winner">
                    <h3>Overall Winner:</h3>
                    <p>User ID: {winner.user_id}, Correct Answers: {winner.total_correct}</p>
                </div>
            )}
        </div>
    );
};

export default ConcursGroupList;







