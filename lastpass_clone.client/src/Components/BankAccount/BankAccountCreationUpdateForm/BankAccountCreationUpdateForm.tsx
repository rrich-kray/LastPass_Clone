import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch } from "react";
import axios from "axios";
import BankAccount from "../../../Types/BankAccount";
import Category from "../../../Types/Category";
import { FaRegStar } from "react-icons/fa";

const BankAccountCreationUpdateForm = (
    {
        baseUrl,
        updateToggle,
        bankAccountData,
        setIsBankAccountCreationModalVisible,
        setIsBankAccountUpdateModalVisible
    }: {
            baseUrl: string,
            updateToggle: boolean,
            bankAccountData: BankAccount,
            setIsBankAccountCreationModalVisible: Dispatch<boolean>,
            setIsBankAccountUpdateModalVisible: Dispatch<boolean>
    }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        Name: "",
        BankName: "",
        AccountType: "",
        RoutingNumber: 0,
        AccountNumber: 0,
        SwiftCode: 0,
        IbanNumber: "",
        Pin: 0,
        BranchAddress: "",
        BranchPhone: 0,
        Notes: ""
    })

    useEffect(() => {
        axios
            .get(`${baseUrl}/GetCategories`)
            .then(response => {
                const data = response.data;
                setCategories(data);
                setCurrentCategoryId(data.id);
            })
            .catch(error => {
                console.log(error);
            })
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
        e.preventDefault();
        return await
            !updateToggle
            ? axios.post(`${baseUrl}/CreateBankAccount`,
                {
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
                })
            : axios.put(
                `${baseUrl}/UpdateBankAccount`,
                {
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
                });
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
                                    <input name="RoutingNumber" id="RoutingNumber" placeholder={updateToggle ? bankAccountData.routingNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Account Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="AccountNumber" id="AccountNumber" placeholder={updateToggle ? bankAccountData.accountNumber : ""} onChange={handleChange} className={styles.formInput} />
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
                                    <input name="Pin" id="Pin" placeholder={updateToggle ? bankAccountData.PIN : ""} onChange={handleChange} className={styles.formInput} />
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