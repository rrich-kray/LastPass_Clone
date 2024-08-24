import PasswordInfo from "../../Types/Password.ts"
import styles from './styles.module.scss'
import axios from "axios";
import trashcan from "../../assets/trash-can-icon.webp";
import edit from "../../assets/edit-icon.png";
import { Dispatch } from "react";

const Tile = ({
    passwordData,
    isPasswordVisible,
    setIsPasswordVisible,
    setActivePassword,
    isPasswordUpdateModalVisible,
    setIsPasswordUpdateModalVisible,
    baseUrl }: {
        passwordData: PasswordInfo,
        isPasswordVisible: boolean,
        setIsPasswordVisible: Dispatch<boolean>,
        setActivePassword: Dispatch<PasswordInfo>,
        isPasswordUpdateModalVisible: boolean,
        setIsPasswordUpdateModalVisible: Dispatch<boolean>,
        baseUrl: string
    }) => {

    const handleDeleteRequest = async (e) => {
        await e.preventDefault();
        await axios.post(`${baseUrl}/DeletePassword/${passwordData.id}`);
    }
    console.log(isPasswordVisible);
    return (
        <div className={styles.Tile} onClick={() => {
            setActivePassword(passwordData);
            setIsPasswordVisible(!isPasswordVisible);
        }}>
            <img src={trashcan} className={styles.DeletePassword} onClick={handleDeleteRequest} />
            <img src={edit} className={styles.EditPassword} onClick={() => {
                setActivePassword(passwordData);
                setIsPasswordUpdateModalVisible(!isPasswordUpdateModalVisible)
            }
            } />
            <div className={styles.TileContentContainer}>
                <h1 className={styles.TileContentContainerHeader}>{passwordData.website}</h1>
                <span className={styles.TileContentContainerUsername}>{passwordData.username}</span>
                <p className={styles.TileContentContainerBody}>{passwordData.notes}</p>
            </div>
        </div>
    );
}

export default Tile;