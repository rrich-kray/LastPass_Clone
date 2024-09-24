import React, { useEffect, useState } from "react";
import Category from "../../Types/Category";
import styles from "./styles.module.scss";
import { RxTriangleDown } from "react-icons/rx";
import { RxTriangleLeft } from "react-icons/rx";

const CategorySection = ({ categoryName, tiles }: { categoryName: string, tiles: JSX.Element[] }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    return (
        <div className={styles.CategorySection}>
            <div className={styles.CategorySectionHeader}>
                <span>{categoryName} {`(${tiles.length})`}</span>
                {isExpanded ? <RxTriangleDown onClick={() => setIsExpanded(false)} style={{ marginLeft: "5px" }} size={25} /> : <RxTriangleLeft onClick={() => setIsExpanded(true)} style={{ marginLeft: "5px" }} size={25} />}
            </div>
            <div className={styles.CategorySectionGrid} style={{ display: isExpanded  ? "grid" : "none"}}>
                {tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name))}
            </div>
        </div>
    )
}

export default CategorySection;