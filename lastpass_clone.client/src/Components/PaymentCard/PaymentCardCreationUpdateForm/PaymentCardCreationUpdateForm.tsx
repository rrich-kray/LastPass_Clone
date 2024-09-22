import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch, useContext } from "react";
import axios from "axios";
import Category from "../../../Types/Category";
import PaymentCard from "../../../Types/PaymentCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegStar } from "react-icons/fa";
import AlertMessage from "../../AlertMessage/AlertMessage";
import {UserContext} from "../../../App";
import RequestHelpers from "../../../Other/RequestHelpers";

const PaymentCardCreationUpdateForm = (
    {
        baseUrl,
        updateToggle,
        paymentCardData,
        setIsPaymentCardCreationModalVisible,
        setIsPaymentCardUpdateModalVisible,
        setAlerts,
        setIsAlertModalVisible
    }: {
            baseUrl: string,
            updateToggle: boolean,
            paymentCardData: PaymentCard,
            setIsPaymentCardCreationModalVisible: Dispatch<boolean>,
            setIsPaymentCardUpdateModalVisible: Dispatch<boolean>,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
    }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const { user, setUser } = useContext(UserContext);
    const [formState, setFormState] = useState({
        Name: "",
        NameOnCard: "",
        Type: "",
        Number: 0,
        SecurityCode: 0,
        StartDate: new Date(),
        ExpirationDate: new Date(),
        Notes: ""
    });

    useEffect(() => {
        RequestHelpers.GetCategories(baseUrl, setCategories, setCurrentCategoryId);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const handleDropdownChange = (e) => setCurrentCategoryId(e.target.options.selectedIndex);

    const requestHelpers = new RequestHelpers();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        return await
            !updateToggle
            ? requestHelpers.MakeRequest(
                `${baseUrl}/CreatePaymentCard`,
                {
                    userId: user.id,
                    CategoryId: currentCategoryId,
                    Name: formState.Name,
                    NameOnCard: formState.NameOnCard,
                    Type: formState.Type,
                    Number: formState.Number,
                    SecurityCode: formState.SecurityCode,
                    StartDate: formState.StartDate,
                    ExpirationDate: formState.ExpirationDate,
                    Notes: formState.Notes
                },
                false,
                "Payment card Creation successful!",
                setAlerts,
                setIsAlertModalVisible
            )
            : requestHelpers.MakeRequest(
                `${baseUrl}/UpdatePaymentCard`,
                {
                    userId: user.id,
                    Id: paymentCardData.id,
                    CategoryId: currentCategoryId,
                    Name: formState.Name,
                    NameOnCard: formState.NameOnCard,
                    Type: formState.Type,
                    Number: formState.Number,
                    SecurityCode: formState.SecurityCode,
                    StartDate: formState.StartDate,
                    ExpirationDate: formState.ExpirationDate,
                    Notes: formState.Notes
                },
                true,
                "Payment card update successful!",
                setAlerts,
                setIsAlertModalVisible
            );
    }

    return (
        <div className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <div className={styles.CreateNewPasswordHeader}>
                <span>{updateToggle ? "Update Payment Card" : "Create New Payment Card"}</span>
            </div>
            <div className={styles.CreateNewPasswordBody}>
                <div className={styles.CreateNewPasswordBodyLeftPanel}>
                    <div className={styles.CreateNewPasswordName}>
                        <span>Name</span>
                        <input name="Name" id="Name" onChange={handleChange} />
                    </div>
                    <div className={styles.CreateNewPasswordFolder}>
                        <span>Folder</span>
                        <select onChange={handleDropdownChange}></select>
                    </div>
                </div>
                <div className={styles.CreateNewPasswordBodyRightPanel}>
                    <table className={styles.CreateNewPasswordBodyRightPanelTable}>
                        <tbody>
                            <tr>
                                <td className={styles.TableColumnOne}>Category</td>
                                <td className={styles.TableColumnTwo}>
                                    <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id}>{c.name}</option>)}</select>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Name on Card</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="NameOnCard" id="NameOnCard" placeholder={updateToggle ? paymentCardData.nameOnCard : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Type</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Type" id="Type" placeholder={updateToggle ? paymentCardData.type : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Number" id="Number" placeholder={updateToggle ? paymentCardData.number : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Security Code</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="SecurityCode" id="SecurityCode" placeholder={updateToggle ? paymentCardData.securityCode : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Start Date</td>
                                <td className={styles.TableColumnTwo}>
                                    <DatePicker className={styles.DatePicker} selected={formState.StartDate} onChange={(date) => {
                                        setFormState({
                                            ...formState,
                                            StartDate: date?.toISOString()
                                        });
                                    }} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Expiration Date</td>
                                <td className={styles.TableColumnTwo}>
                                    <DatePicker className={styles.DatePicker} selected={formState.ExpirationDate} onChange={(date) => {
                                        setFormState({
                                            ...formState,
                                            ExpirationDate: date?.toISOString()
                                        });
                                    }} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Notes</td>
                                <td className={styles.TableNotes}>
                                    <input name="Notes" id="Notes" placeholder={updateToggle ? paymentCardData.notes : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.CreateNewPasswordFooter}>
                <div className={styles.CreateNewPasswordFooterLeftContainer}>
                    <button className={styles.FaveBtn}>
                        <FaRegStar />
                    </button>
                </div>
                <div className={styles.CreateNewPasswordFooterRightContainer}>
                    <button type="submit" className={styles.CancelBtn} onClick={() => updateToggle ? setIsPaymentCardUpdateModalVisible(false) : setIsPaymentCardCreationModalVisible(false)}>Cancel</button>
                    <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>
                </div>
            </div>
        </div>)
}

export default PaymentCardCreationUpdateForm