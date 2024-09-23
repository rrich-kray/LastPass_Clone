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
class CategorySectionComponentFactory {
    constructor() { }

    private CreateTiles(allData: AllData) {
        const allTiles: JSX.Element[] = [];
        allData.Passwords.map(password => (
            allTiles.push(
                <Tile
                        data={ password }
                        isDatumVisible = { isPasswordVisible }
                        setIsDatumVisible = { setIsPasswordVIsible }
                        setActiveDatum = { setActivePassword }
                        isDatumUpdateModalVisible = { isPasswordUpdateModalVisible }
                        setIsDatumUpdateModalVisible = { setIsPasswordUpdateModalVisible }
                        baseUrl = { baseUrl }
                        type = "Passwords"
                        setAlerts = { setAlerts }
                        setIsAlertModalVisible = { setIsAlertModalVisible }
                />
                )))

        allData.Notes.map((note: Note) => (
            allTiles.push(
                <Tile
                        data={ note }
                        isDatumVisible = { isNoteVisible }
                        setIsDatumVisible = { setIsNoteVIsible }
                        setActiveDatum = { setActiveNote }
                        isDatumUpdateModalVisible = { isNoteUpdateModalVisible }
                        setIsDatumUpdateModalVisible = { setIsNoteUpdateModalVisible }
                        baseUrl = { baseUrl }
                        type = "Notes"
                        setAlerts = { setAlerts }
                        setIsAlertModalVisible = { setIsAlertModalVisible }
                />
                )))

        allData.Addresses.map((address: Address) => (
            allTiles.push(
                <Tile
                        data={ address }
                        isDatumVisible = { isAddressVisible }
                        setIsDatumVisible = { setIsAddressVIsible }
                        setActiveDatum = { setActiveAddress }
                        isDatumUpdateModalVisible = { isAddressUpdateModalVisible }
                        setIsDatumUpdateModalVisible = { setIsAddressUpdateModalVisible }
                        baseUrl = { baseUrl }
                        type = "Addresses"
                        setAlerts = { setAlerts }
                        setIsAlertModalVisible = { setIsAlertModalVisible }
                />
                )))

        allData.BankAccounts.map((bankAccount: BankAccount) => (
            allTiles.push(
                <Tile
                        data={ bankAccount }
                        isDatumVisible = { isBankAccountVisible }
                        setIsDatumVisible = { setIsBankAccountVIsible }
                        setActiveDatum = { setActiveBankAccount }
                        isDatumUpdateModalVisible = { isBankAccountUpdateModalVisible }
                        setIsDatumUpdateModalVisible = { setIsBankAccountUpdateModalVisible }
                        baseUrl = { baseUrl }
                        type = "Bank Accounts"
                        setAlerts = { setAlerts }
                        setIsAlertModalVisible = { setIsAlertModalVisible }
                />
                )))

        allData.PaymentCards.map((paymentCard: PaymentCard) => (
            allTiles.push(
                <Tile
                        data={ paymentCard }
                        isDatumVisible = { isPaymentCardVisible }
                        setIsDatumVisible = { setIsPaymentCardVIsible }
                        setActiveDatum = { setActivePaymentCard }
                        isDatumUpdateModalVisible = { isPaymentCardUpdateModalVisible }
                        setIsDatumUpdateModalVisible = { setIsPaymentCardUpdateModalVisible }
                        baseUrl = { baseUrl }
                        type = "Payment Cards"
                        setAlerts = { setAlerts }
                        setIsAlertModalVisible = { setIsAlertModalVisible }
                />
                )))

        return allTiles;
    }

    public CreateAllCategorySections(currentType: string, categories: Category[], allTiles: JSX.Element[]) {
        const categorySections: JSX.Element[] = [];
        if (categories !== undefined) {
            categories.forEach(category => {
                if (allTiles !== undefined) {
                    let tiles = allTiles.filter(tile => tile.props.data.categoryId === category.id);
                    if (currentType !== "All Items") {
                        tiles = tiles.filter(x => x.props.type === currentType);
                    }
                    categorySections.push(
                        <CategorySection categoryName={ category.name } tiles = { tiles } />
                        )
                }
            });
        }
        let noneCategoryTiles = allTiles.filter(tile => tile.props.data.categoryId === null);
        if (currentType !== "All Items") {
            noneCategoryTiles = noneCategoryTiles.filter(x => x.props.type === currentType);
        }
        categorySections.push(<CategorySection categoryName={ "None"} tiles = { noneCategoryTiles } />);
        return categorySections;
    }

    public async Execute(allData: AllData) {
        const allTiles = this.CreateTiles(allData);
        const categorySections = this.CreateAllCategorySections(currentType, allData.Categories, allTiles);
        setCategorySections(categorySections);
    }
}