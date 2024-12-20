import { Dispatch } from "react";
import styles from "./styles.module.scss";
import UserOptionsButton from "../UserOptionsButton/UserOptionsButton";
// import logo from "../../Assets/LastPass_Logo.webp"

const Navbar = ({ baseUrl, setSearchTerm }: { baseUrl: string, setSearchTerm: Dispatch<string> }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);
    }

    return (
        <div className={styles.Navbar}>
            <div className={styles.NavbarLogoContainer}>
                {/*<img src={logo} style={{ height: "50px" }} />*/}
            </div>
            <input className={styles.Search} onChange={handleChange}></input>
            <UserOptionsButton baseUrl={baseUrl} />
        </div>
    )
}

export default Navbar;