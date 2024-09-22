import React, { useEffect, useState, FC } from "react";
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
import TypeChecker from "../../Other/TypeChecker.ts";
import RequestHelpers from "../../Other/RequestHelpers";

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
        baseUrl,
        type,
        setAlerts,
        setIsAlertModalVisible
    }: {
        data: PasswordInfo | Note | Address | BankAccount | PaymentCard,
        isDatumVisible: boolean,
        setIsDatumVisible: Dispatch<boolean>,
        setActiveDatum: Dispatch<PasswordInfo | Note | Address | BankAccount | PaymentCard>,
        isDatumUpdateModalVisible: boolean,
        setIsDatumUpdateModalVisible: Dispatch<boolean>,
        baseUrl: string,
        type: string,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertUpdateModalVisible: Dispatch<boolean>
    }) => {
    const tileUtils: TileUtilities = new TileUtilities(baseUrl);
    const typeChecker: TypeChecker = new TypeChecker();
    const [categoryIcon, setCategoryIcon] = useState<React.ReactNode>();

    function handleDeleteRequest() {
        let url: string;
        let itemType: string;
        if (typeChecker.IsPasswordInfo(data)) {
            url = "DeletePassword";
            itemType = "Password"
        } else if (typeChecker.IsNote(data)) {
            url = "DeleteNote";
            itemType = "Note"
        } else if (typeChecker.IsAddress(data)) {
            url = "DeleteAddress";
            itemType = "Address"
        } else if (typeChecker.IsBankAccount(data)) {
            url = "DeleteBankAccount";
            itemType = "Bank Account"
        } else if (typeChecker.IsPaymentCard(data)) {
            url = "DeletePaymentCard";
            itemType = "Payment Card"
        } else {
            url = "DeletePassword";
            itemType = "Password"
        }
        const requestHelpers = new RequestHelpers()
        axios
            .delete(`${baseUrl}/${url}/${data.id}`, RequestHelpers.GenerateRequestHeaders())
            .then(response => {
                if (response.data.success === true) requestHelpers.HandleSuccessAlerts(`${itemType} deletion successful`, setAlerts, setIsAlertModalVisible);
                else requestHelpers.HandleErrorAlerts(response, setAlerts, setIsAlertModalVisible);
            })
            .catch(error => {
                requestHelpers.HandleAxiosCatchErrors(error, setAlerts, setIsAlertModalVisible);
            });
    }

    const trimTitle = (title: string) => title?.length > 10 ? `${title?.slice(0, 10)}...` : title;

    const GetTileText = (): string => {
        if (typeChecker.IsPasswordInfo(data)) {
            return trimTitle(data.website === "" || data.website === undefined ? data.name : data.website);
        } else if (typeChecker.IsNote(data)) {
            return trimTitle(data.name);
        } else if (typeChecker.IsAddress(data)) {
            return trimTitle(data.name);
        } else if (typeChecker.IsBankAccount(data)) {
            return trimTitle(data.name);
        } else if (typeChecker.IsPaymentCard(data)) {
            return trimTitle(data.name)
        } else {
            return trimTitle(data["Website"]);
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
                    <h1 style={{ fontSize: "15px" }}>{GetTileText()}</h1>
                </div>
                <div className={styles.TileContentContainerPanelRight}>
                    <img src={trashcan} className={styles.DeletePassword} onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest();
                    }} />
                    <img src={edit} className={styles.EditPassword} onClick={(e) => {
                        e.stopPropagation();
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