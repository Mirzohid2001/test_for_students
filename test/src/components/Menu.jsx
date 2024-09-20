import React from 'react'
import '../static/menu.css'
import { HiMiniAcademicCap } from "react-icons/hi2";
import { FaHome } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiExam } from "react-icons/pi";
import { MdClass } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";
import { MdOutlineGroups3 } from "react-icons/md";
import logo from '../static/images/logo.png'
import { Link } from 'react-router-dom';



export default function Menu() {
  return (
    <div className="menu">
            <div className="menu__brand">
                <img src={logo} alt=""/>
            </div>
            <div className="menu__content">
                <p className="menu__title">MAIN MENU</p>
                <Link to='/' className="menu__content__item">
                    <i><FaHome size={20} /></i><span>Home</span>
                </Link>
                <Link to="/users" className="menu__content__item">
                    <i><FaUsers size={20} /></i><span>Users</span>
                </Link>
                <Link to="/academies" className="menu__content__item">
                    <i><HiMiniAcademicCap size={20} /></i><span>Academics</span>
                </Link>
                <Link to="/groups" className="menu__content__item">
                    <i><LiaLayerGroupSolid size={20} /></i><span>Groups</span>
                </Link>
                <Link to="/teachers" className="menu__content__item">
                    <i><LiaChalkboardTeacherSolid  size={20}/></i><span>Teachers</span>
                </Link>
            </div>
            <div class="menu__content">
                <p class="menu__title">EXAMS</p>
                <Link to="/finalexam-groups" class="menu__content__item">
                    <i><PiExam size={20} /></i><span>Final Exams</span>
                </Link>
                <Link to="/finalexam-retakes" class="menu__content__item">
                    <i><PiExam size={20} /></i><span>Final Exam Retakes</span>
                </Link>
                <Link to="/retakes" class="menu__content__item">
                    <i><PiExam size={20} /></i><span>Retakes</span>
                </Link>
            </div>
            <div class="menu__content">
                <p class="menu__title">OTHER</p>
                <Link to="/masterclass" class="menu__content__item">
                    <i><MdClass size={20} /></i><span>Master Classes</span>
                </Link>
                <Link to='/concurs-groups' class="menu__content__item">
                    <i><MdOutlineGroups3 size={20} /></i><span>Concurs Groups</span>
                </Link>
                <Link to="/news" class="menu__content__item">
                    <i><LuNewspaper size={20} /></i><span>News</span>
                </Link>
            </div>
        </div>
  )
}
