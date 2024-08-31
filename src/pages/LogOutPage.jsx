import { redirect, useLoaderData } from "react-router-dom"
import { putRequest } from "../API/requests"

export const LogOutPage = () => {
    const loaderData = useLoaderData()
    
    return redirect("/")
}

export const logOutLoader = async ( ) => {
    const newCurrent = {
        id: "",
        isLogged: false
    }

    try {
        await putRequest("http://localhost:3000/currentUser/", newCurrent)
    } catch {
        throw new Error("Error during log out process")
    }

    return redirect("/")
}