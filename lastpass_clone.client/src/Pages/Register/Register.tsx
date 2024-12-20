import { useState, useContext, Dispatch } from "react";
import axios from "axios";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";
import { UserContext } from "../../App";
import RequestHelpers from "../../Other/RequestHelpers.tsx";
import AuthenticationForm from "../../Components/AuthenticationForm/AuthenticationForm.tsx";
import AuthenticationFormInput from "../../Types/AuthenticationFormInput";
import LoadingOverlay from "../../Components/LoadingOverlay/LoadingOverlay.tsx"

interface RegisterFormState {
    Email: string,
    Password: string,
    ConfirmPassword: string
}

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
    const { 1: setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formState, setFormState] = useState<RegisterFormState>({
        Email: "",
        Password: "",
        ConfirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reset = () => {
            setAlerts([]);
            setIsAlertModalVisible(false);
        }
        setIsLoading(true);
        if (formState.Password !== formState.ConfirmPassword) {
            setIsLoading(false);
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
            },
            RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === true) {
                    setIsLoading(false);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userId", response.data.userId);
                    const alerts = [<AlertMessage message={"Account creation successful!"} color={"green"} />];
                    setUser(response.data.user);
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                } else {
                    setIsLoading(false);
                    const errorAlerts: JSX.Element[] = [];
                    response.data.messages.forEach((message: string)=> {
                        errorAlerts.push(<AlertMessage message={message} color={"red"} />);
                    })
                    setAlerts(errorAlerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error) && error.response) {
                    setIsLoading(false);
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
        {
            label: "Confirm Password",
            inputType: "password",
            inputName: "ConfirmPassword",
            handleChange: handleChange
        },
    ]

    return (
        <>
            {isLoading && <LoadingOverlay />}      
            <AuthenticationForm
                headerLeftText={"Register"}
                headerRightText={"Log in"}
                headerRightTextLink={"/Login"}
                inputs={inputs}
                handleFormSubmit={handleFormSubmit}
                buttonText={"Register"}
                resetPassword={false} />
        </>
    )
}

export default Register;