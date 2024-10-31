//import { useEffect } from "react";
import styles from "./styles.module.scss";

const LoadingOverlay = () => {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingModal}>
                <div className={styles.loadingSquare}>
                    <div className={styles.loadingCircleOne}></div>
                    <div className={styles.loadingCircleTwo}></div>
                    <div className={styles.loadingCircleThree}></div>
                    <div className={styles.loadingCircleFour}></div>
                    <div className={styles.loadingCircleFive}></div>
                    <div className={styles.loadingCircleSix}></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay;