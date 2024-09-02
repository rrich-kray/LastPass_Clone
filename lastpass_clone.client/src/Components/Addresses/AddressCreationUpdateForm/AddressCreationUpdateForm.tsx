import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Category from "../../../Types/Category";
import Address from "../../../Types/Address";


const AddressCreationUpdateForm = ({ baseUrl, updateToggle, addressData }: { baseUrl: string, updateToggle: boolean, addressData: Address }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        addressName: "",
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        userName: "",
        gender: "",
        birthday: "",
        company: "",
        address1: "",
        address2: "",
        address3: "",
        city: "",
        county: "",
        state: "",
        zipCode: "",
        country: "",
        emailAddress: "",
        phoneNumber: "",
        eveningPhone: "",
        mobilePhone: "",
        fax: "",
        notes: ""
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
        const address: address =
        {
            categoryId: currentCategoryId!,
            addressName: formState.addressName,
            title: formState.title,
            firstName: formState.firstName,
            middleName: formState.middleName,
            lastName: formState.lastName,
            userName: formState.userName,
            gender:formState.gender,
            birthday: formState.birthday,
            company: formState.company,
            address1: formState.address1,
            address2: formState.address2,
            address3: formState.address3,
            city: formState.city,
            county: formState.county,
            state: formState.state,
            zipCode: formState.zipCode,
            country: formState.country,
            emailAddress: formState.emailAddress,
            phoneNumber: formState.phoneNumber,
            eveningPhone: formState.eveningPhone,
            mobilePhone: formState.mobilePhone,
            fax: formState.fax,
            notes: formState.notes
        };
        const headers = {
            'Content-Type': 'application/json'
        }
        return await
            !updateToggle
            ? axios.post(`${baseUrl}/CreatePassword`, address, { headers: headers })
            : axios.put(
                `${baseUrl}/UpdatePassword`,
                {
                    Id: addressData.id,
                    categoryId: currentCategoryId!,
                    addressName: formState.addressName,
                    title: formState.title,
                    firstName: formState.firstName,
                    middleName: formState.middleName,
                    lastName: formState.lastName,
                    userName: formState.userName,
                    gender: formState.gender,
                    birthday: formState.birthday,
                    company: formState.company,
                    address1: formState.address1,
                    address2: formState.address2,
                    address3: formState.address3,
                    city: formState.city,
                    county: formState.county,
                    state: formState.state,
                    zipCode: formState.zipCode,
                    country: formState.country,
                    emailAddress: formState.emailAddress,
                    phoneNumber: formState.phoneNumber,
                    eveningPhone: formState.eveningPhone,
                    mobilePhone: formState.mobilePhone,
                    fax: formState.fax,
                    notes: formState.notes
                });
    }

    return (
        <form className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <span style={{ marginBottom: 50, fontWeight: 'bold', fontSize: 25 }}>Create New Password</span>
            <div className={styles.FormInputWrapperContainer}>
                <div className={styles.FormInputWrapper}>
                    <span>Address Name</span>
                    <input name="AddressName" id="AddressName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Title</span>
                    <input name="Title" id="Title" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>First Name</span>
                    <input name="FirstName" id="FirstName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Middle Name</span>
                    <input name="MiddleName" id="MiddleName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Last Name</span>
                    <input name="LastName" id="LastName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>User Name</span>
                    <input name="UserName" id="UserName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Gender</span>
                    <input name="Gender" id="Gender" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Birthday</span>
                    <input name="Birthday" id="Birthday" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Company</span>
                    <input name="Company" id="Company" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Category</span>
                    <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id}>{c.name}</option>)}</select>
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Address 1</span>
                    <input name="Address1" id="Address1" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Address 2</span>
                    <input name="Address2" id="Address2" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Address 3</span>
                    <input name="Address3" id="Address3" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>City</span>
                    <input name="City" id="City" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>County</span>
                    <input name="County" id="County" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>State</span>
                    <input name="State" id="State" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Zip Code</span>
                    <input name="ZipCode" id="ZipCode" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Country</span>
                    <input name="Country" id="Country" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Email</span>
                    <input name="Email" id="Email" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Phone Number</span>
                    <input name="PhoneNumber" id="PhoneNumber" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Evening Phone</span>
                    <input name="EveningPhone" id="EveningPhone" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Mobile Phone</span>
                    <input name="MobilePhone" id="MobilePhone" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Fax</span>
                    <input name="Fax" id="Fax" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Notes</span>
                    <input name="Notes" id="Notes" onChange={handleChange} className={styles.formInput} />
                </div>
            </div>
            <div className={styles.BtnWrapper}>
                <button type="submit" className={styles.SubmitBtn} style={{ marginTop: 25 }}>Submit</button>
            </div>
        </form>)
}

export default AddressCreationUpdateForm