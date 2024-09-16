import styles from "./styles.module.scss";

const AlertMessage = ({ message, color }: {message: string, color: string}) => {
    return (
        <div className={styles.ErrorMessage} style={{ backgroundColor: color }}>
            <span>{message}</span>
        </div>
    )
}

export default AlertMessage;