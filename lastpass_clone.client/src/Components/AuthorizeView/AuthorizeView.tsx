import { useState, useEffect, ReactNode, createContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import axios from "axios";

interface User { email: string; }

const UserContext = createContext({});

const AuthorizeView = (props: { children: ReactNode }) => {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const emptyUser: User = { email: "" };
    const [user, setUser] = useState<User>(emptyUser);

    useEffect(() => {
        let retryCount: number = 0;
        let maxRetries: number = 10;
        let delay: number = 1000;

        function wait(delay: number) {
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        async function fetchWithRetry(url: string, options: any) {
            try {
                let response = await axios.get(url, options);

                if (response.status == 200) {
                    console.log(authorized);
                    setUser({ email: j.email });
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

        fetchWithRetry("/VerifyToken", { method: "GET" }).catch(e => console.log(e)).finally(() => setLoading(false));
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
                    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
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