//import { useEffect } from "react";
import styles from "./styles.module.scss";

const LoadingOverlay = () => {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingModal}>
                <div className={styles.loadingSquareOne}>
                    <div className={styles.loadingCircle}></div>
                </div>
                <div className={styles.loadingSquareTwo}>
                    <div className={styles.loadingCircle}></div>
                </div>
                <div className={styles.loadingSquareThree}>
                    <div className={styles.loadingCircle}></div>
                </div>
                <div className={styles.loadingSquareFour}>
                    <div className={styles.loadingCircle}></div>
                </div>
                <div className={styles.loadingSquareFive}>
                    <div className={styles.loadingCircle}></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay;