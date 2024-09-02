import PasswordInfo from "../Types/PasswordInfo";
import Note from "../Types/Note";
import Address from "../Types/Address";
import BankAccount from "../Types/BankAccount";
import PaymentCard from "../Types/PaymentCard";

class TypeChecker 
{
    constructor() { }

    IsPasswordInfo(obj: any): obj is PasswordInfo {
        return obj.website !== undefined;
    }

    IsNote(obj: any): obj is Note {
        return obj.content !== undefined;
    }

    IsAddress(obj: any): obj is Address {
        return obj.addressName !== undefined;
    }

    IsBankAccount(obj: any): obj is BankAccount {
        return obj.bankName !== undefined;
    }

    IsPaymentCard(obj: any): obj is PaymentCard {
        return obj.nameOnCard !== undefined;
    }
}


export default TypeChecker;