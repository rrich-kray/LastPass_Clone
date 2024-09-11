type BankAccount = {
    id: number,
    name: string,
    categoryId: number,
    bankName: string,
    accountType: string,
    routingNumber: number,
    accountNumber: number,
    swiftCode: number,
    ibanNumber: string,
    PIN: number,
    branchAddress: string,
    branchPhone: number,
    notes: string
};

export default BankAccount;