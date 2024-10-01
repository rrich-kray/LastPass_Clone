import Entity from "./Entity.ts"

interface BankAccount extends Entity {
    categoryId: number,
    bankName: string,
    accountType: string,
    routingNumber: string,
    accountNumber: string,
    swiftCode: string,
    ibanNumber: string,
    PIN: string,
    branchAddress: string,
    branchPhone: string,
    notes: string,
    discriminator: "BankAccount"
};

export default BankAccount;