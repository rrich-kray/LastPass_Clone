import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { IoIosHome } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";

const Sidebar = () => {
    return (
        <div className={styles.Sidebar}>
            <div className={styles.SidebarLinkContainer}>
                <div className={styles.SidebarLink}>
                    <IoIosHome className={styles.LinkIcon} />
                    <a className={styles.Link}>All Items</a>
                </div>
                <div className={styles.SidebarLink}>
                    <FaLock />
                    <a className={styles.Link}>Passwords</a>
                </div>
                <div className={styles.SidebarLink}>
                    <FaNoteSticky />
                    <a className={styles.Link}>Notes</a>
                </div>
                <div className={styles.SidebarLink}>
                    <a className={styles.Link}>Addresses</a>
                </div>
                <div className={styles.SidebarLink}>
                    <a className={styles.Link}>Payment Cards</a>
                </div>
                <div className={styles.SidebarLink}>
                    <a className={styles.Link}>Bank Accounts</a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;