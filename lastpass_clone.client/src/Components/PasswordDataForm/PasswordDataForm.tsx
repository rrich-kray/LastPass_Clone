import styles from "./styles.module.scss"

const PasswordDataModal = ({ passwordInfo }) => {
    return (
        <div className={styles.PasswordDataModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.PasswordDataModalInfo}>
                <span>Website</span>
                <span>{passwordInfo.website}</span>
            </div>
            <div className={styles.PasswordDataModalInfo}>
                <span>Username</span>
                <span>{passwordInfo.username}</span>
            </div>
            <div className={styles.PasswordDataModalInfo}>
                <span>Password</span>
                <span>{passwordInfo.password}</span>
            </div>
            <div className={styles.PasswordDataModalInfo}>
                <span>Notes</span>
                <span>{passwordInfo.notes}</span>
            </div>
        </div>
    )
}

export default PasswordDataModal;