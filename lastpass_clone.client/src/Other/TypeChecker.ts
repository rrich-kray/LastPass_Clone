import PasswordInfo from "../Types/PasswordInfo";
import Password from "../Types/Password";
import Note from "../Types/Note";
import Address from "../Types/Address";
import BankAccount from "../Types/BankAccount";
import PaymentCard from "../Types/PaymentCard";

class TypeChecker 
{
    constructor() { }

    // So if the object contains any property named "website", this will return true? bad...
    public IsPasswordInfo(obj: any): obj is PasswordInfo {
        return obj.website !== undefined;
    }

    public IsPassword(obj: any): obj is Password {
        return obj.website !== undefined;
    }

    public IsNote(obj: any): obj is Note {
        return obj.content !== undefined;
    }

    public IsAddress(obj: any): obj is Address {
        return obj.address1 !== undefined;
    }

    public IsBankAccount(obj: any): obj is BankAccount {
        return obj.bankName !== undefined;
    }

    public IsPaymentCard(obj: any): obj is PaymentCard {
        return obj.nameOnCard !== undefined;
    }

    public GetType(obj: any): string {
        if (this.IsPassword(obj)) return "Password"
        else if (this.IsNote(obj)) return "Note"
        else if (this.IsAddress(obj)) return "Address"
        else if (this.IsBankAccount(obj)) return "Bank Account"
        else if (this.IsPaymentCard(obj)) return "Payment Card"
        else return "Password"
    }

    public Compare(obj1: object, obj2: object): boolean {
        const obj1Keys: string[] = Object.keys(obj1);
        const obj2Keys: string[] = Object.keys(obj2);
        if (obj1Keys.length === obj2Keys.length) {
            let p1 = 0;
            let p2 = obj2Keys.length - 1;
            while (p1 < p2) {
                if (obj1Keys[p1] !== obj2Keys[p2]) return false;
                p1++;
                p2--;
            }
            return true;
        }
        return false;
    }
}


export default TypeChecker;