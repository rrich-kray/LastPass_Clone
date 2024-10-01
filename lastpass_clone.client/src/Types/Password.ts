import Entity from "./Entity.ts"

interface Password extends Entity {
    [key: string]: string | number,
    website: string;
    username: string;
    password: string;
    notes: string;
    categoryId: number;
    discriminator: "Password"
}

export default Password;