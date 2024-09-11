import React, { useEffect, useState } from "react";
import Category from "../../Types/Category";
import styles from "./styles.module.scss";

const CategorySection = ({ category, tiles }: { category: Category, tiles: JSX.Element[] }) => {
    return (
        <div className={styles.CategorySection}>
            <div className={styles.CategorySectionHeader}>
                <span>{category.name} {`(${tiles.length})`}</span>
            </div>
            <div className={styles.CategorySectionGrid}>
                {tiles}
            </div>
        </div>
    )
}

export default CategorySection;