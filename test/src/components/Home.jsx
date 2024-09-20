import React from 'react';
import Dashboard from './Dashboard';
import Menu from './Menu';
import Navbar from './Navbar';

const Home = () => {
    return (
        <>
            <div className="container">
                <div>
                    <Menu/>
                </div>
                <div>
                    
                    <Dashboard/>
                </div>
                
                
            </div>
        </>

    );
};

export default Home;
