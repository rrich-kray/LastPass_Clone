import styles from "./styles.module.scss";
import { MdExpand } from "react-icons/md";
import { BsArrowsCollapse } from "react-icons/bs";
import { SlMagnifierAdd } from "react-icons/sl";
import { SlMagnifierRemove } from "react-icons/sl";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { Dispatch } from "react";
import SortingOptions from "../../Other/SortingOptionsEnum.ts";

const SortingBar = (
    {
        currentType,
        currentSort,
        setCurrentSort,
        sortingOptions
    }: {
            currentType: string,
            currentSort: string,
            setCurrentSort: Dispatch<string>,
            sortingOptions: SortingOptions
    }) => {

    return (
        <div className={styles.SortingBar}>
            <div className={styles.SortingBarLeftPanel}>
                <span>{currentType}</span>
            </div>
            <div className={styles.SortingBarRightPanel}>
                <div className={styles.SortingBarButtonContainer}>
                    <button className={styles.SortingBarButton} style={{ marginRight: "7.5px" }}></button>
                    <button className={styles.SortingBarButton} style={{ marginRight: "7.5px" }}></button>
                    <div className={styles.ListTileViewButtons}>
                        <button className={styles.SortingBarButton}></button>
                        <button className={styles.SortingBarButton}></button>
                    </div>

                    <div className={styles.SortingBarDropdownWrapper} tabIndex={0}>
                        <div className={styles.SortButton} style={{ marginLeft: "7.5px" }}>
                            <span style={{fontWeight: "bold"}}>Sort By: </span>
                            <span>{currentSort}</span>
                        </div>
                        <div className={styles.SortingBarDropdownMenu}>
                            <div className={styles.SortingBarDropdownSelection} onClick={() => setCurrentSort(SortingOptions.FolderAZ)}>
                                <a>Folder (a-z)</a>
                            </div>
                            <div className={styles.SortingBarDropdownSelection} onClick={() => setCurrentSort(SortingOptions.FolderZA)}>
                                <a>Folder (z-a)</a>
                            </div>
                            <div className={styles.SortingBarDropdownSelection} onClick={() => setCurrentSort(SortingOptions.NameAZ)}>
                                <a>Name (a-z)</a>
                            </div>
                            <div className={styles.SortingBarDropdownSelection} onClick={() => setCurrentSort(SortingOptions.NameZA)}>
                                <a>Name (z-a)</a>
                            </div>
                            <div className={styles.SortingBarDropdownSelection} onClick={() => setCurrentSort(SortingOptions.MostRecent)}>
                                <a>Most Recent</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SortingBar;