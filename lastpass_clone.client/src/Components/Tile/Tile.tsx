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
        setIsAlertModalVisible,
        typeIcon
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
        setIsAlertUpdateModalVisible: Dispatch<boolean>,
        typeIcon: JSX.Element[]
    }) => {
    const tileUtils: TileUtilities = new TileUtilities(baseUrl);
    const typeChecker: TypeChecker = new TypeChecker();
    const [categoryIcon, setCategoryIcon] = useState<React.ReactNode>();
    const [tileColor, setTileColor] = useState<string>();
    const [title, setTitle] = useState<string>();
    const [hovered, setHovered] = useState<boolean>(false);

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

    const trimTitleNoHover = (title: string) => title?.length > 30 ? `${title?.slice(0, 30)}...` : title;
    const trimTitleHover = (title: string) => title?.length > 10 ? `${title?.slice(0, 10)}...` : title;

    const GetTileText = (): string => {
        if (typeChecker.IsPasswordInfo(data)) {
            if (!hovered) return trimTitleNoHover(data.website === "" || data.website === undefined ? data.name : data.website);
            else return trimTitleHover(data.website === "" || data.website === undefined ? data.name : data.website);
        } else {
            if (!hovered) return trimTitleNoHover(data.name);
            return trimTitleHover(data.name);
        }
    }

    useEffect(() => {
        const type = typeChecker.GetType(data);
        const categoryIcon: JSX.Element = tileUtils.SelectCategoryIcon(type);
        setCategoryIcon(categoryIcon);
        setTileColor(tileUtils.SelectRandomColor());
    }, []);

    return (
        <div className={styles.Tile} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className={styles.TileLogoContainer} style={{ background: tileColor }}>
                {typeIcon && typeIcon}
                <div className={styles.TileViewButtonOverlay}></div>
                <div className={styles.TileViewButton} onClick={() => {
                    setActiveDatum(data);
                    setIsDatumVisible(!isDatumVisible);
                }}>
                    <span>View</span>
                </div>
            </div>
            <div className={styles.TileContentContainer}>
                <div className={styles.TileContentContainerPanelLeft} style={{ width: hovered ? "50%" : "100%"}}>
                    <h1 style={{ fontSize: "15px" }}>{GetTileText()}</h1>
                </div>
                {hovered && <div className={styles.TileContentContainerPanelRight}>
                    <div className={styles.TileEditDeleteItemContainer}>
                        <img src={trashcan} className={styles.DeletePassword} onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest();
                        }} />
                        <img src={edit} className={styles.EditPassword} onClick={(e) => {
                            e.stopPropagation();
                            setActiveDatum(data);
                            setIsDatumUpdateModalVisible(!isDatumUpdateModalVisible);
                        }
                        } />
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default Tile;