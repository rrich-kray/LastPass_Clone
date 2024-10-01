import Entity from "./Entity.ts"

interface PasswordInfo extends Entity {
    name: string;
    website: string;
    username: string;
    password: string;
    notes: string;
    categoryId: number
}

export default PasswordInfo