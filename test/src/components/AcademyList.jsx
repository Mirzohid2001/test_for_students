import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import '../static/academy.css'

const AcademyList = () => {
    const [academies, setAcademies] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/academies/')
            .then(response => {
                setAcademies(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the academies!', error);
            });
    }, []);

    return (
        <div className="container">
            <div>
                <Menu />
            </div>
            <div className="academy__list">
                <h1 className='title'>Academies</h1>
                <p className='subtitle'>Academy List</p>
                <div className="academy">
                    {academies.map(academy => (
                        <Link to={`/academies/${academy.id}`} key={academy.id} className="academy__box">
                            <h1 className="academic__title" style={{fontSize: '20px', marginLeft: '3px'}}>Academy №{academy.id}</h1>
                            <h1 className='academic__title'>{academy.title}</h1>
                        </Link>
                    ))}

                </div>
            </div>
            {/* <h1>Academies</h1>
            <ul className="list-group">
                {academies.map(academy => (
                    <li key={academy.id} className="list-group-item">
                        <Link to={`/academies/${academy.id}`}>{academy.title}</Link>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default AcademyList;




