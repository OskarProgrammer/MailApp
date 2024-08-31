import { NavLink, Outlet, redirect } from "react-router-dom"
import { getRequest, getRequestId } from "../API/requests"
import { NavBar } from "../components/NavBar"

export const MailLayout = () => {

    return (
        <div className="text-light">
            <NavBar/>

            <div className="text-dark fs-5 ms-4 me-5 my-3 d-flex justify-content-start gap-4 text-center">
                <div className="col-lg-1 bg-light rounded d-flex flex-column py-3 gap-3">
                    <i class="bi bi-chat-fill fs-2"></i>
                    <i class="bi bi-trash fs-2"></i>
                </div>
                <div className="col-lg-11 bg-light rounded">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export const mailLayoutloader = async () => {
    const {id ,isLogged} = await getRequest("http://localhost:3000/currentUser/")
    const currentUserData = await getRequestId("http://localhost:3000/users/", id)

    if (isLogged) {
        return currentUserData 
    }else{
        return redirect("/")
    }
}