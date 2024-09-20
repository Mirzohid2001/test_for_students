import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import '../static/news.css'
import img from '../static/images/billieeilish.jpg'
import { FaRegCalendarAlt } from "react-icons/fa"; 

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:8000/blog/news/');
                setNews(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <div className="load"><div className='loading'><h1>Loading...</h1></div><div class="loader"></div></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container'>
            <div>
                <Menu />
            </div>
            <div className="news">
                <div className="news__title">
                    <h1>News List</h1>
                    <p>All News</p>
                </div>
                <div className="news__list">
                    {news.map((item) => (
                        <div key={item.id} className="list-item">
                            <div className="list-image">
                                <img src={item.image} style={{ width: '350px', height: '227px', borderRadius: '15px' }} alt="" />
                            </div>
                            <div className="list-content">
                                <h1 className='content-title'>{item.title}</h1>
                                <p className='content-content'>{item.content}</p>
                                <div className="spacer"></div>
                                <small><FaRegCalendarAlt /> {new Date(item.created_at).toLocaleDateString()} </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <h1>News List</h1>
            <div>
                {news.map((item) => (
                    <div>
                        <h2>{item.title}</h2>
                        <p>{item.content}</p>
                        <img style={{width: '100px'}} src={item.image} alt="no image" />
                        <small>{new Date(item.created_at).toLocaleDateString()}</small>
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default NewsList;
