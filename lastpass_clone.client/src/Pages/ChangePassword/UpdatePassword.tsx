import { useState, Dispatch, useEffect } from "react";
import AuthenticationForm from "../../Components/AuthenticationForm/AuthenticationForm.tsx";
import AuthenticationFormInput from "../../Types/AuthenticationFormInput.ts";
import axios from "axios";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";
//import AuthenticationResponse from "../../Types/AuthenticationResponse.ts";
import { useParams } from "react-router-dom";
import RequestHelpers from "../../Other/RequestHelpers.tsx";

interface UpdatePasswordProps {
    baseUrl: string,
    setAlerts: Dispatch<JSX.Element[]>,
    setIsAlertModalVisible: Dispatch<boolean>,
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
    const { key } = useParams();
    const [isUpdateGuidValid, setIsUpdateGuidValid] = useState<boolean | null>(null);
    const [updateResultMessage, setUpdateResultMessage] = useState<string>("");
    const [hasPasswordBeenReset, setHasPasswordBeenReset] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        password: ""
    })

    useEffect(() => {
        axios
            .get(`${props.baseUrl}/VerifyPasswordReset/${key}`, RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === false) {
                    setIsUpdateGuidValid(false);
                    setUpdateResultMessage(response.data.messages[0]); // Backend will only return a single message
                } else {
                    setIsUpdateGuidValid(true);
                } 
            });
    }, [])

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
            props.setAlerts([]);
            props.setIsAlertModalVisible(false);
        }
        axios
            .put(`${props.baseUrl}/ChangePassword`, {
                Password: formState.password,
                Guid: key
            },
                RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === true) {
                    setHasPasswordBeenReset(true);
                } else {
                    const alerts = response.data.messages.map((message: string) => <AlertMessage message={message} color={"red"} />)
                    props.setAlerts(alerts);
                    props.setIsAlertModalVisible(true);
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
                    props.setAlerts(errorAlerts);
                    props.setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                }
            })
    }
    const inputs: AuthenticationFormInput[] = [
        {
            label: "Password",
            inputType: "text",
            inputName: "password",
            handleChange: handleChange
        },
        {
            label: "Confirm Password",
            inputType: "text",
            inputName: "password",
            handleChange: handleChange
        },
    ]

    return (
        <>
            {hasPasswordBeenReset && <AuthenticationForm
                headerLeftText={"Update Password"}
                headerRightText={"Log in"}
                headerRightTextLink={"/Login"}
                bodyText={"Your password has been reset. Please navigate to the login page to login."}
                handleFormSubmit={handleFormSubmit}
                buttonText={"Update Password"}
                resetPassword={false} />}

            {isUpdateGuidValid && <AuthenticationForm
                headerLeftText={"Reset Password"}
                headerRightText={"Or log in"}
                headerRightTextLink={"/Login"}
                inputs={inputs}
                handleFormSubmit={handleFormSubmit}
                buttonText={"Update Password"}
                resetPassword={false} />}

            {!isUpdateGuidValid && <AuthenticationForm
                headerLeftText={"Update Password"}
                headerRightText={"Or reset password"}
                headerRightTextLink={"/ResetPassword"}
                bodyText={updateResultMessage}
                handleFormSubmit={handleFormSubmit}
                buttonText={"Update Password"}
                resetPassword={true} />}
        </>
    )
}


export default UpdatePassword;