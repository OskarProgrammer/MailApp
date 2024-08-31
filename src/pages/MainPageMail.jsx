import { useLoaderData } from "react-router-dom"
import { getRequest, getRequestId } from "../API/requests"
import "./MainPageMail.css"

export const MainPageMail = () => {
    const userData = useLoaderData()

    return(
        <div className="container-fluid p-5">
            <h1 className="display-4 fw-bold">Your mail box is ready to use!</h1>
            <div className="container col-lg-6 d-flex flex-column m-4 border border-dark border-3 rounded-pill mx-auto">
                <i class="bi bi-person-circle icon-200"/>
                <p className="fs-3 fw-bold">{userData.login}</p>
                <p className="fs-3 fw-bold">Messages: {userData.messages.length}</p>
                <p>{userData.id}</p>
            </div>
        </div>
    )
}

export const mailLoader = async () => {
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    const currentUserData = await getRequestId("http://localhost:3000/users/",id)

    return currentUserData
}