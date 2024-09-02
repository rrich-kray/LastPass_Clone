import styles from "./styles.module.scss";

const DataForm = ({ data }: { data: object }) => {

    const rows: React.ReactNode[] = [];
    for (const key in data) {
        rows.push(
            <div className={styles.PasswordDataModalInfo}>
                <span>key</span>
                <span>{data[key]}</span>
            </div>
        )
    }
    return (
        <div className={styles.PasswordDataModal} onClick={(e) => e.stopPropagation()}>
            {rows}
        </div>
    )
}

export default DataForm;