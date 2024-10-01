import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";
import RequestHelpers from "../../Other/RequestHelpers"
import User from "../../Types/User.ts";
import { BiLogOut } from "react-icons/bi";

const UserOptionsButton = ({ baseUrl }: { baseUrl: string }) => {
    const defaultUserValues: User = {
        id: "",
        email: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        roles: []
    }
    const [userInfo, setUserInfo] = useState<User>(defaultUserValues);

    useEffect(() => {
        axios
            .get(`${baseUrl}/GetUserData`, RequestHelpers.GenerateFullRequestHeaders())
            .then(response => {
                setUserInfo(response.data)
            })
            .catch(error => console.log(error));
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.assign("/Login");
    }

    return (
        <div className={styles.UserOptionsButtonDropdown} tabIndex={0}>
            <div className={styles.UserOptionsButton}>
                <div className={styles.UserOptionsButtonLeftPanel}>
                    <FaRegUserCircle size={30} />
                </div>
                <div className={styles.UserOptionsButtonRightPanel}>
                    {userInfo.email && (userInfo.email.length > 20 ? `${userInfo.email.slice(0, 20)}...` : userInfo.email) }
                </div>
            </div>
            <div className={styles.DropdownContent}>
                {/*<div className={styles.DropdownSelection}>
                    <IoMdSettings size={20} style={{ marginRight: "10px" }} />
                    <a >Account Settings</a>
                </div>*/}
                <div className={styles.DropdownSelection}>
                    <BiLogOut size={20} style={{ marginRight: "10px" }} />
                    <a onClick={logout}>Logout</a>
                </div>
            </div>
        </div>
    )
}

export default UserOptionsButton;