import React, { useEffect, useState } from "react";
import Category from "../../Types/Category";
import axios from "axios";

const CategorySection = ({ categoryInfo, baseUrl }: { categoryInfo: Category, baseUrl: string }) => {
    // categoryInfo will contain Id and name; Id will be used to fetch all of the passwords of that category from an endpoint on the backend

    useEffect(() => {
        axios.get($"")
    })
    return (
        <div></div>
    )
}