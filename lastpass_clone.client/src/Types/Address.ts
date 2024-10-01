import Entity from "./Entity.ts"

interface Address extends Entity {
    categoryId: number,
    title: string,
    firstName: string,
    middleName: string,
    lastName: string,
    userName: string,
    gender: string,
    birthday: string,
    company: string,
    address1: string,
    address2: string,
    address3: string,
    city: string,
    county: string,
    state: string,
    zipCode: string,
    country: string,
    emailAddress: string,
    phoneNumber: string,
    eveningPhone: string,
    mobilePhone: string, 
    fax: string,
    notes: string
    discriminator: "Address"
}

export default Address;