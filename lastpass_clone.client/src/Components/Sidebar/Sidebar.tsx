import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { IoIosHome } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className={styles.Sidebar}>
            <div className={styles.SidebarLinkContainer}>
                <div className={styles.SidebarLink} style={{ marginBottom: "25px" }}>
                    <FaArrowAltCircleLeft className={styles.SidebarLinkIcon} size={30} />
                    <a className={styles.Link}>Collapse</a>
                </div>
                <div className={styles.SidebarLink}>
                    <IoIosHome className={styles.SidebarLinkIcon} size={30} />
                    <a className={styles.Link}>All Items</a>
                </div>
                <div className={styles.SidebarLink}>
                    <FaLock size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Passwords</a>
                </div>
                <div className={styles.SidebarLink}>
                    <FaNoteSticky size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Notes</a>
                </div>
                <div className={styles.SidebarLink}>
                    <FaRegAddressBook size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Addresses</a>
                </div>
                <div className={styles.SidebarLink}>
                    <FaRegCreditCard size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Payment Cards</a>
                </div>
                <div className={styles.SidebarLink}>
                    <BsBank size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Bank Accounts</a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;