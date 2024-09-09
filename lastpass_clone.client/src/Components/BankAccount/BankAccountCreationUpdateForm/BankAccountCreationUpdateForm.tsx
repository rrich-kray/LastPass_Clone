import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import BankAccount from "../../../Types/BankAccount";
import Category from "../../../Types/Category";


const BankAccountCreationUpdateForm = ({ baseUrl, updateToggle, bankAccountData }: { baseUrl: string, updateToggle: boolean, bankAccountData: BankAccount }) => {
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
        <form className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <span style={{ marginBottom: 50, fontWeight: 'bold', fontSize: 25 }}>{updateToggle ? "Update bank account" : "Create new bank account"}</span>
            <div className={styles.FormInputWrapperContainer}>
                <div className={styles.FormInputWrapper}>
                    <span>Name</span>
                    <input name="Name" id="Name" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>BankName</span>
                    <input name="BankName" id="BankName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Account Type</span>
                    <input name="AccountType" id="AccountType" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Routing Number</span>
                    <input name="RoutingNumber" id="RoutingNumber" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Account Number</span>
                    <input name="AccountNumber" id="AccountNumber" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>SWIFT Code</span>
                    <input name="SwiftCode" id="SwiftCode" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>IBAN Number</span>
                    <input name="IbanNumber" id="IbanNumber" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>PIN</span>
                    <input name="Pin" id="Pin" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Branch Address</span>
                    <input name="BranchAddress" id="BranchAddress" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Branch Phone</span>
                    <input name="BranchPhone" id="BranchPhone" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Notes</span>
                    <input name="Notes" id="Notes" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Category</span>
                    <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id}>{c.name}</option>)}</select>
                </div>
            </div>
            <div className={styles.BtnWrapper}>
                <button type="submit" className={styles.SubmitBtn} style={{ marginTop: 25 }}>Submit</button>
            </div>
        </form>)
}

export default BankAccountCreationUpdateForm