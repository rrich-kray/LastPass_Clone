import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import UserOptionsButton from "../UserOptionsButton/UserOptionsButton";
import logo from "../../Assets/LastPass_Logo.webp"

const Navbar = ({ baseUrl }: { baseUrl: string}) => {
    return (
        <div className={styles.Navbar}>
            <div className={styles.NavbarLogoContainer}>
                <img src={logo} style={{ height: "50px" }} />
            </div>
            <input className={styles.Search}></input>
            <UserOptionsButton baseUrl={baseUrl} />
        </div>
    )
}

export default Navbar;