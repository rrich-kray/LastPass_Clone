import { Dispatch } from "react";
import styles from "./styles.module.scss";
import { FaLock } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { GiNotebook } from "react-icons/gi";

const NewItemMenu = ({
    isPasswordCreationModalVisible,
    setIsPasswordCreationModalVisible,
    isNoteCreationModalVisible,
    setIsNoteCreationModalVisible,
    isAddressCreationModalVisible,
    setIsAddressCreationModalVisible,
    isBankAccountCreationModalVisible,
    setIsBankAccountCreationModalVisible,
    isPaymentCardCreationModalVisible,
    setIsPaymentCardCreationModalVisible
}: {
        isPasswordCreationModalVisible: boolean,
        setIsPasswordCreationModalVisible: Dispatch<boolean>,
        isNoteCreationModalVisible: boolean,
        setIsNoteCreationModalVisible: Dispatch<boolean>,
        isAddressCreationModalVisible: boolean,
        setIsAddressCreationModalVisible: Dispatch<boolean>,
        isBankAccountCreationModalVisible: boolean,
        setIsBankAccountCreationModalVisible: Dispatch<boolean>,
        isPaymentCardCreationModalVisible: boolean,
        setIsPaymentCardCreationModalVisible: Dispatch<boolean>
}) => {
    return (
        <div className={styles.NewItemMenu}>
            <div className={styles.NewItemMenuBanner}></div>
            <div className={styles.NewItemMenuGrid}>
                <div className={styles.NewItemMenuTile} onClick={() => setIsPasswordCreationModalVisible(!isPasswordCreationModalVisible)}>
                    <FaLock size={30} />
                    <span>Password</span>
                </div>
                <div className={styles.NewItemMenuTile} onClick={() => setIsNoteCreationModalVisible(!isNoteCreationModalVisible)}>
                    <GiNotebook size={30} />
                    <span>Note</span>
                </div>
                <div className={styles.NewItemMenuTile} onClick={() => setIsAddressCreationModalVisible(!isAddressCreationModalVisible)}>
                    <FaRegAddressBook size={30} />
                    <span>Address</span>
                </div>
                <div className={styles.NewItemMenuTile} onClick={() => setIsBankAccountCreationModalVisible(!isBankAccountCreationModalVisible)}>
                    <BsBank size={30} />
                    <span>Bank Account</span>
                </div>
                <div className={styles.NewItemMenuTile} onClick={() => setIsPaymentCardCreationModalVisible(!isPaymentCardCreationModalVisible)}>
                    <FaRegCreditCard size={30} />
                    <span>Payment Card</span>
                </div>
            </div>
        </div>
    )
}

export default NewItemMenu;
