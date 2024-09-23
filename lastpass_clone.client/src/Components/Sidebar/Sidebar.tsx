import React, { useState, useEffect, Dispatch } from "react";
import styles from "./styles.module.scss";
import { IoIosHome } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Sidebar = ({ currentType, setCurrentType }: { currentType: string, setCurrentType: Dispatch<string> }) => {
    return (
        <div className={styles.Sidebar}>
            <div className={styles.SidebarLinkContainer}>
                <div className={styles.SidebarLink} style={{ marginBottom: "25px" }}>
                    <FaArrowAltCircleLeft className={styles.SidebarLinkIcon} size={30} />
                    <a className={styles.Link}>Collapse</a>
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("All Items")} style={{ backgroundColor: currentType === "All Items" ? "#272f36" : "#3C4A54" }}>
                    <IoIosHome className={styles.SidebarLinkIcon} size={30}  />
                    <a className={styles.Link} >All Items</a>
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Passwords")}  style={{ backgroundColor: currentType === "Passwords" ? "#272f36" : "#3C4A54" }}>
                    <FaLock size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Passwords</a>
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Notes")} style={{ backgroundColor: currentType === "Notes" ? "#272f36" : "#3C4A54" }}>
                    <FaNoteSticky size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Notes</a>
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Addresses")} style={{ backgroundColor: currentType === "Addresses" ? "#272f36" : "#3C4A54" }}>
                    <FaRegAddressBook size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Addresses</a>
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Payment Cards")} style={{ backgroundColor: currentType === "Payment Cards" ? "#272f36" : "#3C4A54" }}>
                    <FaRegCreditCard size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Payment Cards</a>
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Bank Accounts")} style={{ backgroundColor: currentType === "Bank Accounts" ? "#272f36" : "#3C4A54" }}>
                    <BsBank size={30} className={styles.SidebarLinkIcon} />
                    <a className={styles.Link}>Bank Accounts</a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;