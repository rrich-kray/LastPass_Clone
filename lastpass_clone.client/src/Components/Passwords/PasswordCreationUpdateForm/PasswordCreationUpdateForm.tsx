import styles from "../../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, Dispatch, useContext } from "react";
import axios from "axios";
import Password from "../../../Types/Password";
import Category from "../../../Types/Category";
import { FaRegStar } from "react-icons/fa";
import AlertMessage from "../../AlertMessage/AlertMessage";
import RequestHelpers from "../../../Other/RequestHelpers";
import { UserContext } from "../../../App";

const PasswordCreationUpdateForm =
    ({
        baseUrl,
        updateToggle,
        passwordData,
        setIsPasswordCreationModalVisible,
        setIsPasswordUpdateModalVisible,
        setAlerts,
        setIsAlertModalVisible
    }: {
            baseUrl: string,
            updateToggle: boolean,
            passwordData: Password,
            setIsPasswordCreationModalVisible: Dispatch<boolean>,
            setIsPasswordUpdateModalVisible: Dispatch<boolean>,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
    }) => {
        const [categories, setCategories] = useState<Category[]>();
        const [currentCategoryId, setCurrentCategoryId] = useState<number>();
        const { user, setUser } = useContext(UserContext);
        const [formState, setFormState] = useState({
            Name: "",
            Website: "",
            Username: "",
            Password: "",
            Notes: "",
        });

    useEffect(() => {
        RequestHelpers.GetCategories(baseUrl, setCategories, setCurrentCategoryId);
    }, []);

        console.log(`Passwords user ID: ${user.id}`);

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
                `${baseUrl}/CreatePassword`,
                {
                    userId: user.id,
                    name: formState.Name,
                    website: formState.Website,
                    username: formState.Username,
                    password: formState.Password,
                    notes: formState.Notes,
                    categoryId: currentCategoryId!
                },
                false,
                "Password Creation successful!",
                setAlerts,
                setIsAlertModalVisible
            )
            : requestHelpers.MakeRequest(
                `${baseUrl}/UpdatePassword`,
                {
                    Id: passwordData.id,
                    userId: user.id,
                    Name: formState.Name,
                    Website: formState.Website,
                    Username: formState.Username,
                    Password: formState.Password,
                    Notes: formState.Notes,
                    CategoryId: currentCategoryId
                },
                true,
                "Password update successful!",
                setAlerts,
                setIsAlertModalVisible
            );
    }

    return (
        <div className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <div className={styles.CreateNewPasswordHeader}>
                <span>{updateToggle ? "Update Password" : "Create New Password"}</span>
            </div>
            <div className={styles.CreateNewPasswordBody}>
                <div className={styles.CreateNewPasswordBodyLeftPanel}>
                    <div className={styles.CreateNewPasswordName}>
                        <span>Name</span>
                        <input name="Name" id="Name" style={{ borderColor: "border-color: rgb(167, 175, 186)"}} placeholder={updateToggle ? passwordData.name : ""} onChange={handleChange} />
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
                                <td className={styles.TableColumnOne}>Website</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Website" id="Website" placeholder={updateToggle ? passwordData.website : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Username</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Username" id="Username" placeholder={updateToggle ? passwordData.username : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Password</td>
                                <td className={styles.TableColumnTwo}>
                                    <input name="Password" id="Password" placeholder={updateToggle ? passwordData.password : ""} onChange={handleChange} className={styles.formInput} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.TableColumnOne}>Notes</td>
                                <td className={styles.TableNotes}>
                                    <input name="Notes" id="Notes" placeholder={updateToggle ? passwordData.notes : ""} onChange={handleChange} className={styles.formInput} />
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
                    <button type="submit" className={styles.CancelBtn} onClick={() => updateToggle ? setIsPasswordUpdateModalVisible(false) : setIsPasswordCreationModalVisible(false)}>Cancel</button>
                    <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>
                </div>
            </div>
        </div>)
}

export default PasswordCreationUpdateForm