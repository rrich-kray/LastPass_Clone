import { useState, useEffect, ReactNode, createContext, useContext, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import axios from "axios";

// Component must make request to VerifyToken.
// If UserContext is empty, or response comes back with a 401 error, return
// If response is 200, setAuthorized to true
// Can take it a step further by saving token in a cookie, saving that to local storage, and extracting it in this component

// If page is refreshed or changed, UserContext is lost. Why the values appear in Register after registering, but do not appear in AuthorizeView

const AuthorizeView = ({ baseUrl, ...props }) => {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let retryCount: number = 0;
        let maxRetries: number = 10;
        let delay: number = 1000;

        function wait(delay: number) {
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        async function fetchWithRetry(url: string, options: object) {
            try {

                const response = await axios.get(url, options);
                if (response.data.result === true) {
                    console.log(authorized);
                    setAuthorized(true);
                    return response;
                } else if (response.status === 401) {
                    console.log("Unauthorized");
                } else {
                    throw new Error("" + response.text);
                }
            } catch (error) {
                retryCount++;
                if (retryCount > maxRetries) {
                    throw error;
                } else {
                    await wait(delay);
                    return fetchWithRetry(url, options);
                }
            }
        }

        const options = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }

        fetchWithRetry(`${baseUrl}/VerifyToken`, options)
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <>
                <p>Loading...</p>
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