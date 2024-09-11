import styles from "./styles.module.scss";
import globalStyles from "../../Global/CreationUpdateForm.module.scss";

const DataForm = ({ data }: { data: object }) => {
    const formatInputFieldTitle = (input: string): string =>
        input.split(/(?=[A-Z])/).map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
    return (
        <div className={styles.DataModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.DataModalHeader} />
            <div className={styles.DataModalTableWrapper}>
                <table className={globalStyles.CreateNewPasswordBodyRightPanelTable}>
                    <tbody>
                        {Object.keys(data).map(key => {
                            if (key != "id" && key != "categoryId") {
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