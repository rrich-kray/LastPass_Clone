import { useState, useEffect, Dispatch } from "react";
import axios from "axios";
import RequestHelpers from "../Other/RequestHelpers.tsx";
import AlertMessage from "../Components/AlertMessage/AlertMessage.tsx";
import User from "../Types/User.ts"

const useAuthenticationFunctions = (
    userInfo: object,
    url: string,
    setAlerts: Dispatch<JSX.Element[]>,
    setIsAlertModalVisible: Dispatch<boolean>,
    setUser: Dispatch<User>) => {

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
        axios
            .post(url, userInfo, RequestHelpers.GenerateAuthenticationRequestHeaders())
            .then(response => {
                if (response.data.result === true) {
                    localStorage.setItem("token", response.data.token);
                    const alerts = [<AlertMessage message={"Log in successful!"} color={"green"} />];
                    setUser(response.data.user);
                    setAlerts(alerts);
                    setIsAlertModalVisible(true);
                    setTimeout(reset, 3000);
                } else {
                    const alerts = response.data.messages.map((message: string) => <AlertMessage message={message} color={"red"} />)
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
     return { handleChange, handleFormSubmit };
}

export default useAuthenticationFunctions;