import { useState, useEffect } from "react";
import AuthenticationForm from "../../Components/AuthenticationForm/AuthenticationForm.tsx";

const ConfirmAccount = () => {
    return (
        <AuthenticationForm
            headerLeftText={"Verify account"}
            headerRightText={"Or send another confirmation code"}
            headerRightTextLink={"/SendConfirmationCode"}
            buttonText={"Log in!"}
            resetPassword={true} />
    )
}

export default AuthenticationForm;