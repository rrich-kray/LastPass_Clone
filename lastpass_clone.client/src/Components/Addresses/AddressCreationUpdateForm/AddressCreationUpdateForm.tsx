import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch, useContext } from "react";
import axios from "axios";
import Category from "../../../Types/Category";
import Address from "../../../Types/Address";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegStar } from "react-icons/fa";
import AlertMessage from "../../AlertMessage/AlertMessage";
import RequestHelpers from "../../../Other/RequestHelpers";
import { UserContext } from "../../../App"

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
            addressData: Address,
            setIsAddressCreationModalVisible: Dispatch<boolean>,
            setIsAddressUpdateModalVisible: Dispatch<boolean>,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
        }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const { user, setUser } = useContext(UserContext);
    const [formState, setFormState] = useState({
        Name: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        UserName: "",
        Gender: "",
        Birthday: new Date(),
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
        RequestHelpers.GetCategories(baseUrl, setCategories, setCurrentCategoryId);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const handleDropdownChange = (e) => setCurrentCategoryId(e.target.value);

    const requestHelpers = new RequestHelpers();

    const handleFormSubmit = async (e) => {
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
                setIsAlertModalVisible
            )
            : requestHelpers.MakeRequest(
                `${baseUrl}/UpdateAddress`,
                {
                    userId: user.id,
                    Id: addressData.id,
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
                setIsAlertModalVisible
            );
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
                                    <input name="Title" id="Title" placeholder={updateToggle ? addressData.title : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>First Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="FirstName" id="FirstName" placeholder={updateToggle ? addressData.firstName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Middle Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="MiddleName" id="MiddleName" placeholder={updateToggle ? addressData.middleName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Last Name</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="LastName" id="LastName" placeholder={updateToggle ? addressData.lastName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>UserName</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="UserName" id="UserName" placeholder={updateToggle ? addressData.userName : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Gender</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Gender" id="Gender" placeholder={updateToggle ? addressData.gender : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Birthday</td>
                                <td className={styles.TableColumnTwo}>
                                    <DatePicker className={styles.DatePicker} selected={formState.Birthday} onChange={(date) => {
                                        setFormState({
                                            ...formState,
                                            Birthday: date?.toISOString()
                                        });
                                    }} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Company</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Company" id="Company" placeholder={updateToggle ? addressData.company : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Address 1</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Address1" id="Address1" placeholder={updateToggle ? addressData.address1 : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Address 2</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Address2" id="Address2" placeholder={updateToggle ? addressData.address2 : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Address 3</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Address3" id="Address3" placeholder={updateToggle ? addressData.address3 : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>City</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="City" id="City" placeholder={updateToggle ? addressData.city : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>County</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="County" id="County" placeholder={updateToggle ? addressData.county : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>State</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="State" id="State" placeholder={updateToggle ? addressData.state : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Zip Code</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="ZipCode" id="ZipCode" placeholder={updateToggle ? addressData.zipCode : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Country</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Country" id="Country" placeholder={updateToggle ? addressData.country : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Email Address</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Email Address" id="Email Address" placeholder={updateToggle ? addressData.emailAddress : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Phone Number</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="PhoneNumber" id="PhoneNumber" placeholder={updateToggle ? addressData.phoneNumber : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Evening Phone</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="EveningPhone" id="EveningPhone" placeholder={updateToggle ? addressData.eveningPhone : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Mobile Phone</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="MobilePhone" id="MobilePhone" placeholder={updateToggle ? addressData.mobilePhone : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Fax</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Fax" id="Fax" placeholder={updateToggle ? addressData.fax : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Notes</td>
                                <td className={styles.TableNotes}>
                                    <input name="Notes" id="Notes" placeholder={updateToggle ? addressData.notes : ""} onChange={handleChange} className={styles.formInput} />
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
                    <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>
                </div>
            </div>
        </div>)
}

export default AddressCreationUpdateForm