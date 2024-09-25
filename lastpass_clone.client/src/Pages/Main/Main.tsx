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
import AlertModal from "../../Components/AlertModal/AlertModal.tsx";
import Category from "../../Types/Category.ts"
import RequestHelpers from "../../Other/RequestHelpers.tsx";
import FuzzyMatchService from "../../Other/FuzzyMatchService.tsx"
import SortingBar from "../../Components/SortingBar/SortingBar.tsx";
import SortingOptions from "../../Other/SortingOptionsEnum.ts";
import TileGrid from "../../Components/TileGrid/TileGrid.tsx"
import CategoryGrid from "../../Components/CategoryGrid/CategoryGrid.tsx"

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
    // Tiles
    const [tiles, setTiles] = useState<JSX.Element[]>([]);

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategoryId, setCurrentCategoryId] = useState<number>();
    const [currentType, setCurrentType] = useState<string>("All Items");
    const [categorySections, setCategorySections] = useState<JSX.Element[]>([]);

    // Collapsed
    const [collapsed, setCollapsed] = useState<boolean>();

    // Search
    const [searchTerm, setSearchTerm] = useState<string>();

    // Sidebar
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    // New item menu
    const [isNewItemMenuVisible, setIsNewItemMenuVisible] = useState<boolean>(false);

    // All items
    const [allData, setAllData] = useState<AllData>();

    // Sorting
    const [currentSort, setCurrentSort] = useState<string>();

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
        Categories: Category[]

        constructor(
            passwords: Password[],
            notes: Note[],
            addresses: Address[],
            bankAccounts: BankAccount[],
            paymentCards: PaymentCard[],
            categories: Category[]
        ) {
            this.Passwords = passwords;
            this.Notes = notes;
            this.Addresses = addresses;
            this.BankAccounts = bankAccounts;
            this.PaymentCards = paymentCards;
            this.Categories = categories;
        }
    }
    class CategorySectionComponentFactory
    {
        constructor() {}

        private CreateTiles(allData: AllData) {
            const allTiles: JSX.Element[] = [];
            console.log(allData.Passwords)
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
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
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
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
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
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
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
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
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
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                    />
                )))

            return allTiles;
        }

        public CreateAllCategorySections(currentType: string, categories: Category[], allTiles: JSX.Element[]): JSX.Element[] {
            let categorySections: JSX.Element[] = [];
            if (categories !== undefined) {
                categories.forEach(category => {
                    if (allTiles !== undefined) {
                        let tiles = allTiles.filter(tile => tile.props.data.categoryId === category.id);
                        if (currentType !== "All Items") tiles = tiles.filter(x => x.props.type === currentType);
                        tiles = tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name));
                        categorySections.push(
                            <CategorySection categoryName={category.name} tiles={tiles} collapsed={collapsed} />
                        )
                    }
                });
            }
            let noneCategoryTiles = allTiles.filter(tile => tile.props.data.categoryId === null);
            if (currentType !== "All Items") {
                noneCategoryTiles = noneCategoryTiles.filter(x => x.props.type === currentType);
            }
            categorySections.push(<CategorySection categoryName={"None"} tiles={noneCategoryTiles} collapsed={collapsed} />);
            if (currentSort === SortingOptions.FolderAZ) categorySections = categorySections.sort((a, b) => a.props.categoryName.localeCompare(b.props.categoryName));
            if (currentSort === SortingOptions.FolderZA) categorySections = categorySections.sort((a, b) => a.props.categoryName.localeCompare(b.props.categoryName)).reverse();
            return categorySections;
        }

        public FilterAllData(allData: AllData): AllData
        {
            return new AllData(
                FuzzyMatchService.SimpleMatchingAlgorithm<Password>(allData.Passwords, searchTerm),
                FuzzyMatchService.SimpleMatchingAlgorithm<Note>(allData.Notes, searchTerm),
                FuzzyMatchService.SimpleMatchingAlgorithm<Address>(allData.Addresses, searchTerm),
                FuzzyMatchService.SimpleMatchingAlgorithm<BankAccount>(allData.BankAccounts, searchTerm),
                FuzzyMatchService.SimpleMatchingAlgorithm<PaymentCard>(allData.PaymentCards, searchTerm),
                allData.Categories
            )
        }

        public Execute(allData: AllData): void
        {
            allData = this.FilterAllData(allData);
            const allTiles = this.CreateTiles(allData);
            const categorySections = this.CreateAllCategorySections(currentType, allData.Categories, allTiles);
            console.log(categorySections[0].props)
            setTiles(allTiles);
            setCategorySections(categorySections);
        }
    }

    // on initial render, useEffect runs after the component is rendered and commited to the DOM, and the DOM is painted, but the data is stilled stored in state
    // On subsequent renders, the content will appear because it is saved in state
    // Or could be a race condition. Component displays before async function completes data fetch
    useEffect(() => {
        async function GetAllData() {
            const options = RequestHelpers.GenerateRequestHeaders();
            const [passwords, notes, addresses, bankAccounts, paymentCards, categories] = await axios.all([
                axios.get(`${baseUrl}/GetPasswordsByUserId`, options),
                axios.get(`${baseUrl}/GetNotesByUserId`, options),
                axios.get(`${baseUrl}/GetAddressesByUserId`, options),
                axios.get(`${baseUrl}/GetBankAccountsByUserId`, options),
                axios.get(`${baseUrl}/GetPaymentCardsByUserId`, options),
                axios.get(`${baseUrl}/GetCategoriesByUserId`, options)
            ]);
            console.log(categories);
            console.log(passwords.data);
            const allData = new AllData(
                passwords.data,
                notes.data,
                addresses.data,
                bankAccounts.data,
                paymentCards.data,
                categories.data
            );
            setAllData(allData);
            setCategories(categories.data);
            // new CategorySectionComponentFactory().Execute(allData);
        }
        GetAllData();
    }, [currentType, searchTerm]);

    useEffect(() => {
        if (allData) new CategorySectionComponentFactory().Execute(allData);
    }, [allData, searchTerm, collapsed, currentSort]);

    const isModalVisible = () => {
        return (
            isPasswordCreationModalVisible ||
            isPasswordUpdateModalVisible ||
            isPasswordVisible ||
            isNoteCreationModalVisible ||
            isNoteUpdateModalVisible ||
            isNoteVisible ||
            isAddressCreationModalVisible ||
            isAddressUpdateModalVisible ||
            isAddressVisible ||
            isBankAccountCreationModalVisible ||
            isBankAccountUpdateModalVisible ||
            isBankAccountVisible ||
            isPaymentCardCreationModalVisible ||
            isPaymentCardUpdateModalVisible ||
            isPaymentCardVisible ||
            isNewItemMenuVisible
        )
    }

    const RenderGrid = () => {
        if (currentSort === SortingOptions.NameAZ) {
            return <TileGrid tiles={tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name))} />
        } else if (currentSort === SortingOptions.NameZA) {
            return <TileGrid tiles={tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name)).reverse()} />
        } else return <CategoryGrid categorySections={categorySections} collapsed={collapsed} />
    }

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

                {isModalVisible() && <div className={styles.Overlay}></div>}

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

                <div className={styles.SidebarWrapper} style={{ width: isCollapsed ? "75px" : "275px", minWidth: isCollapsed ? "75px" : "275px" }}>
                    <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} currentType={currentType} setCurrentType={setCurrentType} />
                </div>
                <div className={styles.GridNavbarWrapper}>
                    <Navbar baseUrl={baseUrl} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <SortingBar collapsed={collapsed} setCollapsed={setCollapsed} currentSort={currentSort} setCurrentSort={setCurrentSort} SortingOptions={SortingOptions} currentType={currentType} />
                    {RenderGrid()}
                </div>
                </div>)
}

export default Main;