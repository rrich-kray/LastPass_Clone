import { useState, useEffect, Dispatch } from "react";
import Tile from "../../Components/Tile/Tile";
import styles from "./styles.module.scss";
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
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import Entity from "../../Types/Entity.ts"

// fetch categories: for each category, create a CategorySection element. This will consist of all passwords, notes etc. that belong to that category
const Main = (
    {
        baseUrl,
        alerts,
        isAlertModalVisible,
        setAlerts,
        setIsAlertModalVisible,
    }: {
            baseUrl: string | undefined
            alerts: JSX.Element[],
            isAlertModalVisible: boolean,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>,
    }) =>
{
    // Tiles
    const [tiles, setTiles] = useState<JSX.Element[]>([]);

    // Categories
    const [currentType, setCurrentType] = useState<string>("All Items");
    const [categorySections, setCategorySections] = useState<JSX.Element[]>([]);

    // Collapsed
    // const [collapsed, setCollapsed] = useState<boolean>();

    // Search
    const [searchTerm, setSearchTerm] = useState<string>();

    // Sidebar
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

    // New item menu
    const [isNewItemMenuVisible, setIsNewItemMenuVisible] = useState<boolean>(false);

    // All items
    const [allData, setAllData] = useState<AllData>();

    // Sorting
    const [currentSort, setCurrentSort] = useState<string>();

    // Passwords
    // const [passwords, setPasswords] = useState<PasswordInfo[]>([]);
    const [isPasswordCreationModalVisible, setIsPasswordCreationModalVisible] = useState<boolean>(false);
    const [isPasswordUpdateModalVisible, setIsPasswordUpdateModalVisible] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVIsible] = useState<boolean>(false);
    const [activePassword, setActivePassword] = useState<Entity>();

    // Notes
    // const [notes, setNotes] = useState<Note[]>([]);
    const [isNoteCreationModalVisible, setIsNoteCreationModalVisible] = useState<boolean>(false);
    const [isNoteUpdateModalVisible, setIsNoteUpdateModalVisible] = useState<boolean>(false);
    const [isNoteVisible, setIsNoteVIsible] = useState<boolean>(false);
    const [activeNote, setActiveNote] = useState<Entity>();

    // Address
    // const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddressCreationModalVisible, setIsAddressCreationModalVisible] = useState<boolean>(false);
    const [isAddressUpdateModalVisible, setIsAddressUpdateModalVisible] = useState<boolean>(false);
    const [isAddressVisible, setIsAddressVIsible] = useState<boolean>(false);
    const [activeAddress, setActiveAddress] = useState<Entity>();

    // Bank Account
    // const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [isBankAccountCreationModalVisible, setIsBankAccountCreationModalVisible] = useState<boolean>(false);
    const [isBankAccountUpdateModalVisible, setIsBankAccountUpdateModalVisible] = useState<boolean>(false);
    const [isBankAccountVisible, setIsBankAccountVIsible] = useState<boolean>(false);
    const [activeBankAccount, setActiveBankAccount] = useState<Entity>();

    // Payment Card
    // const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
    const [isPaymentCardCreationModalVisible, setIsPaymentCardCreationModalVisible] = useState<boolean>(false);
    const [isPaymentCardUpdateModalVisible, setIsPaymentCardUpdateModalVisible] = useState<boolean>(false);
    const [isPaymentCardVisible, setIsPaymentCardVIsible] = useState<boolean>(false);
    const [activePaymentCard, setActivePaymentCard] = useState<Entity>();

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
    class TileWithType {
        tile: JSX.Element;
        type: string;

        constructor(tile: JSX.Element, type: string) {
            this.tile = tile;
            this.type = type;
        }
    }
    class CategorySectionComponentFactory
    {
        constructor() {}

        private CreateTiles(allData: AllData) {
            let allTiles: TileWithType[] = [];
            allData.Passwords.map((password: Password) => (
                allTiles.push(
                    new TileWithType(
                        <Tile
                            data={password}
                            isDatumVisible={isPasswordVisible}
                            setIsDatumVisible={setIsPasswordVIsible}
                            setActiveDatum={setActivePassword}
                            isDatumUpdateModalVisible={isPasswordUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsPasswordUpdateModalVisible}
                            baseUrl={baseUrl!}
                            setAlerts={setAlerts}
                            setIsAlertModalVisible={setIsAlertModalVisible}
                            typeIcon={<FaLock size={ 30 } className = { styles.SidebarLinkIcon } />}
                        />,
                        "Passwords"
                    )
                )))

            allData.Notes.map((note: Note) => (
                allTiles.push(
                    new TileWithType(
                        <Tile
                            data={note}
                            isDatumVisible={isNoteVisible}
                            setIsDatumVisible={setIsNoteVIsible}
                            setActiveDatum={setActiveNote}
                            isDatumUpdateModalVisible={isNoteUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsNoteUpdateModalVisible}
                            baseUrl={baseUrl!}
                            setAlerts={setAlerts}
                            setIsAlertModalVisible={setIsAlertModalVisible}
                            typeIcon={<FaNoteSticky size={30} className={styles.SidebarLinkIcon} />}
                        />,
                        "Notes"
                    )
                )))

            allData.Addresses.map((address: Address) => (
                allTiles.push(
                    new TileWithType(
                        <Tile
                            data={address}
                            isDatumVisible={isAddressVisible}
                            setIsDatumVisible={setIsAddressVIsible}
                            setActiveDatum={setActiveAddress}
                            isDatumUpdateModalVisible={isAddressUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsAddressUpdateModalVisible}
                            baseUrl={baseUrl!}
                            setAlerts={setAlerts}
                            setIsAlertModalVisible={setIsAlertModalVisible}
                            typeIcon={<FaRegAddressBook size={30} className={styles.SidebarLinkIcon} />}
                        />,
                        "Addresses"
                    )
                )))

            allData.BankAccounts.map((bankAccount: BankAccount) => (
                allTiles.push(
                    new TileWithType(
                        <Tile
                            data={bankAccount}
                            isDatumVisible={isBankAccountVisible}
                            setIsDatumVisible={setIsBankAccountVIsible}
                            setActiveDatum={setActiveBankAccount}
                            isDatumUpdateModalVisible={isBankAccountUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsBankAccountUpdateModalVisible}
                            baseUrl={baseUrl!}
                            setAlerts={setAlerts}
                            setIsAlertModalVisible={setIsAlertModalVisible}
                            typeIcon={<FaRegCreditCard size={30} className={styles.SidebarLinkIcon} />}
                        />,
                        "Bank Accounts"
                    )
                )))

            allData.PaymentCards.map((paymentCard: PaymentCard) => (
                allTiles.push(
                    new TileWithType(
                        <Tile
                            data={paymentCard}
                            isDatumVisible={isPaymentCardVisible}
                            setIsDatumVisible={setIsPaymentCardVIsible}
                            setActiveDatum={setActivePaymentCard}
                            isDatumUpdateModalVisible={isPaymentCardUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsPaymentCardUpdateModalVisible}
                            baseUrl={baseUrl!}
                            setAlerts={setAlerts}
                            setIsAlertModalVisible={setIsAlertModalVisible}
                            typeIcon={<BsBank size={30} className={styles.SidebarLinkIcon} />}
                        />,
                        "Payment Cards"
                    )
                )))

            if (currentType !== "All Items") allTiles = allTiles.filter(x => x.type === currentType);
            return allTiles.map(x => x.tile);
        }

        public CreateAllCategorySections(categories: Category[], allTiles: JSX.Element[]): JSX.Element[] {
            const categorySections: JSX.Element[] = [];
            if (categories !== undefined) {
                categories.forEach(category => {
                    if (allTiles !== undefined) {
                        let tiles = allTiles.filter(tile => tile.props.data.categoryId === category.id);
                        tiles = tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name));
                        categorySections.push(
                            <CategorySection categoryName={category.name} tiles={tiles} /* collapsed={collapsed!} */ />
                        )
                    }
                });
            }
            const noneCategoryTiles = allTiles.filter(tile => tile.props.data.categoryId === null);
            categorySections.push(<CategorySection categoryName={"None"} tiles={noneCategoryTiles} /*collapsed={collapsed!}*/ />);
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
            const categorySections = this.CreateAllCategorySections(allData.Categories, allTiles);
            setTiles(allTiles);
            setCategorySections(categorySections);
        }
    }

    // on initial render, useEffect runs after the component is rendered and commited to the DOM, and the DOM is painted, but the data is stilled stored in state
    // On subsequent renders, the content will appear because it is saved in state
    // Or could be a race condition. Component displays before async function completes data fetch
    useEffect(() => {
        async function GetAllData() {
            const options = RequestHelpers.GenerateFullRequestHeaders();
            console.log(`Options in main: ${options}`);
            const [passwords, notes, addresses, bankAccounts, paymentCards, categories] = await axios.all([
                axios.get(`${baseUrl}/GetPasswordsByUserId`, options),
                axios.get(`${baseUrl}/GetNotesByUserId`, options),
                axios.get(`${baseUrl}/GetAddressesByUserId`, options),
                axios.get(`${baseUrl}/GetBankAccountsByUserId`, options),
                axios.get(`${baseUrl}/GetPaymentCardsByUserId`, options),
                axios.get(`${baseUrl}/GetCategoriesByUserId`, options)
            ]);
            const allData = new AllData(
                passwords.data,
                notes.data,
                addresses.data,
                bankAccounts.data,
                paymentCards.data,
                categories.data
            );
            setAllData(allData);
            // new CategorySectionComponentFactory().Execute(allData);
        }
        GetAllData();
    }, [searchTerm]);

    useEffect(() => {
        if (allData) new CategorySectionComponentFactory().Execute(allData);
    }, [allData, searchTerm, currentSort, currentType]);

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
        } else {
            if (currentSort === SortingOptions.FolderAZ) return <CategoryGrid categorySections={categorySections.sort((a, b) => a.props.categoryName.localeCompare(b.props.categoryName))} />
            else if (currentSort === SortingOptions.FolderZA) return <CategoryGrid categorySections={categorySections.sort((a, b) => a.props.categoryName.localeCompare(b.props.categoryName)).reverse()} /> 
            else return <CategoryGrid categorySections={categorySections} /> 
        }
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
                        baseUrl={baseUrl!}
                        passwordData={undefined}
                        updateToggle={false}
                        setIsPasswordCreationModalVisible={setIsPasswordCreationModalVisible}
                        setIsPasswordUpdateModalVisible={setIsPasswordUpdateModalVisible}
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible} />}
                {isPasswordUpdateModalVisible &&
                    activePassword &&
                    <PasswordCreationUpdateForm
                        baseUrl={baseUrl!}
                        passwordData={activePassword!}
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
                        baseUrl={baseUrl!}
                        noteData={undefined}
                        updateToggle={false}
                        setIsNoteCreationModalVisible={setIsNoteCreationModalVisible}
                        setIsNoteUpdateModalVisible={setIsNoteUpdateModalVisible} />}
                {isNoteUpdateModalVisible && activeNote &&
                    <NoteCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        noteData={activeNote}
                        updateToggle={true}
                        setIsNoteCreationModalVisible={setIsNoteCreationModalVisible}
                        setIsNoteUpdateModalVisible={setIsNoteUpdateModalVisible} />}

                {isAddressVisible && <DataForm data={activeAddress!} />}
                {isAddressCreationModalVisible &&
                    <AddressCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        addressData={undefined}
                        updateToggle={false}
                        setIsAddressCreationModalVisible={setIsAddressCreationModalVisible}
                        setIsAddressUpdateModalVisible={setIsAddressUpdateModalVisible} />}
                {isAddressUpdateModalVisible && activeAddress &&
                    <AddressCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        addressData={activeAddress!}
                        updateToggle={true}
                        setIsAddressCreationModalVisible={setIsAddressCreationModalVisible}
                        setIsAddressUpdateModalVisible={setIsAddressUpdateModalVisible} />}

                {isBankAccountVisible && <DataForm data={activeBankAccount!} />}
                {isBankAccountCreationModalVisible &&
                    <BankAccountCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        bankAccountData={undefined}
                        updateToggle={false}
                        setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible}
                        setIsBankAccountUpdateModalVisible={setIsBankAccountUpdateModalVisible} />}
                {isBankAccountUpdateModalVisible && activeBankAccount &&
                    <BankAccountCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        bankAccountData={activeBankAccount!}
                        updateToggle={true}
                        setIsBankAccountCreationModalVisible={setIsBankAccountCreationModalVisible}
                        setIsBankAccountUpdateModalVisible={setIsBankAccountUpdateModalVisible} />}

                {isPaymentCardVisible && <DataForm data={activePaymentCard!} />}
                {isPaymentCardCreationModalVisible &&
                    <PaymentCardCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        paymentCardData={undefined}
                        updateToggle={false}
                        setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible}
                        setIsPaymentCardUpdateModalVisible={setIsPaymentCardUpdateModalVisible} />}
                {isPaymentCardUpdateModalVisible && activePaymentCard &&
                    <PaymentCardCreationUpdateForm
                        setAlerts={setAlerts}
                        setIsAlertModalVisible={setIsAlertModalVisible}
                        baseUrl={baseUrl!}
                        paymentCardData={activePaymentCard!}
                        updateToggle={true}
                        setIsPaymentCardCreationModalVisible={setIsPaymentCardCreationModalVisible}
                        setIsPaymentCardUpdateModalVisible={setIsPaymentCardUpdateModalVisible} />}

                <div className={styles.SidebarWrapper} style={{ width: isSidebarCollapsed ? "75px" : "275px", minWidth: isSidebarCollapsed ? "75px" : "275px" }}>
                    <Sidebar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} currentType={currentType} setCurrentType={setCurrentType} />
                </div>
                <div className={styles.GridNavbarWrapper}>
                    <Navbar baseUrl={baseUrl!} setSearchTerm={setSearchTerm} />
                    <SortingBar /*collapsed={collapsed!} setCollapsed={setCollapsed}*/ currentSort={currentSort} setCurrentSort={setCurrentSort} /*SortingOptions={SortingOptions}*/ currentType={currentType} />
                    {categorySections && tiles && RenderGrid()}
                </div>
                </div>)
}

export default Main;