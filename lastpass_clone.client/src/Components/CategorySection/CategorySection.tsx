import React, { useEffect, useState } from "react";
import Category from "../../Types/Category";
import styles from "./styles.module.scss";
import { RxTriangleDown } from "react-icons/rx";
import { RxTriangleLeft } from "react-icons/rx";

const CategorySection = (
    {
        categoryName,
        tiles,
        collapsed
    }: {
            categoryName: string,
            tiles: JSX.Element[],
            collapsed: boolean
    }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);
    return (
        <div className={styles.CategorySection}>
            <div className={styles.CategorySectionHeader}>
                <span>{categoryName} {`(${tiles.length})`}</span>
                {!isCollapsed ? <RxTriangleDown onClick={() => setIsCollapsed(true)} style={{ marginLeft: "5px" }} size={25} /> : <RxTriangleLeft onClick={() => setIsCollapsed(false)} style={{ marginLeft: "5px" }} size={25} />}
            </div>
            <div className={styles.CategorySectionGrid} style={{ display: isCollapsed  ? "none" : "grid"}}>
                {tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name))}
            </div>
        </div>
    )
}

export default CategorySection;