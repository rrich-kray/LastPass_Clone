import { useEffect, useState } from "react";
import PasswordInfo from "../../Types/Password.ts"
import Category from "../../Types/Category.ts"
import styles from './styles.module.scss';
import trashcan from "../../assets/trash-can-icon.webp";
import edit from "../../assets/edit-icon.png";
import { Dispatch } from "react";
import TileUtilities from "../../Other/TileUtilities.tsx"
import Note from "../../Types/Note.ts"
import Address from "../../Types/Address.ts"
import BankAccount from "../../Types/BankAccount.ts"
import PaymentCard from "../../Types/PaymentCard.ts"
import axios from "axios"
import TypeChecker from "../../Other/TypeChecker.ts"

// Alternative 1: make tile generic, could be any of existing types
    // Downsides: have to modify existing code when new types are added, instead of adding additional components. Include modifying TileUtils and component

const Tile = (
    {
        data,
        isDatumVisible,
        setIsDatumVisible,
        setActiveDatum,
        isDatumUpdateModalVisible,
        setIsDatumUpdateModalVisible,
        baseUrl
    }: {
        data: PasswordInfo | Note | Address | BankAccount | PaymentCard,
        isDatumVisible: boolean,
        setIsDatumVisible: Dispatch<boolean>,
        setActiveDatum: Dispatch<PasswordInfo | Note | Address | BankAccount | PaymentCard>,
        isDatumUpdateModalVisible: boolean,
        setIsDatumUpdateModalVisible: Dispatch<boolean>,
        baseUrl: string
    }) => {
    const tileUtils: TileUtilities = new TileUtilities(baseUrl);
    const typeChecker: TypeChecker = new TypeChecker();
    const [categoryIcon, setCategoryIcon] = useState<React.ReactNode>();

    async function handleDeleteRequest() {
        let url: string;
        if (typeChecker.IsPasswordInfo(data)) {
            url = "DeletePassword";
        } else if (typeChecker.IsNote(data)) {
            url = "DeleteNote";
        } else if (typeChecker.IsAddress(data)) {
            url = "DeleteAddress";
        } else if (typeChecker.IsBankAccount(data)) {
            url = "DeleteBankAccount";
        } else if (typeChecker.IsPaymentCard(data)) {
            url = "DeletePaymentCard";
        } else {
            url = "DeletePassword";
        }
        await axios
            .post(`${baseUrl}/${url}/${data.Id}`)
            .catch(error => console.log(error));
    }

    const GetTileText = (): string => {
        console.log(typeChecker.IsPasswordInfo(data));
        if (typeChecker.IsPasswordInfo(data)) {
            return data.website;
        } else if (typeChecker.IsNote(data)) {
            return data.noteName;
        } else if (typeChecker.IsAddress(data)) {
            return data.addressName;
        } else if (typeChecker.IsBankAccount(data)) {
            return data.name;
        } else if (typeChecker.IsPaymentCard(data)) {
            return data.name
        } else {
            return data["Website"];
        }
    }

    useEffect(() => {
        const passwordName: Promise<string> = tileUtils.FetchCategoryData(data.categoryId);
        const categoryIcon: React.ReactNode = tileUtils.SelectCategoryIcon(passwordName);
        setCategoryIcon(categoryIcon);
    }, []);

    return (
        <div className={styles.Tile} onClick={() => {
            setActiveDatum(data);
            setIsDatumVisible(!isDatumVisible);
        }}>
            <div className={styles.TileLogoContainer} style={{background: tileUtils.SelectRandomColor()}}>
                { categoryIcon && categoryIcon }
            </div>
            <div className={styles.TileContentContainer}>
                <div className={styles.TileContentContainerPanelLeft}>
                    <h1 style={{ fontSize: "15px", position: "flex-start" }}>{GetTileText()}</h1>
                </div>
                <div className={styles.TileContentContainerPanelRight}>
                    <img src={trashcan} className={styles.DeletePassword} onClick={handleDeleteRequest} />
                    <img src={edit} className={styles.EditPassword} onClick={() => {
                        setActiveDatum(data);
                        setIsDatumUpdateModalVisible(!isDatumUpdateModalVisible)
                    }
                    } />
                </div>
            </div>
        </div>
    );
}

export default Tile;