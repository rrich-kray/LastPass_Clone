import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import axios from "axios";
import Note from "../../../Types/Note";
import Category from "../../../Types/Category";

const NoteCreationUpdateForm = ({ baseUrl, updateToggle, noteData }: { baseUrl: string, updateToggle: boolean, noteData: Note }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        NoteName: "",
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
                    NoteName: formState.NoteName,
                    Content: formState.Content,
                    CategoryId: currentCategoryId
                })
            : axios.put(
                `${baseUrl}/UpdateNote`,
                {
                    Id: noteData.id,
                    NoteName: formState.NoteName,
                    Content: formState.Content,
                    CategoryId: currentCategoryId!
                });
    }
    return (
        <form className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <span style={{ marginBottom: 50, fontWeight: 'bold', fontSize: 25 }}>Create New Password</span>
            <div className={styles.FormInputWrapperContainer}>
                <div className={styles.FormInputWrapper}>
                    <span>Note Name</span>
                    <input name="NoteName" id="NoteName" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Note</span>
                    <input name="Note" id="Note" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Category</span>
                    <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id}>{c.name}</option>)}</select>
                </div>
            </div>
            <div className={styles.BtnWrapper}>
                <button type="submit" className={styles.SubmitBtn} style={{ marginTop: 25 }}>Submit</button>
            </div>
        </form>
    )

}

export default NoteCreationUpdateForm;