import styles from "./styles.module.scss";
import globalStyles from "../../Global/CreationUpdateForm.module.scss";
import TypeChecker from "../../Other/TypeChecker.ts";

const DataForm = ({ data }: { data: object }) => {
    const formatInputFieldTitle = (input: string): string =>
        input.split(/(?=[A-Z])/).map(word => word[0].toUpperCase() + word.slice(1)).join(" ");

    const getItemType = (data: object) => {
        const typeChecker = new TypeChecker();
        let itemType: string;
        if (typeChecker.IsPasswordInfo(data)) {
            itemType = "Password"
        } else if (typeChecker.IsNote(data)) {
            itemType = "Note"
        } else if (typeChecker.IsAddress(data)) {;
            itemType = "Address"
        } else if (typeChecker.IsBankAccount(data)) {
            itemType = "Bank Account"
        } else if (typeChecker.IsPaymentCard(data)) {
            itemType = "Payment Card"
        } else {
            itemType = "Password"
        }
        return itemType;
    }
    return (
        <div className={styles.DataModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.DataModalHeader}>
                {`View ${getItemType(data)} '${data.name}'`}
            </div>
            <div className={styles.DataModalTableWrapper}>
                <table className={globalStyles.CreateNewPasswordBodyRightPanelTable}>
                    <tbody>
                        {Object.keys(data).map(key => {
                            if (key != "id" && key != "categoryId" && key != "userId") {
                                return  <tr>
                                            <td className={globalStyles.TableColumnOne}>{formatInputFieldTitle(key)}</td>
                                            <td className={globalStyles.TableColumnTwo}>
                                                <span>{data[key]}</span>
                                            </td>
                                        </tr>
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataForm;