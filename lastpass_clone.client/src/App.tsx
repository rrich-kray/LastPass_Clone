import Main from "./Pages/Main/Main";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx"
import { createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import AlertModal from "./Components/AlertModal/AlertModal.tsx";
import AuthorizeView from "./Components/AuthorizeView/AuthorizeView.tsx";
import AccessLoginRegister from "./Components/AccessLoginRegister/AccessLoginRegister.tsx";
import axios from "axios";
import RequestHelpers from "./Other/RequestHelpers";
import User from "./Types/User.ts";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.tsx";
import UpdatePassword from "./Pages/ChangePassword/UpdatePassword.tsx";

const defaultValues = {
    id: "",
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    isAccountVerified: false,
    roles: []
}

type IUserState = [
    user: User,
    setUser: Dispatch<SetStateAction<User>>
]

export const UserContext = createContext<IUserState>([defaultValues, () => { }]);
function App() {

    const [alerts, setAlerts] = useState<JSX.Element[]>();
    const [isAlertModalVisible, setIsAlertModalVisible] = useState<boolean>();
    const [user, setUser] = useState<User>(defaultValues);

    useEffect(() => {
        console.log(RequestHelpers.GenerateFullRequestHeaders());
        axios
            .get(`${baseUrl}/GetUserData`, RequestHelpers.GenerateFullRequestHeaders())
            .then(response => {
                setUser(response.data.user)
            })
            .catch(error => console.log(error));
    }, []);


    const baseUrl: string = "https://localhost:32807"; // put this in ENV file at some point
    //const baseUrl: string = "https://passwordmanagerserverapi.azure-api.net";
    //const baseUrl: string = "https://passwordmanagerapi.azure-api.net";

    return (
        <UserContext.Provider value={[user, setUser]}>
            <BrowserRouter>
                {isAlertModalVisible && alerts && <AlertModal errors={alerts} />}
                <Routes>
                    <Route path="/login" element={
                        <AccessLoginRegister baseUrl={baseUrl}>
                            <Login baseUrl={baseUrl} setAlerts={setAlerts} setIsAlertModalVisible={setIsAlertModalVisible} />
                        </AccessLoginRegister>
                    } />
                    <Route path="/register" element={
                        <AccessLoginRegister baseUrl={baseUrl}>
                            <Register
                                baseUrl={baseUrl}
                                setAlerts={setAlerts}
                                setIsAlertModalVisible={setIsAlertModalVisible} />
                        </AccessLoginRegister>
                    } />
                    <Route path="/ResetPassword" element={
                        <AccessLoginRegister baseUrl={baseUrl}>
                            <ResetPassword baseUrl={baseUrl} setAlerts={setAlerts} setIsAlertModalVisible={setIsAlertModalVisible} />
                        </AccessLoginRegister>
                    } />
                    <Route path="/UpdatePassword/:key" element={
                        <AccessLoginRegister baseUrl={baseUrl}>
                            <UpdatePassword baseUrl={baseUrl} setAlerts={setAlerts} setIsAlertModalVisible={setIsAlertModalVisible} />
                        </AccessLoginRegister>
                    } />
                    <Route path="/" element={
                        <AuthorizeView baseUrl={baseUrl}>
                            {user !== null && user !== undefined && user.id !== "" &&
                            <Main
                                baseUrl={baseUrl}
                                alerts={alerts!}
                                isAlertModalVisible={isAlertModalVisible!}
                                setAlerts={setAlerts}
                                setIsAlertModalVisible={setIsAlertModalVisible}
                             />}
                        </AuthorizeView>
                    } />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;