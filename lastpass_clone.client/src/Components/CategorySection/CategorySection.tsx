import { useState, Dispatch } from "react";
import styles from "./styles.module.scss";
import { RxTriangleDown } from "react-icons/rx";
import { RxTriangleLeft } from "react-icons/rx";
import RequestHelpers from "../../Other/RequestHelpers.tsx";
import axios from "axios";

const CategorySection = (
    {
        categoryName,
        tiles,
        baseUrl,
        categoryId,
        setAlerts,
        setIsAlertModalVisible,
        setIsCategoryUpdateFormVisible,
        setCurrentCategoryId
        // collapsed
    }: {
            categoryName: string,
            tiles: JSX.Element[],
            baseUrl: string,
            categoryId: number | null,
            setAlerts: Dispatch<JSX.Element[]>,
            setIsAlertModalVisible: Dispatch<boolean>,
            setIsCategoryUpdateFormVisible: Dispatch<boolean>,
            setCurrentCategoryId: Dispatch<number>
            // collapsed: boolean
    }) => {
    // const [isCategorySectionCollapsed, setIsCategorySectionCollapsed] = useState<boolean>(collapsed);
    const [areButtonsVisible, setAreButtonsVisible] = useState<boolean>(false);
    const [isCategorySectionCollapsed, setIsCategorySectionCollapsed] = useState<boolean>(false);

    const handleDeleteRequest = () => {
        const requestHelpers = new RequestHelpers()
        axios
            .delete(`${baseUrl}/DeleteCategory/${categoryId}`, RequestHelpers.GenerateFullRequestHeaders())
            .then(response => {
                if (response.data.success === true) {
                    requestHelpers.HandleSuccessAlerts(`Category deletion successful`, setAlerts, setIsAlertModalVisible);
                    setTimeout(() => window.location.replace("/"), 1500)
                }
                else requestHelpers.HandleErrorAlerts(response, setAlerts, setIsAlertModalVisible);
            })
            .catch(error => {
                requestHelpers.HandleAxiosCatchErrors(error, setAlerts, setIsAlertModalVisible);
            });
    }

    return (
        <div className={styles.CategorySection}>
            <div className={styles.CategorySectionHeader}>
                <div className={styles.CategorySectionNameContainer} onMouseEnter={() => setAreButtonsVisible(true)} onMouseLeave={() => setAreButtonsVisible(false)}>
                    <span>{categoryName} {`(${tiles.length})`}</span>
                    {!isCategorySectionCollapsed ? <RxTriangleDown onClick={() => setIsCategorySectionCollapsed(true)} style={{ marginLeft: "5px" }} size={25} /> : <RxTriangleLeft onClick={() => setIsCategorySectionCollapsed(false)} style={{ marginLeft: "5px" }} size={25} />}
                    {categoryId !== null && <div className={styles.CategorySectionHeaderButton} style={{ opacity: areButtonsVisible ? "1" : "0", zIndex: 999 }} onClick={() => {
                        setCurrentCategoryId(categoryId);
                        setIsCategoryUpdateFormVisible(true)
                    }}>Rename</div>}
                    {categoryId !== null && <div className={styles.CategorySectionHeaderButton} style={{ opacity: areButtonsVisible ? "1" : "0", zIndex: 999 }} onClick={handleDeleteRequest}>Delete</div>}
                </div>
            </div>
            <div className={styles.CategorySectionGrid} style={{ display: isCategorySectionCollapsed  ? "none" : "grid"}}>
                {tiles.sort((a, b) => a.props.data.name.localeCompare(b.props.data.name))}
            </div>
        </div>
    )
}

export default CategorySection;