import styles from "./styles.module.scss";
import AuthenticationFormInput from "../../Types/AuthenticationFormInput";

interface AuthenticationFormProps {
    headerLeftText: string,
    headerRightText: string,
    headerRightTextLink: string,
    inputs?: AuthenticationFormInput[],
    bodyText?: string,
    handleFormSubmit: (e: React.FormEvent) => void
}

const AuthenticationForm: React.FC<AuthenticationFormProps> = (
    {
        headerLeftText,
        headerRightText,
        headerRightTextLink,
        inputs,
        bodyText,
        handleFormSubmit
    }) => {
    return (
        <div className={styles.RegisterPage}>
            <form className={styles.RegisterForm} onSubmit={() => false}>
                <div className={styles.RegisterLogoContainer}>
                    {/*<img src={logo} alt="logo" style={{ height: "50px" }} />*/}
                </div>
                <div className={styles.RegisterHeader}>
                    <div className={styles.RegisterHeaderLeftPanel}>
                        <span>{headerLeftText}</span>
                    </div>
                    <div className={styles.RegisterHeaderRightPanel}>
                        <span onClick={() => window.location.replace(headerRightTextLink)}>{headerRightText}</span>
                    </div>
                </div>
                <div className={styles.RegisterInputs}>
                    {inputs !== undefined && inputs !== null && inputs.map((input: AuthenticationFormInput) => {
                        return <div className={styles.RegisterInputContainer}>
                                    <span>{input.label}</span>
                                    <input type={input.inputType} name={input.inputName} className={styles.RegisterInput} onChange={input.handleChange}></input>
                                </div>
                    })}
                    {(inputs === undefined || inputs === null) && <span>{bodyText}</span>}
                </div>
                {inputs !== null && inputs !== undefined &&
                <div className={styles.RegisterButtons}>
                    <button className={styles.RegisterSubmitBtn} onClick={handleFormSubmit}>Log in!</button>
                </div>}
            </form>
        </div>
    )
}

export default AuthenticationForm;