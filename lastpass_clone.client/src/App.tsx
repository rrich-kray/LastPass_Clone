import Main from "./Pages/Main/Main";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx"
import { createContext, useState } from "react";
import AlertModal from "./Components/AlertModal/AlertModal.tsx";

// Auth:
// Use login and register routes provided by ASP.NET. These will both send JWT to frontend
// Login and register pages on Frontend will use JWT token to set a global state that will provide access to the main page through AuthorizeView. Will save JWT token in cookie for secutiry. All requests will extract token from cookie and include it.
    // What is backend expecting to see? Just the token in 'Bearer: '?
    // Could maybe create a custom IAuthorizationHandler and attach that to the controllers. This could include logic for verifying JWT
    // Or a middleware that checks for a valid JWT
// AuthroizeView will use a route to check if the token is valid. It will get the token from the global state mentioned above

export const UserContext = createContext({});
function App() {
    const [user, setUser] = useState<object>({
        userId: "",
        email: "",
        token: ""
    });

    // alerts
    const [alerts, setAlerts] = useState<JSX.Element[]>();
    const [isAlertModalVisible, setIsAlertModalVisible] = useState<boolean>();

    const baseUrl: string = "https://localhost:7110"; // put this in ENV file at some point

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            {isAlertModalVisible && alerts && <AlertModal errors={alerts} />}
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login baseUrl={baseUrl} setAlerts={setAlerts} setIsAlertModalVisible={setIsAlertModalVisible} />} />
                    <Route path="/register" element={<Register baseUrl={baseUrl} setAlerts={setAlerts} setIsAlertModalVisible={setIsAlertModalVisible} />} />
                    <Route path="/" element={<Main baseUrl={baseUrl} alerts={alerts} isAlertModalVisible={isAlertModalVisible} setAlerts={setAlerts} setIsAlertModalVisible={setIsAlertModalVisible} />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;