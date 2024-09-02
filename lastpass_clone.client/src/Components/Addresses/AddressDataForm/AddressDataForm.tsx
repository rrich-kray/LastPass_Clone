import styles from "./styles.module.scss";
import Address from "../../../Types/Address.ts"

const AddressDataForm = ({ address }: { address: Address }) => {

    const rows: React.ReactNode[] = [];
    for (const key in address) {
        rows.push(
            <div className={styles.PasswordDataModalInfo}>
                <span>key</span>
                <span>{address[key]}</span>
            </div>
        )
    }
    return (
        <div className={styles.PasswordDataModal} onClick={(e) => e.stopPropagation()}>
            {rows}
        </div>
    )
}

export default AddressDataForm;