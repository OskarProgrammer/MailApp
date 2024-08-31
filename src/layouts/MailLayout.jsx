import { NavLink, redirect } from "react-router-dom"
import { getRequest, getRequestId } from "../API/requests"

export const MailLayout = () => {

    return (
        <div className="text-light">
            <div className="navbar bg-light m-2 px-4 py-3 fs-5 rounded-pill">
                <div className="col-lg-6">
                    <NavLink to="/mail/" className="btn btn-outline-dark btn-lg">Home</NavLink>
                </div>
                <div className="col-lg-6 d-flex justify-content-end gap-3">
                    <NavLink className="btn btn-outline-success btn-lg">Send message</NavLink>
                    <NavLink to="/mail/logOut" className="btn btn-outline-danger btn-lg">Log Out</NavLink>
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