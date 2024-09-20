import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import '../static/user.css'

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/users/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    return (
        <div className="container">
            <div>
                <Menu />
            </div>
            <div className="user">
                <div className="user__list">
                    <div class="dashboard__table">
                        <div class="dashboard__subtitle">
                            <h1>Users</h1>
                            <div class="subtitles">
                                <div class="subtitle-1">
                                    <span>All Users</span>
                                </div>
                            </div>
                        </div>
                        <table class="d_table">
                            <thead style={{color: '#55597D'}}>
                                <tr>
                                    <th>No</th>
                                    <th>Name Of User</th>
                                    <th>Surname Of User</th>
                                    <th>Profile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.surname}</td>
                                        <Link to={`/user/${user.id}`} className='profile'><td> <span> Wiew Profile </span></td></Link>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <ul className="list-group">
                    {users.map(user => (
                        <li key={user.id} className="list-group-item">
                            <Link to={`/user/${user.id}`}>{user.name} {user.surname}</Link>
                        </li>
                    ))}
                </ul> */}
            </div>

        </div>
    );
};

export default UserList;



