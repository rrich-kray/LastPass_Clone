import { useState, Dispatch, useEffect } from "react";
import AuthenticationForm from "../../Components/AuthenticationForm/AuthenticationForm.tsx";
import AuthenticationFormInput from "../../Types/AuthenticationFormInput.ts";
import axios from "axios";
import RequestHelpers from "../../Other/RequestHelpers.tsx";
import AlertMessage from "../../Components/AlertMessage/AlertMessage.tsx";
//import AuthenticationResponse from "../../Types/AuthenticationResponse.ts";
import { useParams } from "react-router-dom";

interface UpdatePasswordProps {
    baseUrl: string,
    setAlerts: Dispatch<JSX.Element[]>,
    setIsAlertModalVisible: Dispatch<boolean>,
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
    const { guid } = useParams();
    const [isUpdateGuidValid, setIsUpdateGuidValid] = useState<boolean>(true);
    const [formState, setFormState] = useState({
        password: ""
    })

    useEffect(() => {
        axios
            .get(`${props.baseUrl}/VerifyPasswordReset/${guid}`)
            .then(response => {
                if (response.data.result === false) {
                    setIsUpdateGuidValid(false);
                }
            });
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
            props.setAlerts([]);
            props.setIsAlertModalVisible(false);
        }
        axios
            .put(`${props.baseUrl}/ChangePassword`, {
                Password: formState.password,
                Guid: guid
            },
                RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === true) {
                    const alerts = [<AlertMessage message={"Password successfully changed. Please login with your new credentials."} color={"green"} />];
                    props.setAlerts(alerts);
                    props.setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                    window.location.replace("/Login");
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
                bodyText={"Your token has expired. Please navigate to the password reset page using the link above and acquire a new one."}
                handleFormSubmit={handleFormSubmit}
                buttonText={"Update Password"}
                resetPassword={true} />}
        </>
    )
}


export default UpdatePassword;