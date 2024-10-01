import { useState } from "react";
import styles from "./styles.module.scss";
import { RxTriangleDown } from "react-icons/rx";
import { RxTriangleLeft } from "react-icons/rx";

const CategorySection = (
    {
        categoryName,
        tiles,
        // collapsed
    }: {
            categoryName: string,
            tiles: JSX.Element[],
            // collapsed: boolean
    }) => {
    // const [isCategorySectionCollapsed, setIsCategorySectionCollapsed] = useState<boolean>(collapsed);
    const [isCategorySectionCollapsed, setIsCategorySectionCollapsed] = useState<boolean>(false);
    return (
        <div className={styles.CategorySection}>
            <div className={styles.CategorySectionHeader}>
                <span>{categoryName} {`(${tiles.length})`}</span>
                {!isCategorySectionCollapsed ? <RxTriangleDown onClick={() => setIsCategorySectionCollapsed(true)} style={{ marginLeft: "5px" }} size={25} /> : <RxTriangleLeft onClick={() => setIsCategorySectionCollapsed(false)} style={{ marginLeft: "5px" }} size={25} />}
            </div>
            <div className={styles.CategorySectionGrid} style={{ display: isCategorySectionCollapsed  ? "none" : "grid"}}>
                {tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name))}
            </div>
        </div>
    )
}

export default CategorySection;