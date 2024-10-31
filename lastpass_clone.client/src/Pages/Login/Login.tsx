import { useState, Dispatch, useContext } from "react";
import axios from "axios";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";
import { UserContext } from "../../App";
import RequestHelpers from "../../Other/RequestHelpers.tsx";
import AuthenticationForm from "../../Components/AuthenticationForm/AuthenticationForm.tsx";
import AuthenticationFormInput from "../../Types/AuthenticationFormInput";
import LoadingOverlay from "../../Components/LoadingOverlay/LoadingOverlay.tsx"

// What if user tries to login again when there is already a token in localStorage?
    // both Login and Register components should check if there is a token, and if it is still valid, prior to granting access

interface LoginProps {
    baseUrl: string,
    setAlerts: Dispatch<JSX.Element[]>,
    setIsAlertModalVisible: Dispatch<boolean>
}

const Login: React.FC<LoginProps> = (
    {
        baseUrl,
        setAlerts,
        setIsAlertModalVisible
    }) => {
    const { 1: setUser } = useContext(UserContext);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        Email: "",
        Password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const handleFormSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const reset = () => {
            setAlerts([]);
            setIsAlertModalVisible(false);
        }
        setIsloading(true);
        axios
            .post(`${baseUrl}/Login`, {
                Email: formState.Email,
                Password: formState.Password
            },
            RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === true) {
                    setIsloading(false);
                    localStorage.setItem("token", response.data.token);
                    const alerts = [<AlertMessage message={"Log in successful!"} color={"green"} />];
                    setUser(response.data.user);
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                } else {
                    setIsloading(false);
                    const alerts = response.data.messages.map((message: string) => <AlertMessage message={message} color={"red"} />)
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                }
            })
            .catch(error => {
                setIsloading(false);
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
            })
    }

    const inputs: AuthenticationFormInput[] = [
        {
            label: "Email Address",
            inputType: "text",
            inputName: "Email",
            handleChange: handleChange
        },
        {
            label: "Password",
            inputType: "password",
            inputName: "Password",
            handleChange: handleChange
        },
    ]

    return (
            <>
                { isLoading && <LoadingOverlay /> }
                <AuthenticationForm
                    headerLeftText={"Log In"}
                    headerRightText={"Or create an account"}
                    headerRightTextLink={"/Register"}
                    inputs={inputs}
                    handleFormSubmit={handleFormSubmit}
                    buttonText={"Log in!"}
                    resetPassword={true} />
            </>
         
    )
}

export default Login;