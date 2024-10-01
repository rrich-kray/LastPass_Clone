import { Navigate } from "react-router-dom";
import { useEffect, useState, PropsWithChildren } from "react";
import AuthenticationUtilities from "../../Other/AuthenticationUtilities";

interface AccessLoginRegisterProps {
    baseUrl: string
}

const AccessLoginRegister = (props: PropsWithChildren<AccessLoginRegisterProps>) => {
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    
    useEffect(() => {
        new AuthenticationUtilities()
            .VerifyToken(5, props.baseUrl)
            .then(result => setIsTokenValid(result));
    });

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