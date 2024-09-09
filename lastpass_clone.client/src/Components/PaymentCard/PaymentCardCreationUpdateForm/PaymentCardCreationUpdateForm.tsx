import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Category from "../../../Types/Category";
import PaymentCard from "../../../Types/PaymentCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const PaymentCardCreationUpdateForm = ({ baseUrl, updateToggle, paymentCardData }: { baseUrl: string, updateToggle: boolean, paymentCardData: PaymentCard }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        Name: "",
        NameOnCard: "",
        Type: "",
        Number: 0,
        SecurityCode: 0,
        StartDate: new Date(),
        ExpirationDate: new Date(),
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
            ? axios.post(`${baseUrl}/CreatePaymentCard`,
                {
                    CategoryId: currentCategoryId,
                    Name: formState.Name,
                    NameOnCard: formState.NameOnCard,
                    Type: formState.Type,
                    Number: formState.Number,
                    SecurityCode: formState.SecurityCode,
                    StartDate: formState.StartDate,
                    ExpirationDate: formState.ExpirationDate,
                    Notes: formState.Notes
                })
            : axios.put(
                `${baseUrl}/UpdatePaymentCard`,
                {
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
                });
    }

    return (
        <form className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <span style={{ marginBottom: 50, fontWeight: 'bold', fontSize: 25 }}>{updateToggle ? "Update Payment Card" : "Create New Payment Card"}</span>
            <div className={styles.FormInputWrapperContainer}>
                <div className={styles.FormInputWrapper}>
                    <span>Name</span>
                    <input name="Name" id="Name" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Name on Card</span>
                    <input name="NameOnCard" id="NameOnCard" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Type</span>
                    <input name="Type" id="Type" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Number</span>
                    <input name="Number" id="Number" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Security Code</span>
                    <input name="SecurityCode" id="SecurityCode" onChange={handleChange} className={styles.formInput} />
                </div>
                <DatePicker selected={formState.StartDate} onChange={(date) => {
                    setFormState({
                        ...formState,
                        StartDate: date?.toISOString()
                    });
                }} />
                <DatePicker selected={formState.ExpirationDate} onChange={(date) => {
                    setFormState({
                        ...formState,
                        ExpirationDate: date?.toISOString()
                    });
                }} />
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

export default PaymentCardCreationUpdateForm