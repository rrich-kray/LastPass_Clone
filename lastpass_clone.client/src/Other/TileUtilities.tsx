import { Dispatch } from "react";
import { FaLock } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import axios from "axios";
import styles from "../Components/Sidebar/styles.module.scss"
import Category from "../../Types/Category";
import RequestHelpers from "./RequestHelpers.tsx";

class TileUtilities
{
    colors: string[];
    baseUrl: string;
    constructor(baseUrl: string)
    {
        this.colors = [
            "rgb(52, 97, 84)",
            "rgb(60, 55, 126)",
            "rgb(137, 135, 189)",
            "rgb(98, 126, 174)",
            "rgb(96, 154, 176)"
        ]
        this.baseUrl = baseUrl
    }

    SelectRandomColor(): string  { return this.colors[Math.floor(Math.random() * this.colors.length)] }

    SelectCategoryIcon (categoryName: string): React.ReactNode {
        if (categoryName === "Password") {
            return <FaLock size={ 30 } className = { styles.SidebarLinkIcon } />
        } else if (categoryName === "Note") {
            return <FaNoteSticky size={ 30 } className = { styles.SidebarLinkIcon } />
        } else if (categoryName === "Address") {
            return <FaRegAddressBook size={ 30 } className = { styles.SidebarLinkIcon } />
        } else if (categoryName === "Payment Card") {
            return <FaRegCreditCard size={ 30 } className = { styles.SidebarLinkIcon } />
        } else if (categoryName === "Bank Account") {
            return <BsBank size={ 30 } className = { styles.SidebarLinkIcon } />
        } else {
            return <FaLock size={ 30 } className = { styles.SidebarLinkIcon } />
        }
    }

    async HandleDeleteRequest (entityId: number, url: string) {
        await axios
            .post(`${this.baseUrl}/${url}/${entityId}`, RequestHelpers.GenerateRequestHeaders())
            .catch(error => console.log(error));
    }

    async FetchCategoryData(categoryId: number): Promise<string>
    {
        return await axios
            .get(`${this.baseUrl}/GetCategories`, RequestHelpers.GenerateRequestHeaders())
            .then(response => {
                const data = response.data;
                return data.find((x: Category) => x.id === categoryId).name;
            })
            .catch(error => {
                console.log(error);
            })
    }
}

export default TileUtilities