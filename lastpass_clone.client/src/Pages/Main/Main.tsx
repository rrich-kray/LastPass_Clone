import { FC, useState, useEffect, Dispatch } from "react";
import Tile from "../../Components/Tile/Tile";
import styles from "./styles.module.scss";
import PasswordInfo from "../../Types/PasswordInfo";
import Password from "../../Types/Password";
import axios from "axios";
import PasswordCreationUpdateForm from "../../Components/Passwords/PasswordCreationUpdateForm/PasswordCreationUpdateForm";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { FaPlusCircle } from "react-icons/fa";
import NoteCreationUpdateForm from "../../Components/Notes/NoteCreationUpdateForm/NoteCreationUpdateForm";
import Note from "../../Types/Note";
import Address from "../../Types/Address";
import BankAccount from "../../Types/BankAccount.ts";
import PaymentCard from "../../Types/PaymentCard.ts";
import AddressCreationUpdateForm from "../../Components/Addresses/AddressCreationUpdateForm/AddressCreationUpdateForm";
import NewItemMenu from "../../Components/NewItemMenu/NewItemMenu.tsx";
import DataForm from "../../Components/DataForm/DataForm.tsx";
import BankAccountCreationUpdateForm from "../../Components/BankAccount/BankAccountCreationUpdateForm/BankAccountCreationUpdateForm.tsx";
import PaymentCardCreationUpdateForm from "../../Components/PaymentCard/PaymentCardCreationUpdateForm/PaymentCardCreationUpdateForm.tsx";
import CategorySection from "../../Components/CategorySection/CategorySection.tsx";
import TypeChecker from "../../Other/TypeChecker.ts";
import AlertModal from "../../Components/AlertModal/AlertModal.tsx";
import Category from "../../Types/Category.ts"
import AuthorizeView from "../../Components/AuthorizeView/AuthorizeView.tsx";
import RequestHelpers from "../../Other/RequestHelpers.tsx";

// fetch categories: for each category, create a CategorySection element. This will consist of all passwords, notes etc. that belong to that category
const Main: FC = (
    {
        alerts,
        isAlertModalVisible,
        setAlerts,
        setIsAlertModalVisible,
        baseUrl
    }: {
            alerts: JSX.Element[],
            isAlertModalVisible: boolean,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>,
            baseUrl: string
    }) =>
{

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [currentType, setCurrentType] = useState<string>("All Items");
    const [categorySections, setCategorySections] = useState<JSX.Element[]>([]);

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
    // Need to get all data, map the data to tiles, categorize tiles by category/folder

    // Have to be able to display "None" category
        // All items with a null CategoryId
        // Could make category ID mandatory on backend
        // Could create another category called "None"
    class AllData {
        Passwords: Password[];
        Notes: Note[];
        Addresses: Address[];
        BankAccounts: BankAccount[];
        PaymentCards: PaymentCard[];

        constructor(
            passwords: Password[],
            notes: Note[],
            addresses: Address[],
            bankAccounts: BankAccount[],
            paymentCards: PaymentCard[]
        ) {
            this.Passwords = passwords;
            this.Notes = notes;
            this.Addresses = addresses;
            this.BankAccounts = bankAccounts;
            this.PaymentCards = paymentCards;
        }
    }
    class CategorySectionComponentFactory
    {
        constructor() {}

        private CreateTiles(allData: AllData) {
            const allTiles: JSX.Element[] = [];
            allData.Passwords.map(password => (
                allTiles.push(
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

            allData.Notes.map((note: Note) => (
                allTiles.push(
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

            allData.Addresses.map((address: Address) => (
                allTiles.push(
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

            allData.BankAccounts.map((bankAccount: BankAccount) => (
                allTiles.push(
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

            allData.PaymentCards.map((paymentCard: PaymentCard) => (
                allTiles.push(
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

            return allTiles;
        }

        public CreateAllCategorySections(categories: Category[], allTiles: JSX.Element[]) {
            const categorySections: JSX.Element[] = [];
            if (categories !== undefined) {
                categories.forEach(category => {
                    if (allTiles !== undefined) {
                        let tiles = allTiles.filter(tile => tile.props.data.categoryId === category.id);
                        if (currentType !== "All Items") {
                            tiles = tiles.filter(x => x.props.type === currentType);
                        }
                        categorySections.push(
                            <CategorySection categoryName={category.name} tiles={tiles} />
                        )
                    }
                });
            }
            let noneCategoryTiles = allTiles.filter(tile => tile.props.data.categoryId === null);
            if (currentType !== "All Items") {
                noneCategoryTiles = noneCategoryTiles.filter(x => x.props.type === currentType);
            }
            categorySections.push(<CategorySection categoryName={"None"} tiles={noneCategoryTiles} />);
            return categorySections;
        }

        public async Execute(categories: Category[]) {
            const options = RequestHelpers.GenerateRequestHeaders();
            return axios.all([
                axios.get(`${baseUrl}/GetAllPasswords`, options),
                axios.get(`${baseUrl}/GetNotes`, options),
                axios.get(`${baseUrl}/GetAllAddresses`, options),
                axios.get(`${baseUrl}/GetBankAccounts`, options),   
                axios.get(`${baseUrl}/GetPaymentCards`, options)
            ])
                .then(axios.spread((passwords, notes, addresses, bankAccounts, paymentCards) => {
                    const allData = new AllData(
                        passwords.data,
                        notes.data,
                        addresses.data,
                        bankAccounts.data,
                        paymentCards.data
                    );

                    const allTiles = this.CreateTiles(allData);
                    const categorySections = this.CreateAllCategorySections(categories, allTiles);
                    setCategorySections(categorySections);
                }));
        }
    }

    // on initial render, useEffect runs after the component is rendered and commited to the DOM, and the DOM is painted, but the data is stilled stored in state
    // On subsequent renders, the content will appear because it is saved in state
    useEffect(() => {
        axios
            .get(`${baseUrl}/GetCategories`, RequestHelpers.GenerateRequestHeaders())
            .then(response => {
                const categories = response.data;
                setCategories({ ...categories, categories });
                setCurrentCategoryId(categories.id);

                new CategorySectionComponentFactory().Execute(categories);
            })
            .catch(error => {
                console.log(error);
            });
    }, [currentType]);

    return (
            <div className={styles.Main} onClick={() => {
                if (isPasswordCreationModalVisible) setIsPasswordCreationModalVisible(false);
                if (isPasswordUpdateModalVisible) setIsPasswordUpdateModalVisible(false);
                if (isPasswordVisible) setIsPasswordVIsible(false);

                if (isNoteCreationModalVisible) setIsNoteCreationModalVisible(false);
                if (isNoteUpdateModalVisible) setIsNoteUpdateModalVisible(false);
                if (isNoteVisible) setIsNoteVIsible(false);

                if (isAddressCreationModalVisible) setIsAddressCreationModalVisible(false);
                if (isAddressUpdateModalVisible) setIsAddressUpdateModalVisible(false);
                if (isAddressVisible) setIsAddressVIsible(false);

                if (isBankAccountCreationModalVisible) setIsBankAccountCreationModalVisible(false);
                if (isBankAccountUpdateModalVisible) setIsBankAccountUpdateModalVisible(false);
                if (isBankAccountVisible) setIsBankAccountVIsible(false);

                if (isPaymentCardCreationModalVisible) setIsPaymentCardCreationModalVisible(false);
                if (isPaymentCardUpdateModalVisible) setIsPaymentCardUpdateModalVisible(false);
                if (isPaymentCardVisible) setIsPaymentCardVIsible(false);
            
                if (isNewItemMenuVisible) setIsNewItemMenuVisible(false);
                }
            }>
                <FaPlusCircle size={75} className={styles.CreateNewPasswordButton} onClick={() => setIsNewItemMenuVisible(!isNewItemMenuVisible)} />

                {isAlertModalVisible && alerts && <AlertModal errors={alerts} />}

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
                {isPasswordCreationModalVisible &&
                    <PasswordCreationUpdateForm
                        baseUrl={baseUrl}
                        passwordData={passwords[0]}
                        updateToggle={false}
                        setIsPasswordCreationModalVisible={setIsPasswordCreationModalVisible}
                        setIsPasswordUpdateModalVisible={setIsPasswordUpdateModalVisible}
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible} />}
                {isPasswordUpdateModalVisible &&
                    activePassword &&
                    <PasswordCreationUpdateForm
                        baseUrl={baseUrl}
                        passwordData={activePassword}
                        updateToggle={true}
                        setIsPasswordCreationModalVisible={setIsPasswordCreationModalVisible}
                        setIsPasswordUpdateModalVisible={setIsPasswordUpdateModalVisible}
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible} />}

                {isNoteVisible && <DataForm data={activeNote!} />}
                {isNoteCreationModalVisible &&
                    <NoteCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        noteData={notes[0]}
                        updateToggle={false}
                        setIsNoteCreationModalVisible={setIsNoteCreationModalVisible}
                        setIsNoteUpdateModalVisible={setIsNoteUpdateModalVisible} />}
                {isNoteUpdateModalVisible && activeNote &&
                    <NoteCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        noteData={activeNote}
                        updateToggle={true}
                        setIsNoteCreationModalVisible={setIsNoteCreationModalVisible}
                        setIsNoteUpdateModalVisible={setIsNoteUpdateModalVisible} />}

                {isAddressVisible && <DataForm data={activeAddress!} />}
                {isAddressCreationModalVisible &&
                    <AddressCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        addressData={addresses[0]}
                        updateToggle={false}
                        setIsAddressCreationModalVisible={setIsAddressCreationModalVisible}
                        setIsAddressUpdateModalVisible={setIsAddressUpdateModalVisible} />}
                {isAddressUpdateModalVisible && activeAddress &&
                    <AddressCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        addressData={activeAddress!}
                        updateToggle={true}
                        setIsAddressCreationModalVisible={setIsAddressCreationModalVisible}
                        setIsAddressUpdateModalVisible={setIsAddressUpdateModalVisible} />}

                {isBankAccountVisible && <DataForm data={activeBankAccount!} />}
                {isBankAccountCreationModalVisible &&
                    <BankAccountCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        bankAccountData={bankAccounts[0]}
                        updateToggle={false}
                        setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible}
                        setIsBankAccountUpdateModalVisible={setIsBankAccountUpdateModalVisible} />}
                {isBankAccountUpdateModalVisible && activeBankAccount &&
                    <BankAccountCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        bankAccountData={activeBankAccount!}
                        updateToggle={true}
                        setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible}
                        setIsBankAccountUpdateModalVisible={setIsBankAccountUpdateModalVisible} />}

                {isPaymentCardVisible && <DataForm data={activePaymentCard!} />}
                {isPaymentCardCreationModalVisible &&
                    <PaymentCardCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        paymentCardData={paymentCards[0]}
                        updateToggle={false}
                        setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible}
                        setIsPaymentCardUpdateModalVisible={setIsPaymentCardUpdateModalVisible} />}
                {isPaymentCardUpdateModalVisible && activePaymentCard &&
                    <PaymentCardCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl}
                        paymentCardData={activePaymentCard!}
                        updateToggle={true}
                        setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible}
                        setIsPaymentCardUpdateModalVisible={setIsPaymentCardUpdateModalVisible} />}

                <div className={styles.SidebarWrapper}>
                    <Sidebar setCurrentType={setCurrentType} />
                </div>
                <div className={styles.GridNavbarWrapper}>
                    <Navbar />
                    <div className={styles.Grid}>
                        {categorySections}
                    </div>
                </div>
                </div>)
}

export default Main;