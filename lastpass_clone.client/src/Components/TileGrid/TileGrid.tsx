import styles from "./styles.module.scss";

const TileGrid = ({ tiles }: { tiles: JSX.Element[] }) => {

    return (
        <div className={styles.TileGrid}>
            {tiles && tiles}
        </div>
    )
}

export default TileGrid