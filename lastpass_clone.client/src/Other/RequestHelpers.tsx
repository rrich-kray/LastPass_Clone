import { Dispatch } from "react";
import AlertMessage from "../Components/AlertMessage/AlertMessage";
import axios, { AxiosResponse } from "axios";
import Category from "../Types/Category"

// A collection of functions that must be performed for each creation/update form
// Thought that this would help in the event of adding additional creation/update components
class RequestHelpers
{
    SetAlerts: Dispatch<JSX.Element[]>;
    SetIsAlertModalVisible: Dispatch<boolean>
    constructor(
        setAlerts: Dispatch<JSX.Element[]>,
        setIsAlertModalVisible: Dispatch<boolean>,
    ) {
        this.SetAlerts = setAlerts;
        this.SetIsAlertModalVisible = setIsAlertModalVisible;
    }

    public MakeRequest(
        url: string,
        formStateData: object,
        updateToggle: boolean,
        successMessage: string
    )
    {
        return !updateToggle
            ? axios.post(
                url,
                formStateData
            )
                .then(response => this.HandleErrorAlerts(response))
            : axios.put(
                url,
                formStateData
            )
                .then(response => this.HandleSuccessAlerts(successMessage))

    }

    private Reset()
    {
        this.SetAlerts([]);
        this.SetIsAlertModalVisible(false);
    }

    private HandleAlerts(errors: JSX.Element[])
    {
        this.SetAlerts(errors);
        this.SetIsAlertModalVisible(true);
        setTimeout(this.Reset, 3000);
    }

    private HandleErrorAlerts(
        response: AxiosResponse,
    )
    {
        const errors: JSX.Element[] = [];
        response.data.message.forEach((message: string) => {
            errors.push(<AlertMessage message={message} color={"red"} />);
        });
        this.HandleAlerts(errors);
        return;
    }

    private HandleSuccessAlerts(message: string)
    {
        const alerts: JSX.Element[] = [<AlertMessage message={message} color={"green"} />];
        this.HandleAlerts(alerts);
        return;
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

    public GetCategories(
        baseUrl: string,
        setCategories: Dispatch<React.SetStateAction<Category[] | undefined>>,
        setCurrentCategoryId: Dispatch<number>)
    {
        axios
            .get(`${baseUrl}/GetCategories`)
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