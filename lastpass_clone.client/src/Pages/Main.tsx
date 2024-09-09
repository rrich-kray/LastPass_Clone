import { FC, useState, useEffect } from "react";
import Tile from "../Components/Tile/Tile";
import styles from "./styles.module.scss";
import PasswordInfo from "../Types/PasswordInfo";
import axios from "axios";
import PasswordCreationUpdateForm from "../Components/Passwords/PasswordCreationUpdateForm/PasswordCreationUpdateForm";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import { FaPlusCircle } from "react-icons/fa";
import NoteCreationUpdateForm from "../Components/Notes/NoteCreationUpdateForm/NoteCreationUpdateForm";
import Note from "../Types/Note";
import Address from "../Types/Address";
import BankAccount from "../Types/BankAccount.ts";
import PaymentCard from "../Types/PaymentCard.ts";
import AddressCreationUpdateForm from "../Components/Addresses/AddressCreationUpdateForm/AddressCreationUpdateForm";
import NewItemMenu from "../Components/NewItemMenu/NewItemMenu.tsx";
import DataForm from "../Components/DataForm/DataForm.tsx";
import BankAccountCreationUpdateForm from "../Components/BankAccount/BankAccountCreationUpdateForm/BankAccountCreationUpdateForm.tsx";
import PaymentCardCreationUpdateForm from "../Components/PaymentCard/PaymentCardCreationUpdateForm/PaymentCardCreationUpdateForm.tsx";

// fetch categories: for each category, create a CategorySection element. This will consist of all passwords, notes etc. that belong to that category
const Main: FC = () =>
{
    const baseUrl: string = "https://localhost:7110";

    // New item menu
    const [isNewItemMenuVisible, setIsNewItemMenuVisible] = useState<boolean>(false);

    // Passwords
    const [passwords, setPasswords] = useState<PasswordInfo[]>([]);
    const [isPasswordCreationModalVisible, setIsPasswordCreationModalVisible] = useState<boolean>(false);
    const [isPasswordUpdateModalVisible, setIsPasswordUpdateModalVisible] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVIsible] = useState<boolean>(false);
    const [activePassword, setActivePassword] = useState<PasswordInfo>();

    // Notes
    const [notes, setNotes] = useState<Note[]>([]);
    const [isNoteCreationModalVisible, setIsNoteCreationModalVisible] = useState<boolean>(false);
    const [isNoteUpdateModalVisible, setIsNoteUpdateModalVisible] = useState<boolean>(false);
    const [isNoteVisible, setIsNoteVIsible] = useState<boolean>(false);
    const [activeNote, setActiveNote] = useState<Note>();

    // Address
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddressCreationModalVisible, setIsAddressCreationModalVisible] = useState<boolean>(false);
    const [isAddressUpdateModalVisible, setIsAddressUpdateModalVisible] = useState<boolean>(false);
    const [isAddressVisible, setIsAddressVIsible] = useState<boolean>(false);
    const [activeAddress, setActiveAddress] = useState<Address>();

    // Bank Account
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [isBankAccountCreationModalVisible, setIsBankAccountCreationModalVisible] = useState<boolean>(false);
    const [isBankAccountUpdateModalVisible, setIsBankAccountUpdateModalVisible] = useState<boolean>(false);
    const [isBankAccountVisible, setIsBankAccountVIsible] = useState<boolean>(false);
    const [activeBankAccount, setActiveBankAccount] = useState<BankAccount>();

    // Payment Card
    const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
    const [isPaymentCardCreationModalVisible, setIsPaymentCardCreationModalVisible] = useState<boolean>(false);
    const [isPaymentCardUpdateModalVisible, setIsPaymentCardUpdateModalVisible] = useState<boolean>(false);
    const [isPaymentCardVisible, setIsPaymentCardVIsible] = useState<boolean>(false);
    const [activePaymentCard, setActivePaymentCard] = useState<PaymentCard>();

    const fetchData = async (url: string) => await axios.get(`${baseUrl}/${url}`).catch(error => console.log(error))
    useEffect(() => {
        const getData = async () => {

            const passwords = await fetchData("GetAllPasswords");
            const notes = await fetchData("GetNotes");
            const addresses = await fetchData("GetAllAddresses");
            const bankAccounts = await fetchData("GetBankAccounts");
            const paymentCards = await fetchData("GetPaymentCards");
            setPasswords(passwords.data);
            setNotes(notes.data);
            setAddresses(addresses.data);
            setBankAccounts(bankAccounts.data);
            setPaymentCards(paymentCards.data);
        }
        getData();

    }, [])

    return (
        <div className={styles.Main} onClick={() => {
            isPasswordCreationModalVisible && setIsPasswordCreationModalVisible(false);
            isPasswordUpdateModalVisible && setIsPasswordUpdateModalVisible(false);
            isPasswordVisible && setIsPasswordVIsible(false);

            isNoteCreationModalVisible && setIsNoteCreationModalVisible(false);
            isNoteUpdateModalVisible && setIsNoteUpdateModalVisible(false);
            isNoteVisible && setIsNoteVIsible(false);

            isAddressCreationModalVisible && setIsAddressCreationModalVisible(false);
            isAddressUpdateModalVisible && setIsAddressUpdateModalVisible(false);
            isAddressVisible && setIsAddressVIsible(false);

            isBankAccountCreationModalVisible && setIsBankAccountCreationModalVisible(false);
            isBankAccountUpdateModalVisible && setIsBankAccountUpdateModalVisible(false);
            isBankAccountVisible && setIsBankAccountVIsible(false);

            isPaymentCardCreationModalVisible && setIsPaymentCardCreationModalVisible(false);
            isPaymentCardUpdateModalVisible && setIsPaymentCardUpdateModalVisible(false);
            isPaymentCardVisible && setIsPaymentCardVIsible(false);
            
            isNewItemMenuVisible && setIsNewItemMenuVisible(false);
            }
        }>
            <FaPlusCircle size={75} className={styles.CreateNewPasswordButton} onClick={() => setIsNewItemMenuVisible(!isNewItemMenuVisible)} />

            {isNewItemMenuVisible &&
                <NewItemMenu
                isPasswordCreationModalVisible={isPasswordCreationModalVisible}
                setIsPasswordCreationModalVisible={setIsPasswordCreationModalVisible}
                isNoteCreationModalVisible={isNoteCreationModalVisible}
                setIsNoteCreationModalVisible={setIsNoteCreationModalVisible}
                isAddressCreationModalVisible={isAddressCreationModalVisible}
                setIsAddressCreationModalVisible={setIsAddressCreationModalVisible}
                isBankAccountCreationModalVisible={isBankAccountCreationModalVisible}
                setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible}
                isPaymentCardCreationModalVisible={isPaymentCardCreationModalVisible}
                setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible}
                />}

            {isPasswordVisible && <DataForm data={activePassword!} />}
            {isPasswordCreationModalVisible && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={passwords[0]} updateToggle={false} />}
            {isPasswordUpdateModalVisible && activePassword && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={activePassword} updateToggle={true} />}

            {isNoteVisible && <DataForm data={activeNote!} />}
            {isNoteCreationModalVisible && <NoteCreationUpdateForm baseUrl={baseUrl} noteData={notes[0]} updateToggle={false} />}
            {isNoteUpdateModalVisible && activeNote && <NoteCreationUpdateForm baseUrl={baseUrl} noteData={activeNote} updateToggle={true} />}

            {isAddressVisible && <DataForm data={activeAddress!} />}
            {isAddressCreationModalVisible && <AddressCreationUpdateForm baseUrl={baseUrl} addressData={addresses[0]} updateToggle={false} />}
            {isAddressUpdateModalVisible && activeAddress && <AddressCreationUpdateForm baseUrl={baseUrl} addressData={activeAddress!} updateToggle={true} />}

            {isBankAccountVisible && <DataForm data={activeBankAccount!} />}
            {isBankAccountCreationModalVisible && <BankAccountCreationUpdateForm baseUrl={baseUrl} bankAccountData={bankAccounts[0]} updateToggle={false} />}
            {isBankAccountUpdateModalVisible && activeBankAccount && <BankAccountCreationUpdateForm baseUrl={baseUrl} bankAccountData={activeBankAccount!} updateToggle={true} />}

            {isPaymentCardVisible && <DataForm data={activePaymentCard!} />}
            {isPaymentCardCreationModalVisible && <PaymentCardCreationUpdateForm baseUrl={baseUrl} paymentCardData={paymentCards[0]} updateToggle={false} />}
            {isPaymentCardUpdateModalVisible && activePaymentCard && <PaymentCardCreationUpdateForm baseUrl={baseUrl} paymentCardData={activePaymentCard!} updateToggle={true} />}

            <div className={styles.SidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.GridNavbarWrapper}>
                <Navbar />
                <div className={styles.Grid}>
                    {passwords && passwords.map((password: PasswordInfo) => (
                        <Tile
                            data={password}
                            isDatumVisible={isPasswordVisible}
                            setIsDatumVisible={setIsPasswordVIsible}
                            setActiveDatum={setActivePassword}
                            isDatumUpdateModalVisible={isPasswordUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsPasswordUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                    {notes && notes.map((note: Note) => (
                        <Tile
                            data={note}
                            isDatumVisible={isNoteVisible}
                            setIsDatumVisible={setIsNoteVIsible}
                            setActiveDatum={setActiveNote}
                            isDatumUpdateModalVisible={isNoteUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsNoteUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                    {addresses && addresses.map((address: Address) => (
                        <Tile
                            data={address}
                            isDatumVisible={isAddressVisible}
                            setIsDatumVisible={setIsAddressVIsible}
                            setActiveDatum={setActiveAddress}
                            isDatumUpdateModalVisible={isAddressUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsAddressUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                    {bankAccounts && bankAccounts.map((bankAccount: BankAccount) => (
                        <Tile
                            data={bankAccount}
                            isDatumVisible={isBankAccountVisible}
                            setIsDatumVisible={setIsBankAccountVIsible}
                            setActiveDatum={setActiveBankAccount}
                            isDatumUpdateModalVisible={isBankAccountUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsBankAccountUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                    {paymentCards && paymentCards.map((paymentCard: PaymentCard) => (
                        <Tile
                            data={paymentCard}
                            isDatumVisible={isPaymentCardVisible}
                            setIsDatumVisible={setIsPaymentCardVIsible}
                            setActiveDatum={setActivePaymentCard}
                            isDatumUpdateModalVisible={isPaymentCardUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsPaymentCardUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                </div>
            </div>
        </div>)
}

export default Main;