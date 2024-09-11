import { useEffect, useState, Dispatch } from "react";
import styles from "../../../Global/CreationUpdateForm.module.scss";
import axios from "axios";
import Note from "../../../Types/Note";
import Category from "../../../Types/Category";
import { FaRegStar } from "react-icons/fa";

const NoteCreationUpdateForm = (
    {
        setIsNoteCreationModalVisible,
        setIsNoteUpdateModalVisible,
        baseUrl,
        updateToggle,
        noteData
    }: {
            setIsNoteCreationModalVisible: Dispatch<boolean>,
            setIsNoteUpdateModalVisible: Dispatch<boolean>,
            baseUrl: string,
            updateToggle: boolean,
            noteData: Note
    }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        Name: "",
        Content: ""
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
            ? axios.post(
                `${baseUrl}/CreateNote`,
                {
                    Name: formState.Name,
                    Content: formState.Content,
                    CategoryId: currentCategoryId
                })
            : axios.put(
                `${baseUrl}/UpdateNote`,
                {
                    Id: noteData.id,
                    Name: formState.Name,
                    Content: formState.Content,
                    CategoryId: currentCategoryId!
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