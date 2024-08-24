import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

const Navbar = () => {
    return (
        <div className={styles.Navbar}>
            <input className={styles.Search}></input>
        </div>
    )
}

export default Navbar;