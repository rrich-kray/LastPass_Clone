import { useEffect, useState, Dispatch, useContext } from "react";
import styles from "../../../Global/CreationUpdateForm.module.scss";
import axios from "axios";
import Note from "../../../Types/Note";
import Category from "../../../Types/Category";
import { FaRegStar } from "react-icons/fa";
import AlertMessage from "../../AlertMessage/AlertMessage"
import {UserContext} from "../../../App";
import RequestHelpers from "../../../Other/RequestHelpers";

const NoteCreationUpdateForm = (
    {
        setIsNoteCreationModalVisible,
        setIsNoteUpdateModalVisible,
        baseUrl,
        updateToggle,
        noteData,
        setAlerts,
        setIsAlertModalVisible
    }: {
            setIsNoteCreationModalVisible: Dispatch<boolean>,
            setIsNoteUpdateModalVisible: Dispatch<boolean>,
            baseUrl: string,
            updateToggle: boolean,
            noteData: Note | undefined,
            setNotes: Dispatch<JSX.Element[]>,
            setIsNoteModalVisible: Dispatch<boolean>
    }) => {
        const [categories, setCategories] = useState<Category[]>();
        const [currentCategoryId, setCurrentCategoryId] = useState<number>();
        const { user, setUser } = useContext(UserContext);
        const [formState, setFormState] = useState({
            Name: "",
            Content: ""
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
                    `${baseUrl}/CreateNote`,
                    {
                        userId: user.id,
                        Name: formState.Name,
                        Content: formState.Content,
                        CategoryId: currentCategoryId
                    },
                    false,
                    "Note Creation successful!",
                    setAlerts,
                    setIsAlertModalVisible
                )
                : requestHelpers.MakeRequest(
                    `${baseUrl}/UpdateNote`,
                    {
                        userId: user.id,
                        Id: noteData.id,
                        Name: formState.Name,
                        Content: formState.Content,
                        CategoryId: currentCategoryId!
                    },
                    true,
                    "Note update successful!",
                    setAlerts,
                    setIsAlertModalVisible
                );
        }
        return (
            <div className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
                <div className={styles.CreateNewPasswordHeader}>
                    <span>{updateToggle ? "Update Note" : "Create New Note"}</span>
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
                                    <td className={styles.TableColumnOne}>Content</td>
                                    <td className={styles.TableColumnTwo}>
                                        <input style={{ height: "150px" }} name="Content" id="Content" placeholder={updateToggle ? noteData.content : ""} onChange={handleChange} className={styles.formInput} />
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
                        <button type="submit" className={styles.CancelBtn} onClick={() => updateToggle ? setIsNoteUpdateModalVisible(false) : setIsNoteCreationModalVisible(false)}>Cancel</button>
                        <button type="submit" className={styles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        )

}

export default NoteCreationUpdateForm;