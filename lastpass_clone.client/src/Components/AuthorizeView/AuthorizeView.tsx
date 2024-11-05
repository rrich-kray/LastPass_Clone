import { useState, useEffect, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ComponentUtilities from "../../Other/RequestHelpers";
import AuthenticationResponse from "../../Types/AuthenticationResponse.ts";
import LoadingPage from "../LoadingPage/LoadingPage.tsx";
//import LoadingOverlay from "../LoadingOverlay/LoadingOverlay.tsx";

// Component must make request to VerifyToken.
// If UserContext is empty, or response comes back with a 401 error, return
// If response is 200, setAuthorized to true
// Can take it a step further by saving token in a cookie, saving that to local storage, and extracting it in this component

// If page is refreshed or changed, UserContext is lost. Why the values appear in Register after registering, but do not appear in AuthorizeView

interface AuthorizeViewProps {
    baseUrl: string
}

const AuthorizeView = (props: PropsWithChildren<AuthorizeViewProps>) => {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchWithRetry(url: string, options: object) {
            try {
                const response = await axios.get<AuthenticationResponse>(url, options);
                if (response.data.result === true) {
                    setAuthorized(true);
                    return response;
                } else {
                    console.log("Unauthorized");
                } 
            } catch (error) {
                console.log(error);
            }
        }

        fetchWithRetry(`${props.baseUrl}/VerifyToken`, ComponentUtilities.GenerateFullRequestHeaders())
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, []);

    if (localStorage.getItem("token") === undefined || localStorage.getItem("token") === null) {
        return (
            <>
                <Navigate to="/login" />
            </>
        )
    } else if (loading) {
        return (
            <>
                <LoadingPage />
            </>
        )
    } else {
        if (authorized && !loading) {
            return (
                <>
                     {props.children}
                </>
            )
        } else {
            return (
                <>
                    <Navigate to="/login" />
                </>
            )
        }
    }
}

export default AuthorizeView;