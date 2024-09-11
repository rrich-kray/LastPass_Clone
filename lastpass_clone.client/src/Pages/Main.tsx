import { FC, useState, useEffect } from "react";
import Tile from "../Components/Tile/Tile";
import styles from "./styles.module.scss";
import PasswordInfo from "../Types/PasswordInfo";
import Password from "../Types/Password";
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
import CategorySection from "../Components/CategorySection/CategorySection.tsx";
import TypeChecker from "../Other/TypeChecker.ts";

// fetch categories: for each category, create a CategorySection element. This will consist of all passwords, notes etc. that belong to that category
const Main: FC = () =>
{
    const baseUrl: string = "https://localhost:7110"; // put this in ENV file at some point

    // Categories
    const [categories, setCategories] = useState<Category[]>();
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [currentType, setCurrentType] = useState<string>("All Items");

    // New item menu
    const [isNewItemMenuVisible, setIsNewItemMenuVisible] = useState<boolean>(false);

    // All items
    const [allItems, setAllItems] = useState<JSX.Element[]>();

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

    // Could create endpoint on backend that gets all items belonging to a particular category. Would simplify the frontend a good deal
    // Currently, gets all items, sets states on the component for all items, creates tiles for all items, and groups them by category
    const getData = () => {
        axios
            .get(`${baseUrl}/GetCategories`)
            .then(response => {
                const data = response.data;
                setCategories(data);
                setCurrentCategoryId(data.id);
            })
            .catch(error => {
                console.log(error);
            })

        axios
            .get(`${baseUrl}/GetAllPasswords`)
            .then(r => setPasswords(r.data))
            .catch(e => console.log(e));

        axios
            .get(`${baseUrl}/GetNotes`)
            .then(r => setNotes(r.data))
            .catch(e => console.log(e));

        axios
            .get(`${baseUrl}/GetAllAddresses`)
            .then(r => setAddresses(r.data))
            .catch(e => console.log(e));

        axios
            .get(`${baseUrl}/GetBankAccounts`)
            .then(r => setBankAccounts(r.data))
            .catch(e => console.log(e));

        axios
            .get(`${baseUrl}/GetPaymentCards`)
            .then(r => setPaymentCards(r.data))
            .catch(e => console.log(e));
    }

    const createTiles = () => {
        const allItemsArr: JSX.Element[] = [];
        passwords.map(password => (
            allItemsArr.push(
                <Tile
                    data={password}
                    isDatumVisible={isPasswordVisible}
                    setIsDatumVisible={setIsPasswordVIsible}
                    setActiveDatum={setActivePassword}
                    isDatumUpdateModalVisible={isPasswordUpdateModalVisible}
                    setIsDatumUpdateModalVisible={setIsPasswordUpdateModalVisible}
                    baseUrl={baseUrl}
                    type="Passwords"
                />
            )))

        notes.map((note: Note) => (
            allItemsArr.push(
                <Tile
                    data={note}
                    isDatumVisible={isNoteVisible}
                    setIsDatumVisible={setIsNoteVIsible}
                    setActiveDatum={setActiveNote}
                    isDatumUpdateModalVisible={isNoteUpdateModalVisible}
                    setIsDatumUpdateModalVisible={setIsNoteUpdateModalVisible}
                    baseUrl={baseUrl}
                    type="Notes"
                />
            )))

        addresses.map((address: Address) => (
            allItemsArr.push(
                <Tile
                    data={address}
                    isDatumVisible={isAddressVisible}
                    setIsDatumVisible={setIsAddressVIsible}
                    setActiveDatum={setActiveAddress}
                    isDatumUpdateModalVisible={isAddressUpdateModalVisible}
                    setIsDatumUpdateModalVisible={setIsAddressUpdateModalVisible}
                    baseUrl={baseUrl}
                    type="Addresses"
                />
            )))

        bankAccounts.map((bankAccount: BankAccount) => (
            allItemsArr.push(
                <Tile
                    data={bankAccount}
                    isDatumVisible={isBankAccountVisible}
                    setIsDatumVisible={setIsBankAccountVIsible}
                    setActiveDatum={setActiveBankAccount}
                    isDatumUpdateModalVisible={isBankAccountUpdateModalVisible}
                    setIsDatumUpdateModalVisible={setIsBankAccountUpdateModalVisible}
                    baseUrl={baseUrl}
                    type="Bank Accounts"
                />
            )))

        paymentCards.map((paymentCard: PaymentCard) => (
            allItemsArr.push(
                <Tile
                    data={paymentCard}
                    isDatumVisible={isPaymentCardVisible}
                    setIsDatumVisible={setIsPaymentCardVIsible}
                    setActiveDatum={setActivePaymentCard}
                    isDatumUpdateModalVisible={isPaymentCardUpdateModalVisible}
                    setIsDatumUpdateModalVisible={setIsPaymentCardUpdateModalVisible}
                    baseUrl={baseUrl}
                    type="Payment Cards"
                />
            )))

        setAllItems(allItemsArr);
    }

    const createAllCategorySections = () => {
        const categorySections: JSX.Element[] = [];
        if (categories !== undefined) {
            categories.forEach(category => {
                if (allItems !== undefined) {
                    let tiles = allItems.filter(element => element.props.data.categoryId === category.id);
                    if (currentType !== "All Items") {
                        tiles = tiles.filter(x => x.props.type === currentType);
                    }
                    categorySections.push(
                        <CategorySection category={category} tiles={tiles} />
                    )
                }
            });
        }
        return categorySections;
    }

    useEffect(() => {
        getData();
        createTiles();
    }, [])

    console.log(allItems);

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
            {isPasswordCreationModalVisible && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={passwords[0]} updateToggle={false} setIsPasswordCreationModalVisible={setIsPasswordCreationModalVisible} setIsPasswordUpdateModalVisible={setIsPasswordUpdateModalVisible} />}
            {isPasswordUpdateModalVisible && activePassword && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={activePassword} updateToggle={true} setIsPasswordCreationModalVisible={setIsPasswordCreationModalVisible} setIsPasswordUpdateModalVisible={setIsPasswordUpdateModalVisible} />}

            {isNoteVisible && <DataForm data={activeNote!} />}
            {isNoteCreationModalVisible && <NoteCreationUpdateForm baseUrl={baseUrl} noteData={notes[0]} updateToggle={false} setIsNoteCreationModalVisible={setIsNoteCreationModalVisible} setIsNoteUpdateModalVisible={setIsNoteUpdateModalVisible} />}
            {isNoteUpdateModalVisible && activeNote && <NoteCreationUpdateForm baseUrl={baseUrl} noteData={activeNote} updateToggle={true} setIsNoteCreationModalVisible={setIsNoteCreationModalVisible} setIsNoteUpdateModalVisible={setIsNoteUpdateModalVisible} />}

            {isAddressVisible && <DataForm data={activeAddress!} />}
            {isAddressCreationModalVisible && <AddressCreationUpdateForm baseUrl={baseUrl} addressData={addresses[0]} updateToggle={false} setIsAddressCreationModalVisible={setIsAddressCreationModalVisible} setIsAddressUpdateModalVisible={setIsAddressUpdateModalVisible} />}
            {isAddressUpdateModalVisible && activeAddress && <AddressCreationUpdateForm baseUrl={baseUrl} addressData={activeAddress!} updateToggle={true} setIsAddressCreationModalVisible={setIsAddressCreationModalVisible} setIsAddressUpdateModalVisible={setIsAddressUpdateModalVisible} />}

            {isBankAccountVisible && <DataForm data={activeBankAccount!} />}
            {isBankAccountCreationModalVisible && <BankAccountCreationUpdateForm baseUrl={baseUrl} bankAccountData={bankAccounts[0]} updateToggle={false} setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible} setIsBankAccountUpdateModalVisible={setIsBankAccountUpdateModalVisible} />}
            {isBankAccountUpdateModalVisible && activeBankAccount && <BankAccountCreationUpdateForm baseUrl={baseUrl} bankAccountData={activeBankAccount!} updateToggle={true} setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible} setIsBankAccountUpdateModalVisible={setIsBankAccountUpdateModalVisible} />}

            {isPaymentCardVisible && <DataForm data={activePaymentCard!} />}
            {isPaymentCardCreationModalVisible && <PaymentCardCreationUpdateForm baseUrl={baseUrl} paymentCardData={paymentCards[0]} updateToggle={false} setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible} setIsPaymentCardUpdateModalVisible={setIsPaymentCardUpdateModalVisible} />}
            {isPaymentCardUpdateModalVisible && activePaymentCard && <PaymentCardCreationUpdateForm baseUrl={baseUrl} paymentCardData={activePaymentCard!} updateToggle={true} setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible} setIsPaymentCardUpdateModalVisible={setIsPaymentCardUpdateModalVisible} />}

            <div className={styles.SidebarWrapper}>
                <Sidebar setCurrentType={setCurrentType} />
            </div>
            <div className={styles.GridNavbarWrapper}>
                <Navbar />
                <div className={styles.Grid}>
                    {createAllCategorySections()}
                </div>
            </div>
        </div>)
}

export default Main;