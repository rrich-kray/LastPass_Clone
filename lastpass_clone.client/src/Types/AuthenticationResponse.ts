import User from "./User.ts"

type AuthenticationResponse = {
    user: User,
    result: boolean,
    token: string,
    message: string
}

export default AuthenticationResponse;