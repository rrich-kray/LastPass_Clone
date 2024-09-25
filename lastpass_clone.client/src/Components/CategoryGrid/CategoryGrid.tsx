import styles from "./styles.module.scss";

const CategoryGrid = ({ categorySections }: { categorySections: JSX.Element[]}) => {

    return (
        <div className={styles.Grid}>
            {categorySections}
        </div>
    )
}

export default CategoryGrid