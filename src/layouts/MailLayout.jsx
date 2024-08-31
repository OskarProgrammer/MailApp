import { redirect } from "react-router-dom"
import { getRequest } from "../API/requests"

export const MailLayout = () => {

    return (
        <div className="text-light">
            Mail layout
        </div>
    )
}

export const mailLayoutloader = async () => {
    const {isLogged} = await getRequest("http://localhost:3000/currentUser/")
    
    if (isLogged) {
        return redirect("/mail/")
    }else{
        return redirect("/")
    }
}