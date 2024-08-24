import { FC, useState, useEffect } from "react";
import Tile from "../Components/Tile/Tile";
import styles from "./styles.module.scss";
import PasswordInfo from "../Types/PasswordInfo";
import axios from "axios";
import PasswordCreationUpdateForm from "../Components/PasswordCreationForm/PasswordCreationUpdateForm";
import PasswordDataForm from "../Components/PasswordDataForm/PasswordDataForm";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar"

// fetch categories: for each category, create a CategorySection element. This will consist of all passwords, notes etc. that belong to that category
const Main: FC = () =>
{
    const baseUrl: string = "https://localhost:7110";
    const [passwords, setPasswords] = useState<PasswordInfo[]>([]);
    const [isPasswordCreationModalVisible, setIsPasswordCreationModalVisible] = useState<boolean>(false);
    const [isPasswordUpdateModalVisible, setIsPasswordUpdateModalVisible] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVIsible] = useState<boolean>(false);
    const [activePassword, setActivePassword] = useState();

    const fetchData = async () => await axios.get(`${baseUrl}/GetAllPasswords`).catch(error => console.log(error))
    useEffect(() => {
        const getData = async () => {
            const res = await fetchData();
            setPasswords(res.data);
        }
        getData();
    }, [])

    return (
        <div className={styles.Main} onClick={() => {
            isPasswordCreationModalVisible && setIsPasswordCreationModalVisible(false);
            isPasswordUpdateModalVisible && setIsPasswordUpdateModalVisible(false);
            isPasswordVisible && setIsPasswordVIsible(false);
            }
        }>
            <button className={styles.CreateNewPasswordButton} onClick={() => setIsPasswordCreationModalVisible(!isPasswordCreationModalVisible)}>Create New Password</button>
            {isPasswordVisible && <PasswordDataForm passwordInfo={activePassword} />}
            {isPasswordCreationModalVisible && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={passwords[0]} updateToggle={false} />}
            {isPasswordUpdateModalVisible && activePassword && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={activePassword} updateToggle={true} />}
            <div className={styles.SidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.GridNavbarWrapper}>
                <Navbar />
                <div className={styles.Grid}>
                    {passwords && passwords.map((password: PasswordInfo) => (
                        <Tile
                            passwordData={password}
                            isPasswordVisible={isPasswordVisible}
                            setIsPasswordVisible={setIsPasswordVIsible}
                            setActivePassword={setActivePassword}
                            isPasswordUpdateModalVisible={isPasswordUpdateModalVisible}
                            setIsPasswordUpdateModalVisible={setIsPasswordUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                </div>
            </div>
        </div>)
}

export default Main;