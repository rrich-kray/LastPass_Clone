import styles from "./styles.module.scss";
import globalStyles from "../../Global/CreationUpdateForm.module.scss";
import { useState, useEffect, useContext, Dispatch } from "react";
import { UserContext } from "../../App";
import RequestHelpers from "../../Other/RequestHelpers";
import Category from "../../Types/Category";

interface CategoryFormProps {
    baseUrl: string,
    setAlerts: Dispatch<JSX.Element[]>,
    setIsAlertModalVisible: Dispatch<boolean>,
    setIsCategoryCreationFormVisible: Dispatch<boolean>,
    setIsCategoryUpdateFormVisible: Dispatch<boolean>,
    updateToggle: boolean,
    currentCategoryId: number
}

const NewCategoryForm = (props: CategoryFormProps) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
    //const [categories, setCategories] = useState<Category[]>();
    const { 1: setCategories } = useState<Category[]>();
    const { 1: setCurrentCategoryId} = useState<string>();
    const [user] = useContext(UserContext);
    const [formState, setFormState] = useState({
        Name: ""
    })

    useEffect(() => {
        RequestHelpers.GetCategories(props.baseUrl, setCategories, setCurrentCategoryId);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }
    console.log(formState);

    //const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentCategoryId(e.target.value);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const requestHelpers = new RequestHelpers();
        return await
            !props.updateToggle ?
             requestHelpers.MakeRequest(
                 `${props.baseUrl}/CreateCategory`,
                {
                    userId: user.id,
                    name: formState.Name
                },
                false,
                "Category Creation successful!",
                props.setAlerts,
                props.setIsAlertModalVisible,
                setIsSubmitButtonDisabled
            ) :
            requestHelpers.MakeRequest(
                `${props.baseUrl}/UpdateCategory`,
                {
                    id: props.currentCategoryId,
                    userId: user.id,
                    name: formState.Name
                },
                true,
                "Category update successful!",
                props.setAlerts,
                props.setIsAlertModalVisible,
                setIsSubmitButtonDisabled
            )

    }
    return (
        <div className={styles.NewCategoryForm} onClick={(e) => e.stopPropagation()}>
            <div className={globalStyles.CreateNewPasswordHeader}>
                <span>{ props.updateToggle ? "Update Category Name" : "Create New Category"}</span>
            </div>
            <div className={styles.NewCategoryBody}>
                <div className={styles.NewCategoryInputContainer}>
                    <p>Category Name:</p>
                    <input name="Name" id="Name" onChange={handleChange}></input>
                </div>
                {/*
                    <div className={styles.NewCategoryInputContainer}>
                        <p style={{ bottom: "5px" }}>Add as a subfolder here:</p>
                        <select onChange={handleDropdownChange}>{categories && categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                    </div>*/}
            </div>
            <div className={styles.NewCategoryFooter}>
                <div className={globalStyles.CreateNewPasswordFooterLeftContainer}>
                    <button className={styles.FaveBtn}></button>
                </div>
                <div className={globalStyles.CreateNewPasswordFooterRightContainer}>
                    <button type="submit" className={globalStyles.CancelBtn} onClick={() => props.updateToggle ? props.setIsCategoryUpdateFormVisible(false) : props.setIsCategoryCreationFormVisible(false)}>Cancel</button>
                    {!isSubmitButtonDisabled && <button type="submit" className={globalStyles.SubmitBtn} onClick={handleFormSubmit}>Submit</button>}
                </div>
            </div>
        </div>
    );
}

export default NewCategoryForm;