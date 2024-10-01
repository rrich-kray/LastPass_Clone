import styles from "./styles.module.scss"
import { useState, useEffect } from "react";

const LoadingPage = () => {
    const [loadingText, setLoadingText] = useState<string>("Loading");

    useEffect(() => {
        setInterval(() => {
            if ((loadingText.match(/./g) || []).length < 3) {
                const newLoadingText = loadingText + ".";
                setLoadingText(newLoadingText);
            } else {
                setLoadingText(loadingText.replace(".", ""));
            }
        }, 500)
    });

    return (
        <div className={styles.LoadingPage}>
            <p>{loadingText}</p>
        </div>
    )
}

export default LoadingPage;