type User = {
    id: string,
    email: string,
    password: string,
    firstName: string,
    middleName: string,
    lastName: string,
    isAccountVerified: boolean,
    roles: string[]
}

export default User;