import styles from "./styles.module.scss";
import globalStyles from "../../Global/CreationUpdateForm.module.scss";

const DataForm = ({ data }: { data: object }) => {
    console.log(data);
    const formatInputFieldTitle = (input: string): string =>
        input.split(/(?=[A-Z])/).map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
    const rows: React.ReactNode[] = [];
    for (const key in data) {
        if (key != "id" && key != "categoryId") {
            rows.push(
                <tr>
                    <td className={globalStyles.TableColumnOne}>{formatInputFieldTitle(key)}</td>
                    <td className={globalStyles.TableColumnTwo}>
                        <span>{data[key]}</span>
                    </td>
                </tr>)
        }
    }
    return (
        <div className={styles.DataModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.DataModalHeader}></div>
            <table className={globalStyles.CreateNewPasswordBodyRightPanelTable}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

export default DataForm;