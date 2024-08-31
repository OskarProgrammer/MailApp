import { useLoaderData } from "react-router-dom"
import { getRequest, getRequestId } from "../API/requests"

export const MailDetailsPage = () => {
    const data = useLoaderData()

    return (
        <div className="container-fluid p-3">
            <h1 className="display-3 fw-bold">Subject: {data.subject}</h1>
            <p className="display-5 fst-italic">From: {data.senderData.login}</p>
            <p className="display-5 fst-italic">To: {data.receiverData.login}</p>
            <div className="fs-3 border border-1 border-dark">
                {data.content}
            </div>
        </div>
    )
}

export const mailDetailsLoader = async ({params}) => {
    const {id} = params
    const users = await getRequest("http://localhost:3000/users/")
    let isFound = false
    let mailDetails = {}

    users.map((user)=>{
        user.messages.map((message)=>{
            if (message.id == id){
                isFound = true
                mailDetails = message
            }
        })
    })

    if (!isFound) { throw new Error("Mail not found")}

    const currentUserData = await getRequest("http://localhost:3000/currentUser/")

    if (!currentUserData.isLogged){
        throw new Error("You haven't got access to that mail")
    }

    if (currentUserData.id != mailDetails.from && currentUserData.id != mailDetails.to){
        throw new Error("You haven't got access to that mail")
    }

    const senderData = await getRequestId("http://localhost:3000/users/", mailDetails.from)
    const receiverData = await getRequestId("http://localhost:3000/users/", mailDetails.to)


    mailDetails.senderData = senderData
    mailDetails.receiverData = receiverData

    return mailDetails
}