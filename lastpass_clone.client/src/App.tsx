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

// Auth:
// Use login and register routes provided by ASP.NET. These will both send JWT to frontend
// Login and register pages on Frontend will use JWT token to set a global state that will provide access to the main page through AuthorizeView. Will save JWT token in cookie for secutiry. All requests will extract token from cookie and include it.
    // What is backend expecting to see? Just the token in 'Bearer: '?
    // Could maybe create a custom IAuthorizationHandler and attach that to the controllers. This could include logic for verifying JWT
    // Or a middleware that checks for a valid JWT
// AuthroizeView will use a route to check if the token is valid. It will get the token from the global state mentioned above

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
                console.log(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    const baseUrl: string = "https://localhost:7110"; // put this in ENV file at some point

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
                            <Main
                                baseUrl={baseUrl}
                                alerts={alerts}
                                isAlertModalVisible={isAlertModalVisible}
                                setAlerts={setAlerts}
                                setIsAlertModalVisible={setIsAlertModalVisible} />
                        </AuthorizeView>
                    } />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;