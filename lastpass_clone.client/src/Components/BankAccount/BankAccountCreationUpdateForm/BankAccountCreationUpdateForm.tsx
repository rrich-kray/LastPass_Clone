import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch, useContext } from "react";
import axios from "axios";
import BankAccount from "../../../Types/BankAccount";
import Category from "../../../Types/Category";
import { FaRegStar } from "react-icons/fa";
import AlertMessage from "../../AlertMessage/AlertMessage";
import {UserContext} from "../../../App";
import RequestHelpers from "../../../Other/RequestHelpers";

const BankAccountCreationUpdateForm = (
    {
        baseUrl,
        updateToggle,
        bankAccountData,
        setIsBankAccountCreationModalVisible,
        setIsBankAccountUpdateModalVisible,
        setAlerts,
        setIsAlertModalVisible
    }: {
            baseUrl: string,
            updateToggle: boolean,
            bankAccountData: BankAccount,
            setIsBankAccountCreationModalVisible: Dispatch<boolean>,
            setIsBankAccountUpdateModalVisible: Dispatch<boolean>,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
    }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const { user, setUser } = useContext(UserContext);
    const [formState, setFormState] = useState({
        Name: "",
        BankName: "",
        AccountType: "",
        RoutingNumber: "",
        AccountNumber: "",
        SwiftCode: "",
        IbanNumber: "",
        Pin: "",
        BranchAddress: "",
        BranchPhone: "",
        Notes: ""
    })

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

    const handleFormSubmit = async (e) => {
        const reset = () => {
            setAlerts([]);
            setIsAlertModalVisible(false);
        }
        e.preventDefault();
        return await
            !updateToggle
            ? axios.post(`${baseUrl}/CreateBankAccount`,
                {
                    userId: user.id,
                    CategoryId: currentCategoryId,
                    Name: formState.Name,
                    BankName: formState.BankName,
                    AccountType: formState.AccountType,
                    RoutingNumber: formState.RoutingNumber,
                    AccountNumber: formState.AccountNumber,
                    SwiftCode: formState.SwiftCode,
                    IbanNumber: formState.IbanNumber,
                    Pin: formState.Pin,
                    BranchAddress: formState.BranchAddress,
                    BranchPhone: formState.BranchPhone,
                    Notes: formState.Notes
                },
                RequestHelpers.GenerateRequestHeaders())
                .then(response => {
                    if (response.data.result === false) {
                        const errors: JSX.Element[] = [];
                        response.data.message.forEach((message: string) => {
                            errors.push(<AlertMessage message={message} color={"red"} />);
                        });
                        setAlerts(errors);
                        setIsAlertModalVisible(true);
                        setTimeout(reset, 3000);
                        return;
                    } else {
                        const message: string = "Bank account creation successful!"
                        const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
                        setAlerts(alerts);
                        setIsAlertModalVisible(true);
                        setTimeout(reset, 3000);
                    }
                })
            : axios.put(
                `${baseUrl}/UpdateBankAccount`,
                {
                    userId: user.id,
                    Id: bankAccountData.id,
                    CategoryId: currentCategoryId,
                    Name: formState.Name,
                    BankName: formState.BankName,
                    AccountType: formState.AccountType,
                    RoutingNumber: formState.RoutingNumber,
                    AccountNumber: formState.AccountNumber,
                    SwiftCode: formState.SwiftCode,
                    IbanNumber: formState.IbanNumber,
                    Pin: formState.Pin,
                    BranchAddress: formState.BranchAddress,
                    BranchPhone: formState.BranchPhone,
                    Notes: formState.Notes
                },
                RequestHelpers.GenerateRequestHeaders())
                .then(response => {
                    if (response.data.result === false) {
                        const errors: JSX.Element[] = [];
                        response.data.message.forEach((message: string) => {
                            errors.push(<AlertMessage message={message} color={"red"} />);
                        });
                        setAlerts(errors);
                        setIsAlertModalVisible(true);
                        setTimeout(reset, 3000);
                        return;
                    } else {
                        const message: string = "Bank account Update successful!"
                        const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
                        setAlerts(alerts);
                        setIsAlertModalVisible(true);
                        setTimeout(reset, 3000);
                    }
                })
    }

    return (
        <div className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <div className={styles.CreateNewPasswordHeader}>
                <span>{updateToggle ? "Update Bank Account" : "Create New Bank Account"}</span>
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
                                <td className={styles.TableColumnOne}>Bank Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="BankName" id="BankName" placeholder={updateToggle ? bankAccountData.bankName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Account Type</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="AccountType" id="AccountType" placeholder={updateToggle ? bankAccountData.accountType : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Routing Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input type="number" name="RoutingNumber" id="RoutingNumber" placeholder={updateToggle ? bankAccountData.routingNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Account Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input type="number" name="AccountNumber" id="AccountNumber" placeholder={updateToggle ? bankAccountData.accountNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>SWIFT Code</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="SwiftCode" id="SwiftCode" placeholder={updateToggle ? bankAccountData.swiftCode : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>IBAN Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="IbanNumber" id="IbanNumber" placeholder={updateToggle ? bankAccountData.ibanNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>PIN</td>
                                <td className={styles.TableColumnTwo}>
                                    <input type="number" name="Pin" id="Pin" placeholder={updateToggle ? bankAccountData.PIN : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Branch Address</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="BranchAddress" id="BranchAddress" placeholder={updateToggle ? bankAccountData.branchAddress : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Branch Phone</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="BranchPhone" id="BranchPhone" placeholder={updateToggle ? bankAccountData.branchPhone : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Notes</td>
                                <td className={styles.TableNotes}>
                                    <input name="Notes" id="Notes" placeholder={updateToggle ? bankAccountData.notes : ""} onChange={handleChange} className={styles.formInput} />
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
                    <button type="submit" className={styles.CancelBtn} onClick={() => updateToggle ? setIsBankAccountUpdateModalVisible(false) : setIsBankAccountCreationModalVisible(false)}>Cancel</button>
                    <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>
                </div>
            </div>
        </div>)
}

export default BankAccountCreationUpdateForm