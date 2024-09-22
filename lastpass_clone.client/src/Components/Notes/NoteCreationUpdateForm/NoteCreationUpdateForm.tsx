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
            noteData: Note,
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

        const handleDropdownChange = (e) => setCurrentCategoryId(e.target.options.selectedIndex);

        const handleFormSubmit = async (e) => {
            e.preventDefault();
            const reset = () => {
                setAlerts([]);
                setIsAlertModalVisible(false);
            }
            return await
                !updateToggle
                ? axios.post(
                    `${baseUrl}/CreateNote`,
                    {
                        userId: user.id,
                        Name: formState.Name,
                        Content: formState.Content,
                        CategoryId: currentCategoryId
                    },
                    RequestHelpers.GenerateRequestHeaders())
                    .then(response => {
                        if (response.data.result === false) {
                            const errors: JSX.Element[] = [];
                            response.data.message.forEach((message: string) => {
                                errors.push(<AlertMessage message={message} color={"red"} />);
                            });
                            setAlerts(errors);
                            setIsAlertModalVisible(true);
                            setTimeout(reset, 3000);
                            return;
                        } else {
                            const message: string = "Note Creation successful!";
                            const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
                            setAlerts(alerts);
                            setIsAlertModalVisible(true);
                            setTimeout(reset, 3000);
                        }
                    })
                : axios.put(
                    `${baseUrl}/UpdateNote`,
                    {
                        userId: user.id,
                        Id: noteData.id,
                        Name: formState.Name,
                        Content: formState.Content,
                        CategoryId: currentCategoryId!
                    },
                    RequestHelpers.GenerateRequestHeaders())
                    .then(response => {
                        if (response.data.result === false) {
                            const errors: JSX.Element[] = [];
                            response.data.message.forEach((message: string) => {
                                errors.push(<AlertMessage message={message} color={"red"} />);
                            });
                            setAlerts(errors);
                            setIsAlertModalVisible(true);
                            setTimeout(reset, 3000);
                            return;
                        } else {
                            const message: string = "Note Update successful!"
                            const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
                            setAlerts(alerts);
                            setIsAlertModalVisible(true);
                            setTimeout(reset, 3000);
                        }
                    });
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
                                    <td className={styles.TableColumnOne}>Content</td>
                                    <td className={styles.TableColumnTwo}>
                                        <input name="Content" id="Content" placeholder={updateToggle ? noteData.content : ""} onChange={handleChange} className={styles.formInput} />
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