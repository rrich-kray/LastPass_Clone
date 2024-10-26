import { Navigate } from "react-router-dom";
import { useEffect, useState, PropsWithChildren, /*useContext*/ } from "react";
import AuthenticationUtilities from "../../Other/AuthenticationUtilities";
//import { UserContext } from "../../App";
//import AuthenticationForm from "../AuthenticationForm/AuthenticationForm";
//import ConfirmAccount from "../../Pages/ConfirmAccount/ConfirmAccount";

interface AccessLoginRegisterProps {
    baseUrl: string
}

const AccessLoginRegister = (props: PropsWithChildren<AccessLoginRegisterProps>) => {
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    // const { 0: user } = useContext(UserContext);
    
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