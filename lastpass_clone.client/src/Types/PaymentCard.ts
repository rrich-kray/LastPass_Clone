import Entity from "./Entity.ts"
interface PaymentCard extends Entity {
    categoryId: number,
    nameOnCard: string,
    type: string,
    number: string,
    securityCode: string,
    startDate: string,
    expirationDate: string,
    notes: string,
    discriminator: "PaymentCard"
}

export default PaymentCard;