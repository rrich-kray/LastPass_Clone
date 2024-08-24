import { useEffect, useState } from "react";
import PasswordInfo from "../../Types/Password.ts"
import Category from "../../Types/Category.ts"
import styles from './styles.module.scss'
import axios from "axios";
import trashcan from "../../assets/trash-can-icon.webp";
import edit from "../../assets/edit-icon.png";
import { Dispatch } from "react";
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";

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
    const [categoryIcon, setCategoryIcon] = useState<React.ReactNode>();
    const handleDeleteRequest = async (e) => {
        await e.preventDefault();
        await axios.post(`${baseUrl}/DeletePassword/${passwordData.id}`);
    }

    const colors: string[] =
        [
            "rgb(52, 97, 84)",
            "rgb(60, 55, 126)",
            "rgb(137, 135, 189)",
            "rgb(98, 126, 174)",
            "rgb(96, 154, 176)"
        ]
    const selectRandomColor = (): string => colors[Math.floor(Math.random() * colors.length)]

    const selectPasswordCategoryIcon = (categoryName: string): React.ReactNode => {
        if (categoryName === "Password") {
            return <FaLock size={30} className={styles.SidebarLinkIcon} />
        } else if (categoryName === "Note") {
            return <FaNoteSticky size={30} className={styles.SidebarLinkIcon} />
        } else if (categoryName === "Address") {
            return <FaRegAddressBook size={30} className={styles.SidebarLinkIcon} />
        } else if (categoryName === "Payment Card") {
            return <FaRegCreditCard size={30} className={styles.SidebarLinkIcon} />
        } else if (categoryName === "Bank Account") {
            return <BsBank size={30} className={styles.SidebarLinkIcon} />
        } else {
            return <FaLock size={30} className={styles.SidebarLinkIcon} />
        }
    }

    useEffect(() => {
        axios
            .get(`${baseUrl}/GetCategories`)
            .then(response => {
                const data = response.data;
                const passwordName: string = data.find((x: Category) => x.id === passwordData.id).Name;
                const categoryIcon = selectPasswordCategoryIcon(passwordName);
                setCategoryIcon(categoryIcon);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);
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
            <div className={styles.TileLogoContainer} style={{background: selectRandomColor()}}>
                { categoryIcon && categoryIcon }
            </div>
            <div className={styles.TileContentContainer}>
                <div className={styles.TileContentContainerPanel}>
                    <h1 style={{ fontSize: "15px", position: "flex-start" }}>{passwordData.website}</h1>
                </div>
                <div className={styles.TileContentContainerPanel}></div>
            </div>
        </div>
    );
}

export default Tile;