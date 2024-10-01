import Entity from "./Entity.ts"

interface Note extends Entity {
    content: string;
    categoryId: number;
    discriminator: "Note"
}

export default Note