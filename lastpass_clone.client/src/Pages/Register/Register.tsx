import { useState, useEffect, useContext, Dispatch } from "react";
import styles from "./styles.module.scss";
import logo from "../../assets/LastPass-Logo.png";
import axios from "axios";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";

const Register = (
    {
        baseUrl,
        setAlerts,
        setIsAlertModalVisible
    }: {
            baseUrl: string,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>
    }) => {
    const { user, setUser } = useContext(UserContext);
    const [formState, setFormState] = useState({
        Email: "",
        Password: "",
        ConfirmPassword: ""
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
        if (formState.Password !== formState.ConfirmPassword) {
            const alerts = [<AlertMessage message={"Passwords do not match"} color={"red"} />]
            setAlerts(alerts);
            setIsAlertModalVisible(true);
            setTimeout(reset, 3000);
            return;
        }
        axios
            .post(`${baseUrl}/Register`, {
                Email: formState.Email,
                Password: formState.Password
            })
            .then(response => {
                if (response.data.result === true) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userId", response.data.userId);
                    const alerts = [<AlertMessage message={"Account creation successful!"} color={"green"} />];
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                } else {
                    const errorAlerts: JSX.Element[] = [];
                    errorAlerts.push(<AlertMessage message={response.data.message} color={"red"} />);
                    setAlerts(errorAlerts);
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

    console.log(`User context User ID Register: ${user?.userId}`);
    console.log(`User context token Register: ${user?.token}`);

    return (
        <div className={styles.RegisterPage}>
            <form className={styles.RegisterForm}>
                <div className={styles.RegisterLogoContainer}>
                    <img src={logo} alt="logo" style={{height: "50px"}} />
                </div>
                <div className={styles.RegisterHeader}>
                    <div className={styles.RegisterHeaderLeftPanel}>
                        <span>CREATE AN ACCOUNT</span>
                    </div>
                    <div className={styles.RegisterHeaderRightPanel}>
                        <span>Or Log In</span>
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
                    <div className={styles.RegisterInputContainer}>
                        <span>Confirm Password</span>
                        <input name="ConfirmPassword" className={styles.RegisterInput} onChange={handleChange}></input>
                    </div>
                </div>
                <div className={styles.RegisterButtons}>
                    <button className={styles.RegisterSubmitBtn} onClick={handleFormSubmit}>Register!</button>
                </div>
            </form>
        </div>
    )
}

export default Register;