import { Dispatch } from "react";
import AlertMessage from "../Components/AlertMessage/AlertMessage";
import axios, { AxiosResponse } from "axios";
import Category from "../Types/Category";

// A collection of functions that must be performed for each creation/update form
// Thought that this would help in the event of adding additional creation/update components
class RequestHelpers
{
    constructor() { }

    public MakeRequest(
        url: string,
        formStateData: object,
        updateToggle: boolean,
        successMessage: string,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    )
    {
        return !updateToggle
            ? axios.post(
                url,
                formStateData,
                RequestHelpers.GenerateRequestHeaders()
            )
                .then(response => {
                    if (response.data.success === true) {
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
                RequestHelpers.GenerateRequestHeaders()
            )
                .then((response) => {
                    if (response.data.success === true) {
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
        error: any,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    )
    {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
        const errors: JSX.Element[] = [];
        errors.push(<AlertMessage message={error.message} color={"red"} />);
        this.HandleAlerts(errors, setAlerts, setIsAlertModalVisible);
    }

    public HandleErrorAlerts(
        response: AxiosResponse,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>
    ) {
        const errors: JSX.Element[] = [];
        response.data.messages.forEach((message: string) => {
            errors.push(<AlertMessage message={message} color={"red"} />);
        });
        this.HandleAlerts(errors, setAlerts, setIsAlertModalVisible);
        return;
    }

    public HandleSuccessAlerts(
        message: string,
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>)
    {
        const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
        this.HandleAlerts(alerts, setAlerts, setIsAlertModalVisible);
        return;
    }

    private HandleAlerts(
        errors: JSX.Element[],
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>)
    {
        setAlerts(errors);
        setIsAlertModalVisible(true);
        setTimeout(() => this.Reset(setAlerts, setIsAlertModalVisible), 3000);
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
        return function (e: React.ChangeEventHandler<HTMLInputElement>) {
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
        setCurrentCategoryId: Dispatch<number>)
    {
        axios
            .get(`${baseUrl}/GetCategoriesByUserId`, RequestHelpers.GenerateRequestHeaders())
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

    public static SetLocalStorage = (token: string) => localStorage.setItem("token", token); 
}

export default RequestHelpers;