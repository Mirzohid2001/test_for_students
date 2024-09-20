import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetailFinalExam = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/blog/finalexam/user-detail/${userId}/`);
                setUser(response.data);
            } catch (error) {
                console.error('There was an error fetching the user details!', error);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user)
        return <div className="load"><div className='loading'><h1>Loading...</h1></div><div class="loader"></div></div>;


    return (
        <>
          
            <div className="container">
                <h1>{user.user_name}</h1>
                <p>Group: {user.group_name}</p>
                <p>Teacher: {user.teacher_name}</p>
                <p>Total Percentage: {user.total_percentage}%</p>
            </div>
        </>
    );
};

export default UserDetailFinalExam;


