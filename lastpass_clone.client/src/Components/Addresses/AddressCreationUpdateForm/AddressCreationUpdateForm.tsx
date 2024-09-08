import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Category from "../../../Types/Category";
import Address from "../../../Types/Address";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AddressCreationUpdateForm = ({ baseUrl, updateToggle, addressData }: { baseUrl: string, updateToggle: boolean, addressData: Address }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        AddressName: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        UserName: "",
        Gender: "",
        Birthday: new Date('December 17, 1995 03:24:00'),
        Company: "",
        Address1: "",
        Address2: "",
        Address3: "",
        City: "",
        County: "",
        State: "",
        ZipCode: 0,
        Country: "",
        EmailAddress: "",
        PhoneNumber: 0,
        EveningPhone: 0,
        MobilePhone: 0,
        Fax: 0,
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
        const headers = {
            'Content-Type': 'application/json'
        }
        return await
            !updateToggle
            ? axios.post(
                `${baseUrl}/CreateAddress`, 
                {
                    categoryId: currentCategoryId!,
                    addressName: formState.AddressName,
                    title: formState.Title,
                    firstName: formState.FirstName,
                    middleName: formState.MiddleName,
                    lastName: formState.LastName,
                    userName: formState.UserName,
                    gender: formState.Gender,
                    birthday: formState.Birthday,
                    company: formState.Company,
                    address1: formState.Address1,
                    address2: formState.Address2,
                    address3: formState.Address3,
                    city: formState.City,
                    county: formState.County,
                    state: formState.State,
                    zipCode: formState.ZipCode,
                    country: formState.Country,
                    emailAddress: formState.EmailAddress,
                    phoneNumber: formState.PhoneNumber,
                    eveningPhone: formState.EveningPhone,
                    mobilePhone: formState.MobilePhone,
                    fax: formState.Fax,
                    notes: formState.Notes
                })
            : axios.put(
                `${baseUrl}/UpdateAddress`,
                {
                    Id: addressData.id,
                    categoryId: currentCategoryId!,
                    addressName: formState.AddressName,
                    title: formState.Title,
                    firstName: formState.FirstName,
                    middleName: formState.MiddleName,
                    lastName: formState.LastName,
                    userName: formState.UserName,
                    gender: formState.Gender,
                    birthday: formState.Birthday,
                    company: formState.Company,
                    address1: formState.Address1,
                    address2: formState.Address2,
                    address3: formState.Address3,
                    city: formState.City,
                    county: formState.County,
                    state: formState.State,
                    zipCode: formState.ZipCode,
                    country: formState.Country,
                    emailAddress: formState.EmailAddress,
                    phoneNumber: formState.PhoneNumber,
                    eveningPhone: formState.EveningPhone,
                    mobilePhone: formState.MobilePhone,
                    fax: formState.Fax,
                    notes: formState.Notes
                });
    }

    const formatInputFieldTitle = (input: string): string => input.split(/[A-Z]/).map(word => word[0] + word.slice(1)).join(" ");
    const formatInputFieldNameAndId = (input: string): string => input.split(/[A-Z]/).map(word => word[0] + word.slice(1)).join("");

    function generateInputFields(address: Address): React.ReactNode[] {
        const inputFields: React.ReactNode[] = [];
        if (address !== null) {
            Object.keys(address).map(key => {
                inputFields.push(
                    <div className={styles.FormInputWrapper}>
                        <span>{formatInputFieldTitle(key)}</span>
                        <input name={formatInputFieldNameAndId(key)} id={formatInputFieldNameAndId(key)} onChange={handleChange} className={styles.formInput} />
                    </div>);
            })
        }
        return inputFields;
    }

    return (
        <form className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <span style={{ marginBottom: 50, fontWeight: 'bold', fontSize: 25 }}>Create New Address</span>
            <div className={styles.FormInputWrapperContainer}>
                <div className={styles.FormInputWrapper}>
                    <span>Address Name</span>
                    <input type="text" name="AddressName" id="AddressName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Title</span>
                    <input type="text" name="Title" id="Title" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>First Name</span>
                    <input type="text" name="FirstName" id="FirstName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Middle Name</span>
                    <input type="text" name="MiddleName" id="MiddleName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Last Name</span>
                    <input type="text" name="LastName" id="LastName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>User Name</span>
                    <input type="text" name="UserName" id="UserName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Gender</span>
                    <input type="text" name="Gender" id="Gender" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Birthday</span>
                    <DatePicker selected={formState.Birthday} onChange={(date) => {
                        setFormState({
                            ...formState,
                            Birthday: date?.toISOString()
                        });
                    }} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Company</span>
                    <input type="text" name="Company" id="Company" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Category</span>
                    <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id}>{c.name}</option>)}</select>
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Address 1</span>
                    <input type="text" name="Address1" id="Address1" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Address 2</span>
                    <input type="text" name="Address2" id="Address2" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Address 3</span>
                    <input type="text" name="Address3" id="Address3" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>City</span>
                    <input type="text" name="City" id="City" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>County</span>
                    <input type="text" name="County" id="County" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>State</span>
                    <input type="text" name="State" id="State" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Zip Code</span>
                    <input type="number" name="ZipCode" id="ZipCode" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Country</span>
                    <input type="text" name="Country" id="Country" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Email</span>
                    <input type="email" name="EmailAddress" id="EmailAddress" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Phone Number</span>
                    <input type="number" name="PhoneNumber" id="PhoneNumber" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Evening Phone</span>
                    <input type="text" name="EveningPhone" id="EveningPhone" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Mobile Phone</span>
                    <input type="number" name="MobilePhone" id="MobilePhone" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Fax</span>
                    <input type="number" name="Fax" id="Fax" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Notes</span>
                    <input type="text" name="Notes" id="Notes" onChange={handleChange} className={styles.formInput} />
                </div>
            </div>
            <div className={styles.BtnWrapper}>
                <button type="submit" className={styles.SubmitBtn} style={{ marginTop: 25 }}>Submit</button>
            </div>
        </form>)
}

export default AddressCreationUpdateForm