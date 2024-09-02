type PaymentCard = {
    id: number,
    name: string,
    categoryId: number,
    nameOnCard: string,
    type: string,
    number: number,
    securityCode: number,
    startDate: Date,
    expirationDate: Date,
    notes: string
}

export default PaymentCard;