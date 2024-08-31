import { NavLink } from "react-router-dom"


export const NavBar = (props) => {



    return(
        <div className="navbar bg-light m-3 px-4 py-3 fs-5 rounded-pill">
                <div className="col-lg-6">
                    <NavLink to="/mail/" className="btn btn-outline-dark btn-lg">Home</NavLink>
                </div>
                <div className="col-lg-6 d-flex justify-content-end gap-3">
                    <NavLink to="/mail/sendMail" className="btn btn-outline-success btn-lg"><i class="bi bi-send"></i></NavLink>
                    <NavLink to="/mail/logOut" className="btn btn-outline-danger btn-lg">Log out</NavLink>
                </div>
        </div>
    )
}