import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, Link} from 'react-router-dom';
import '../static/userdetail.css';

const UserDetail = () => {
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState('');
    const [checkpointName, setCheckpointName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/api/checkpoints/')
            .then(response => {
                setCheckpoints(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the checkpoints!', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedCheckpoint) {
            setLoading(true);  // Yangi checkpoint tanlanganda loading holatini true qilish
            axios.get(`http://localhost:8000/blog/user-detail/${userId}/?checkpoint_id=${selectedCheckpoint}`)
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the user details!', error);
                    setLoading(false);
                });
        }
    }, [userId, selectedCheckpoint]);

    const handleCheckpointChange = (event) => {
        const selectedCheckpointId = event.target.value;
        const selectedCheckpointName = event.target.options[event.target.selectedIndex].text;
        setSelectedCheckpoint(selectedCheckpointId);
        setCheckpointName(selectedCheckpointName);
    };

    if (loading) {
        return <div className="load">
            <div className='loading'><h1>Loading...</h1></div>
            <div className="loader"></div>
        </div>;
    }

    // if (!user) {
    //     return <div>No user data available</div>;
    // }

    return (
        <div className="user-detail__container">
            <div className="user-detail__checkpoint">
                <h2>Select Checkpoint:</h2>
                <select
                    value={selectedCheckpoint}
                    onChange={handleCheckpointChange}
                >
                    <option value="">Select Checkpoint</option>
                    {checkpoints.map(cp => (
                        <option key={cp.id} value={cp.id}>{cp.title}</option>
                    ))}
                </select>
            </div>
            {user &&
                <>
                    <div className="user-detail__title">
                        <h1>{user.user_name}</h1>
                        <span>About User</span>
                    </div>
                    <div className="user-detail__about">
                        <div className='user-detail__group'>
                            <h1>Group: </h1><span>{user.group_name}</span>
                        </div>
                        <div className="user-detail__teacher">
                            <h1>Teacher: </h1><span>{user.teacher_name}</span>
                        </div>
                        <div className="user-detail__total">
                            <h1>Total Percentage: </h1><span>{user.total_percentage}%</span>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default UserDetail;












