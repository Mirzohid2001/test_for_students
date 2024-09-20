import React from 'react';
import useCountAnimation from '../static/js/counting';
import '../static/dashboard.css';
import { FaUsers } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MdInsertChartOutlined } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { FaRegCalendar } from "react-icons/fa6";


export default function Dashboard() {
    const visitorsCount = useCountAnimation(92680);
    const pageViewsCount = useCountAnimation(580500);
    const bounceRatesCount = useCountAnimation(15.43);
    const newUsersCount = useCountAnimation(17805);
    const onlineUsersCount = useCountAnimation(1846);

    return (
        <>
            <div className="header">
                <div className="header__dashboard">
                    <div className="dashboard__title">
                        <h1>Dashboard</h1>
                    </div>
                    <div className="dashboard__subtitle">
                        <h1>Site Performance</h1>
                        <div className="subtitles">
                            <div className="subtitle-1">
                                <span>Today vs 7days ago</span>
                            </div>
                            <div className="subtitle-2">
                                <span><i><FaRegCalendar size={''}/></i> JUNE 03, 22 TO JULY 02, 22</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboards">
                        <div className="dashboard">
                            <div className="inside-1">
                                <p>Visitors</p>
                                <i><FaUsers size={20}/></i>
                            </div>
                            <div className="inside-2">
                                <h1 className="count">{visitorsCount}</h1>
                            </div>
                            <div className="inside-3">
                                <p>+3,840 (26.08%)</p>
                                <i><LuArrowDownUp size={20}/></i>
                            </div>
                        </div>
                        <div className="dashboard-2">
                            <div className="inside2-1">
                                <p>Page views</p>
                                <i><FaRegEye size={20}/></i>
                            </div>
                            <div className="inside2-2">
                                <h1 className="count">{pageViewsCount}</h1>
                            </div>
                            <div className="inside2-3">
                                <p>+210K (16.20%)</p>
                                <i><LuArrowDownUp size={20}/></i>
                            </div>
                        </div>
                        <div className="dashboard-3">
                            <div className="inside3-1">
                                <p>Bounce rates</p>
                                <i><MdInsertChartOutlined size={20}/></i>
                            </div>
                            <div className="inside3-2">
                                <h1 className="count">{bounceRatesCount}</h1><span>%</span>
                            </div>
                            <div className="inside3-3">
                                <p>-0.74 (0.74%)</p>
                                <i><LuArrowDownUp size={20}/></i>
                            </div>
                        </div>
                        <div className="dashboard__end">
                            <span>View all</span>
                        </div>
                    </div>
                    <div className="dashboard__subtitle">
                        <h1>Users Statistics</h1>
                        <div className="subtitles">
                            <div className="subtitle-1">
                                <span>Today's statistics</span>
                            </div>
                            <div className="subtitle-2">
                                <span><i><FaRegCalendar size={''}/></i> JUNE 03, 22 TO JULY 02, 22</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboards">
                        <div className="dashboard-4">
                            <div className="inside4-1">
                                <p>New users</p>
                                <i><FaUserPlus size={20}/></i>
                            </div>
                            <div className="inside4-2">
                                <h1 className="count">{newUsersCount}</h1>
                            </div>
                            <div className="inside4-3">
                                <p>+1,500 (4.17%)</p>
                                <i><LuArrowDownUp size={20}/></i>
                            </div>
                        </div>
                        <div className="dashboard-5">
                            <div className="inside5-1">
                                <p>Online users</p>
                                <i><FaChartLine size={20}/></i>
                            </div>
                            <div className="inside5-2">
                                <h1 className="count">{onlineUsersCount}</h1>
                            </div>
                            <div className="inside5-3">
                                <p>+530 (8.38%)</p>
                                <i><LuArrowDownUp size={20}/></i>
                            </div>
                        </div>
                        <div className="dashboard__end">
                            <span>View all</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
