import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import PasswordInfo from "../../Types/PasswordInfo";
import Password from "../../Types/Password";
import Category from "../../Types/Category";


const PasswordCreationUpdateForm = ({ baseUrl, updateToggle, passwordData }: { baseUrl: string, updateToggle: boolean, passwordData: Password }) => {
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [formState, setFormState] = useState({
        Website: "",
        Username: "",
        Password: "",
        Notes: "",
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
        const passwordInfo: PasswordInfo =
        {
            Website: formState.Website,
            Username: formState.Username,
            Password: formState.Password,
            Notes: formState.Notes,
            CategoryId: currentCategoryId!
        };
        const headers = {
            'Content-Type': 'application/json'
        }
        return await
            !updateToggle
            ? axios.post(`${baseUrl}/CreatePassword`, passwordInfo, { headers: headers })
            : axios.put(
                `${baseUrl}/UpdatePassword`,
                {
                    Id: passwordData.id,
                    Website: formState.Website,
                    Username: formState.Username,
                    Password: formState.Password,
                    Notes: formState.Notes,
                    CategoryId: currentCategoryId
                });
    }

    return (
        <form className={styles.CreateNewPasswordForm} onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
            <span style={{ marginBottom: 50, fontWeight: 'bold', fontSize: 25 }}>Create New Password</span>
            <div className={styles.FormInputWrapperContainer}>
                <div className={styles.FormInputWrapper}>
                    <span>Website</span>
                    <input name="Website" id="Website" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Username</span>
                    <input name="Username" id="Username" onChange={handleChange} className={styles.formInput} />
                </div>
                <div className={styles.FormInputWrapper}>
                    <span>Password</span>
                    <input name="Password" id="Password" onChange={handleChange} className={styles.formInput} />
                </div>
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
                <button type="submit" className={styles.SubmitBtn} style={{marginTop: 25}}>Submit</button>
            </div>
        </form>)
}

export default PasswordCreationUpdateForm