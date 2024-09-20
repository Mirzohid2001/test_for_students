import React from 'react'
import '../static/navbar.css'
import { IoSearchSharp } from "react-icons/io5";

export default function Navbar() {
    return (
        <div className="header">
            <nav class="navbar">
                <div class="navbar__brand">
                    <div class="brand">
                        <input type="text" class="navbar__input " placeholder="Search..." />
                        <i style={{color: '#55597D'}}><IoSearchSharp size={20} color={'#55597D'}/></i>
                    </div>
                </div>
                <div class="navbar__menu">
                    <a href="#" class="navbar__menu__items">Analystics</a>
                    <a href="#" class="navbar__menu__items">Earnings</a>
                    <a href="#" class="navbar__menu__items">Add Experiements</a>
                </div>
                <div class="navbar__end">
                    <div class="navbar__user">
                        <div class="user__image">
                            <img src="./images/People.png" alt="" />
                        </div>
                        <div class="navbar__about">
                            <p>WELCOME <br /> <span>Daniel Estamos</span></p>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
