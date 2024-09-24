import React, { useState, useEffect, Dispatch } from "react";
import styles from "./styles.module.scss";
import { IoIosHome } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Sidebar = (
    {
        isCollapsed,
        setIsCollapsed,
        currentType,
        setCurrentType
    }: {
            isCollapsed: boolean,
            setIsCollapsed: Dispatch<boolean>,
            currentType: string,
            setCurrentType: Dispatch<string>
        }) => {

    const sideBarLinkStyles = {
        paddingLeft: isCollapsed ? "20px" : "25px",
        width: isCollapsed ? "calc(100% - 20px)" : "calc(100% - 25px)"
    }
    return (
        <div className={styles.Sidebar}>
            <div className={styles.SidebarLinkContainer}>
                <div className={styles.SidebarLink} style={{ marginBottom: "15px", ...sideBarLinkStyles }} onClick={() => setIsCollapsed(!isCollapsed)}>
                    <FaArrowAltCircleLeft className={styles.SidebarLinkIcon} size={30} />
                    {!isCollapsed && <a className={styles.Link}>Collapse</a>}
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("All Items")} style={{ backgroundColor: currentType === "All Items" ? "#272f36" : "#3C4A54", ...sideBarLinkStyles}}>
                    <IoIosHome className={styles.SidebarLinkIcon} size={30}  />
                    {!isCollapsed && <a className={styles.Link}>All Items</a>}
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Passwords")} style={{ backgroundColor: currentType === "Passwords" ? "#272f36" : "#3C4A54", ...sideBarLinkStyles }}>
                    <FaLock size={30} className={styles.SidebarLinkIcon} />
                    {!isCollapsed && <a className={styles.Link}>Passwords</a>}
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Notes")} style={{ backgroundColor: currentType === "Notes" ? "#272f36" : "#3C4A54", ...sideBarLinkStyles }}>
                    <FaNoteSticky size={30} className={styles.SidebarLinkIcon} />
                    {!isCollapsed && <a className={styles.Link}>Notes</a>}
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Addresses")} style={{ backgroundColor: currentType === "Addresses" ? "#272f36" : "#3C4A54", ...sideBarLinkStyles }}>
                    <FaRegAddressBook size={30} className={styles.SidebarLinkIcon} />
                    {!isCollapsed && <a className={styles.Link}>Addresses</a>}
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Payment Cards")} style={{ backgroundColor: currentType === "Payment Cards" ? "#272f36" : "#3C4A54", ...sideBarLinkStyles }}>
                    <FaRegCreditCard size={30} className={styles.SidebarLinkIcon} />
                    {!isCollapsed && <a className={styles.Link}>Payment Cards</a>}
                </div>
                <div className={styles.SidebarLink} onClick={() => setCurrentType("Bank Accounts")} style={{ backgroundColor: currentType === "Bank Accounts" ? "#272f36" : "#3C4A54", ...sideBarLinkStyles }}>
                    <BsBank size={30} className={styles.SidebarLinkIcon} />
                    {!isCollapsed && <a className={styles.Link}>Bank Accounts</a>}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;