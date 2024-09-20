import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthenticationUtilities from "../../Other/AuthenticationUtilities";

const AccessLoginRegister = ({ baseUrl, ...props }) => {
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    
    useEffect(() => {
        new AuthenticationUtilities()
            .VerifyToken(5, baseUrl)
            .then(result => setIsTokenValid(result));
    });
    console.log(isTokenValid);

    if (!isTokenValid) {
        return (
            <>
                {props.children}
            </>
        )
    } else {
        return (
            <>
                <Navigate to="/" />
            </>
        )
    }
}

export default AccessLoginRegister;