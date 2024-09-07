import styles from "./styles.module.scss";

const DataForm = ({ data }: { data: object }) => {
    const formatInputFieldTitle = (input: string): string =>
        input.split(/(?=[A-Z])/).map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
    const rows: React.ReactNode[] = [];
    for (const key in data) {
        if (key != "id" && key != "categoryId") {
            rows.push(
                <div className={styles.PasswordDataModalInfo}>
                    <span>{formatInputFieldTitle(key)}</span>
                    <span>{data[key]}</span>
                </div>)
        }
    }
    return (
        <div className={styles.PasswordDataModal} onClick={(e) => e.stopPropagation()}>
            {rows}
        </div>
    )
}

export default DataForm;