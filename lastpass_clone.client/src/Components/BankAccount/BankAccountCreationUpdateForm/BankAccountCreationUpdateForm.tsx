import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch, useContext } from "react";
import BankAccount from "../../../Types/BankAccount";
import Category from "../../../Types/Category";
import { FaRegStar } from "react-icons/fa";
import {UserContext} from "../../../App";
import RequestHelpers from "../../../Other/RequestHelpers";
import Entity from "../../../Types/Entity.ts";

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
            bankAccountData: Entity | undefined,
            setIsBankAccountCreationModalVisible: Dispatch<boolean>,
            setIsBankAccountUpdateModalVisible: Dispatch<boolean>,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
        }) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<string>();
    const [ user ] = useContext(UserContext);
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
        RequestHelpers.GetCategories(baseUrl, setCategories, setCurrentCategoryId, user.id);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentCategoryId(e.target.value);

    const requestHelpers = new RequestHelpers();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        return await
            !updateToggle
            ? requestHelpers.MakeRequest(
                `${baseUrl}/CreateBankAccount`,
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
                false,
                "Bank account Creation successful!",
                setAlerts,
                setIsAlertModalVisible,
                setIsSubmitButtonDisabled
            )
            : requestHelpers.MakeRequest(
                `${baseUrl}/UpdateBankAccount`,
                {
                    userId: user.id,
                    Id: bankAccountData!.id,
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
                true,
                "Bank account update successful!",
                setAlerts,
                setIsAlertModalVisible,
                setIsSubmitButtonDisabled
            );
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
                        <span>Category</span>
                        <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                    </div>
                </div>
                <div className={styles.CreateNewPasswordBodyRightPanel}>
                    <table className={styles.CreateNewPasswordBodyRightPanelTable}>
                        <tbody>
                            <tr>
                                <td className={styles.TableColumnOne}>Bank Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="BankName" id="BankName" placeholder={updateToggle ? (bankAccountData as BankAccount)?.bankName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Account Type</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="AccountType" id="AccountType" placeholder={updateToggle ? (bankAccountData as BankAccount)?.accountType : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Routing Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input type="number" name="RoutingNumber" id="RoutingNumber" placeholder={updateToggle ? (bankAccountData as BankAccount)?.routingNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Account Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input type="number" name="AccountNumber" id="AccountNumber" placeholder={updateToggle ? (bankAccountData as BankAccount)?.accountNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>SWIFT Code</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="SwiftCode" id="SwiftCode" placeholder={updateToggle ? (bankAccountData as BankAccount)?.swiftCode : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>IBAN Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="IbanNumber" id="IbanNumber" placeholder={updateToggle ? (bankAccountData as BankAccount)?.ibanNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>PIN</td>
                                <td className={styles.TableColumnTwo}>
                                    <input type="number" name="Pin" id="Pin" placeholder={updateToggle ? (bankAccountData as BankAccount)?.PIN : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Branch Address</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="BranchAddress" id="BranchAddress" placeholder={updateToggle ? (bankAccountData as BankAccount)?.branchAddress : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Branch Phone</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="BranchPhone" id="BranchPhone" placeholder={updateToggle ? (bankAccountData as BankAccount)?.branchPhone : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Notes</td>
                                <td className={styles.TableNotes}>
                                    <input name="Notes" id="Notes" placeholder={updateToggle ? (bankAccountData as BankAccount)?.notes : ""} onChange={handleChange} className={styles.formInput} />
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
                    {isSubmitButtonDisabled === false && <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>}
                </div>
            </div>
        </div>)
}

export default BankAccountCreationUpdateForm