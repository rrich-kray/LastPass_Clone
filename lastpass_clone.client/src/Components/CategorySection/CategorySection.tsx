import React, { useEffect, useState } from "react";
import Category from "../../Types/Category";
import styles from "./styles.module.scss";

const CategorySection = ({ categoryName, tiles }: { categoryName: string, tiles: JSX.Element[] }) => {
    return (
        <div className={styles.CategorySection}>
            <div className={styles.CategorySectionHeader}>
                <span>{categoryName} {`(${tiles.length})`}</span>
            </div>
            <div className={styles.CategorySectionGrid}>
                {tiles}
            </div>
        </div>
    )
}

export default CategorySection;