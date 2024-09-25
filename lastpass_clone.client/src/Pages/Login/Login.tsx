import { useState, Dispatch } from "react";
import styles from "./styles.module.scss";
import logo from "../../assets/LastPass-Logo.png";
import axios from "axios";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";

// What if user tries to login again when there is already a token in localStorage?
    // both Login and Register components should check if there is a token, and if it is still valid, prior to granting access

const Login = (
    {
        baseUrl,
        setAlerts,
        setIsAlertModalVisible
    }: {
        baseUrl: string,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    }) => {
    const [formState, setFormState] = useState({
        Email: "",
        Password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const reset = () => {
            setAlerts([]);
            setIsAlertModalVisible(false);
        }
        axios
            .post(`${baseUrl}/Login`, {
                Email: formState.Email,
                Password: formState.Password
            })
            .then(response => {
                if (response.data.result === true) {
                    localStorage.setItem("token", response.data.token);
                    const alerts = [<AlertMessage message={"Log in successful!"} color={"green"} />];
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                } else {
                    const alerts = [<AlertMessage message={response.data.message} color={"red"} />];
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error) && error.response) {
                    const responseErrors = error.response.data.errors;
                    const errorAlerts: JSX.Element[] = [];
                    Object.keys(responseErrors).forEach(key => {
                        errorAlerts.push(<AlertMessage message={responseErrors[key]} color={"red"} />);
                    });
                    setAlerts(errorAlerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                }
            });
    }

    return (
        <div className={styles.RegisterPage}>
            <form className={styles.RegisterForm}>
                <div className={styles.RegisterLogoContainer}>
                    <img src={logo} alt="logo" style={{ height: "50px" }} />
                </div>
                <div className={styles.RegisterHeader}>
                    <div className={styles.RegisterHeaderLeftPanel}>
                        <span>LOG IN</span>
                    </div>
                    <div className={styles.RegisterHeaderRightPanel}>
                        <span onClick={() => window.location.replace("/register")}>Or create an account</span>
                    </div>
                </div>
                <div className={styles.RegisterInputs}>
                    <div className={styles.RegisterInputContainer}>
                        <span>Email Address</span>
                        <input name="Email" className={styles.RegisterInput} onChange={handleChange}></input>
                    </div>
                    <div className={styles.RegisterInputContainer}>
                        <span>Password</span>
                        <input name="Password" className={styles.RegisterInput} onChange={handleChange}></input>
                    </div>
                </div>
                <div className={styles.RegisterButtons}>
                    <button className={styles.RegisterSubmitBtn} onClick={handleFormSubmit}>Log in!</button>
                </div>
            </form>
        </div>
    )
}

export default Login;