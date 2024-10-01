import styles from "./styles.module.scss";

const AlertModal = ({ errors }: {errors: JSX.Element[]}) => {
    return (
        <div className={styles.ErrorModal}>
            {errors}
        </div>
    )
}

export default AlertModal;