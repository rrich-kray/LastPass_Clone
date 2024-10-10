interface AuthenticationFormInput {
    label: string,
    inputType: string,
    inputName: string,
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

export default AuthenticationFormInput;