import { NavLink, Outlet, redirect } from "react-router-dom"

//api
import { getRequest, getRequestId } from "../../API/requests"

//components
import { NavBar } from "../../components/NavBar"

//styles
import "./MailLayout.css"

export const MailLayout = () => {

    return (
        <div className="text-light">
            <NavBar/>

            <div className="mainSection text-dark fs-5 ms-4 me-5 my-3 d-flex justify-content-start gap-4 text-center">
                <div className="col-lg-1 bg-light rounded d-flex flex-column py-3">
                    <NavLink to="/mail/sentMessages" className="btn btn-outline-dark m-2"><i class="bi bi-send fs-2"/></NavLink>
                    <NavLink className="btn btn-outline-dark m-2"><i class="bi bi-chat fs-2"/></NavLink>
                    <NavLink className="btn btn-outline-dark m-2"><i class="bi bi-people-fill fs-2"/></NavLink>
                    <NavLink to="/mail/bin" className="btn btn-outline-danger m-2"><i class="bi bi-trash fs-2"/></NavLink>
                </div>
                <div className="col-lg-11 col-md-11 col-sm-10 col-10 bg-light rounded">
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