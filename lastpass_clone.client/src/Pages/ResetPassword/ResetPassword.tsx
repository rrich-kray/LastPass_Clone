import { useState, Dispatch } from "react";
import AuthenticationForm from "../../Components/AuthenticationForm/AuthenticationForm.tsx";
import AuthenticationFormInput from "../../Types/AuthenticationFormInput.ts";
import axios from "axios";
import RequestHelpers from "../../Other/RequestHelpers.tsx";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";

interface ResetPasswordProps {
    baseUrl: string,
    setAlerts: Dispatch<JSX.Element[]>,
    setIsAlertModalVisible: Dispatch<boolean>
}

const ResetPassword: React.FC<ResetPasswordProps> = (
    {
        baseUrl,
        setAlerts,
        setIsAlertModalVisible
    }
) => {
    const [wasEmailSent, setWasEmailSent] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        Email: ""
    })

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
        axios
            .post(`${baseUrl}/ResetPassword`, {
                Email: formState.Email,
            },
                RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === true) {
                    localStorage.setItem("token", response.data.token);
                    const alerts = [<AlertMessage message={"Log in successful!"} color={"green"} />];
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                    setWasEmailSent(true);
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
            })
    }
    const inputs: AuthenticationFormInput[] = [
        {
            label: "Email Address",
            inputType: "text",
            inputName: "Email",
            handleChange: handleChange
        },
    ]

    return (
        <>
            {!wasEmailSent && <AuthenticationForm
                headerLeftText={"Reset Password"}
                headerRightText={"Or log in"}
                headerRightTextLink={"/Login"}
                inputs={inputs}
                handleFormSubmit={handleFormSubmit} />}

            {wasEmailSent && <AuthenticationForm
                headerLeftText={"Reset Password"}
                headerRightText={"Or log in"}
                headerRightTextLink={"/Login"}
                bodyText={"Please check your inbox (and spam folder) for a password recovery email."}
                handleFormSubmit={handleFormSubmit} />}
        </>
    )
}


    export default ResetPassword;