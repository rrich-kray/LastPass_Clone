import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch, useContext } from "react";
import Category from "../../../Types/Category";
import Address from "../../../Types/Address";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegStar } from "react-icons/fa";
import RequestHelpers from "../../../Other/RequestHelpers";
import { UserContext } from "../../../App"
import Entity from "../../../Types/Entity.ts";

const AddressCreationUpdateForm = (
    {
        baseUrl,
        updateToggle,
        addressData,
        setIsAddressCreationModalVisible,
        setIsAddressUpdateModalVisible,
        setAlerts,
        setIsAlertModalVisible
    }:
        {
            baseUrl: string,
            updateToggle: boolean,
            addressData: Entity | undefined,
            setIsAddressCreationModalVisible: Dispatch<boolean>,
            setIsAddressUpdateModalVisible: Dispatch<boolean>,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
        }) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<string>();
    const [user, setUser] = useContext(UserContext);
    console.log(setUser);
    console.log(user);
    const [formState, setFormState] = useState({
        Name: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        UserName: "",
        Gender: "",
        Birthday: "",
        Company: "",
        Address1: "",
        Address2: "",
        Address3: "",
        City: "",
        County: "",
        State: "",
        ZipCode: "",
        Country: "",
        EmailAddress: "",
        PhoneNumber: "",
        EveningPhone: "",
        MobilePhone: "",
        Fax: "",
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
                `${baseUrl}/CreateAddress`,
                {
                    userId: user.id,
                    categoryId: currentCategoryId!,
                    name: formState.Name,
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
                },
                false,
                "Address Creation successful!",
                setAlerts,
                setIsAlertModalVisible,
                setIsSubmitButtonDisabled
            )
            : requestHelpers.MakeRequest(
                `${baseUrl}/UpdateAddress`,
                {
                    userId: user.id,
                    Id: addressData!.id, // Will never be undefined when updating
                    categoryId: currentCategoryId!,
                    name: formState.Name,
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
                },
                true,
                "Address update successful!",
                setAlerts,
                setIsAlertModalVisible,
                setIsSubmitButtonDisabled
            );
    }

    return (
        <div className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <div className={styles.CreateNewPasswordHeader}>
                <span>{updateToggle ? "Update Address" : "Create New Address"}</span>
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
                                <td className={styles.TableColumnOne}>Title</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Title" id="Title" placeholder={updateToggle ? (addressData as Address)?.title : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>First Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="FirstName" id="FirstName" placeholder={updateToggle ? (addressData as Address)?.firstName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Middle Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="MiddleName" id="MiddleName" placeholder={updateToggle ? (addressData as Address)?.middleName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Last Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="LastName" id="LastName" placeholder={updateToggle ? (addressData as Address)?.lastName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>UserName</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="UserName" id="UserName" placeholder={updateToggle ? (addressData as Address)?.userName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Gender</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Gender" id="Gender" placeholder={updateToggle ? (addressData as Address)?.gender : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Birthday</td>
                                <td className={styles.TableColumnTwo}>
                                    <DatePicker className={styles.DatePicker} selected={new Date()} onChange={(date) => {
                                        setFormState({
                                            ...formState,
                                            Birthday: date!.toISOString()
                                        });
                                    }} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Company</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Company" id="Company" placeholder={updateToggle ? (addressData as Address)?.company : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Address 1</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Address1" id="Address1" placeholder={updateToggle ? (addressData as Address)?.address1 : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Address 2</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Address2" id="Address2" placeholder={updateToggle ? (addressData as Address)?.address2 : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Address 3</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Address3" id="Address3" placeholder={updateToggle ? (addressData as Address)?.address3 : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>City</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="City" id="City" placeholder={updateToggle ? (addressData as Address)?.city : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>County</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="County" id="County" placeholder={updateToggle ? (addressData as Address)?.county : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>State</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="State" id="State" placeholder={updateToggle ? (addressData as Address)?.state : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Zip Code</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="ZipCode" id="ZipCode" placeholder={updateToggle ? (addressData as Address)?.zipCode : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Country</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Country" id="Country" placeholder={updateToggle ? (addressData as Address)?.country : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Email Address</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Email Address" id="Email Address" placeholder={updateToggle ? (addressData as Address)?.emailAddress : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Phone Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="PhoneNumber" id="PhoneNumber" placeholder={updateToggle ? (addressData as Address)?.phoneNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Evening Phone</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="EveningPhone" id="EveningPhone" placeholder={updateToggle ? (addressData as Address)?.eveningPhone : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Mobile Phone</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="MobilePhone" id="MobilePhone" placeholder={updateToggle ? (addressData as Address)?.mobilePhone : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Fax</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Fax" id="Fax" placeholder={updateToggle ? (addressData as Address)?.fax : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Notes</td>
                                <td className={styles.TableNotes}>
                                    <input name="Notes" id="Notes" placeholder={updateToggle ? (addressData as Address)?.notes : ""} onChange={handleChange} className={styles.formInput} />
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
                    <button type="submit" className={styles.CancelBtn} onClick={() => updateToggle ? setIsAddressUpdateModalVisible(false) : setIsAddressCreationModalVisible(false)}>Cancel</button>
                    {isSubmitButtonDisabled === false && <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>}
                </div>
            </div>
        </div>)
}

export default AddressCreationUpdateForm