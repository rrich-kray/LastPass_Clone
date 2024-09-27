import Main from "./Pages/Main/Main";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx"
import { createContext, useState, useEffect } from "react";
import AlertModal from "./Components/AlertModal/AlertModal.tsx";
import AuthorizeView from "./Components/AuthorizeView/AuthorizeView.tsx";
import AccessLoginRegister from "./Components/AccessLoginRegister/AccessLoginRegister.tsx";
import axios from "axios";
import RequestHelpers from "./Other/RequestHelpers";

export const UserContext = createContext({});
function App() {

    // alerts
    const [alerts, setAlerts] = useState<JSX.Element[]>();
    const [isAlertModalVisible, setIsAlertModalVisible] = useState<boolean>();
    const [user, setUser] = useState({});

    useEffect(() => {
        axios
            .get(`${baseUrl}/GetUserData`, RequestHelpers.GenerateRequestHeaders())
            .then(response => {
                setUser(response.data)
            })
            .catch(error => console.log(error));
    }, []);

    const baseUrl: string = "https://localhost:32777"; // put this in ENV file at some point

    return (
        <UserContext.Provider value={{ user, setUser }}>
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
                    <Route path="/" element={
                        <AuthorizeView baseUrl={baseUrl}>
                            {user !== null && user !== undefined && <Main
                                baseUrl={baseUrl}
                                alerts={alerts!}
                                isAlertModalVisible={isAlertModalVisible!}
                                setAlerts={setAlerts}
                                setIsAlertModalVisible={setIsAlertModalVisible} />}
                        </AuthorizeView>
                    } />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;