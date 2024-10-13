import { Dispatch } from "react";
import AlertMessage from "../Components/AlertMessage/AlertMessage";
import axios, { AxiosResponse } from "axios";
import Category from "../Types/Category";

// A collection of functions that must be performed for each creation/update form
// Thought that this would help in the event of adding additional creation/update components

class AxiosError {
    response: AxiosResponse;
    request: object;
    message: string;
    config: object;
    constructor(response: AxiosResponse, request: object, message: string, config: object) {
        this.response = response;
        this.request = request;
        this.message = message;
        this.config = config;
    }
}
class RequestHelpers
{

    constructor() { }

    public MakeRequest(
        url: string,
        formStateData: object,
        updateToggle: boolean,
        successMessage: string,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>,
        setIsSubmitButtonDisabled: Dispatch<boolean>
    )
    {
        return !updateToggle
            ? axios.post(
                url,
                formStateData,
                RequestHelpers.GenerateFullRequestHeaders()
            )
                .then(response => {
                    if (response.data.success === true) {
                        setIsSubmitButtonDisabled(true);
                        this.HandleSuccessAlerts(successMessage, setAlerts, setIsAlertModalVisible);
                    } else {
                        this.HandleErrorAlerts(response, setAlerts, setIsAlertModalVisible);
                    }
                })
                .catch(error => {
                    this.HandleAxiosCatchErrors(error, setAlerts, setIsAlertModalVisible);
                })
            : axios.put(
                url,
                formStateData,
                RequestHelpers.GenerateFullRequestHeaders()
            )
                .then((response) => {
                    if (response.data.success === true) {
                        setIsSubmitButtonDisabled(true);
                        this.HandleSuccessAlerts(successMessage, setAlerts, setIsAlertModalVisible);
                    } else {
                        this.HandleErrorAlerts(response, setAlerts, setIsAlertModalVisible);
                    }
                })
                .catch(error => {
                    this.HandleAxiosCatchErrors(error, setAlerts, setIsAlertModalVisible);
                })

    }

    public HandleAxiosCatchErrors(
        error: unknown,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    )
    {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            const errors: JSX.Element[] = [];
            errors.push(<AlertMessage message={error.message} color={"red"} />);
            this.HandleAlerts(errors, setAlerts, setIsAlertModalVisible, 3000);
        }
    }

    public HandleErrorAlerts(
        response: AxiosResponse,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    ) {
        console.log(response);
        const errors: JSX.Element[] = [];
        if (response.data.messages) {
            response.data.messages.forEach((message: string) => {
                errors.push(<AlertMessage message={message} color={"red"} />);
            });
        } else {
            errors.push(<AlertMessage message={"An unkown error occurred."} color={"red"} />);
        }
        this.HandleAlerts(errors, setAlerts, setIsAlertModalVisible, 3000);
        return;
    }

    public HandleSuccessAlerts(
        message: string,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>)
    {
        const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
        this.HandleAlerts(alerts, setAlerts, setIsAlertModalVisible, 1500);
        setTimeout(() => window.location.replace("/"), 1500)
        return;
    }

    private HandleAlerts(
        errors: JSX.Element[],
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>,
        delay: number)
    {
        setAlerts(errors);
        setIsAlertModalVisible(true);
        setTimeout(() => {
            this.Reset(setAlerts, setIsAlertModalVisible);
        }, delay);
    }

    private Reset(
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    ): void
    {
        setAlerts([]);
        setIsAlertModalVisible(false);
    }

    public HandleChange(
        formState: object,
        setFormState: Dispatch<React.SetStateAction<object>>)
    {
        return function (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
            const { name, value } = e.target;
            setFormState({
                ...formState,
                [name]: value
            });
        }
    }

    public static GetCategories(
        baseUrl: string,
        setCategories: Dispatch<React.SetStateAction<Category[] | undefined>>,
        setCurrentCategoryId: Dispatch<string>,
        userId: string)
    {
        axios
            .get(`${baseUrl}/GetCategoriesByUserId/${userId}`, RequestHelpers.GenerateFullRequestHeaders())
            .then(response => {
                const data = response.data;
                setCategories(data);
                setCurrentCategoryId(data.id);
            })
            .catch(error => {
                console.log(error);
            })
    }

    public static GenerateRequestHeaders()
    {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }
    }

    public static GenerateAuthenticationRequestHeaders()
    {
        return {
            headers: {
                'Ocp-Apim-Subscription-Key': import.meta.env.VITE_API_SUBSCRIPTION_KEY
            }
        }
    }

    public static GenerateFullRequestHeaders()
    {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Ocp-Apim-Subscription-Key': import.meta.env.VITE_API_SUBSCRIPTION_KEY
            }
        }
    }

    public static SetLocalStorage = (token: string) => localStorage.setItem("token", token); 
}

export default RequestHelpers;