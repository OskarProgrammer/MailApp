import { useLoaderData, useNavigate } from "react-router-dom"

//api
import { getRequest, getRequestId } from "../../API/requests"
import { useEffect, useState } from "react"
import { ReceiverTab } from "../../components/ReceiverTab"

export const MailDetailsPage = () => {
    const dataLoader = useLoaderData()
    const [data, setData] = useState(dataLoader)
    const navigate = useNavigate() 

    useEffect(()=> {
        const check = setTimeout(()=>{navigate(".")})
        return () => {
            clearTimeout(check)
        }
    }, [])

    return (
        <div className="container-fluid p-3 mb-4">
            <h1 className="display-3 fw-bold">Subject: {data.subject}</h1>
            <p className="display-5 fst-italic">From: {data.senderData.login}</p>
            <p className="display-5 fst-italic">To:</p>

            <div className="container-fluid d-flex justify-content-center gap-2 my-3">
                {data.receiverData.map((receiver)=>(
                    <ReceiverTab receiverInfo={receiver}/>
                ))}
            </div>

            <div className="text-light bg-dark fs-3 border border-1 border-dark p-3 rounded ">
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
                mailDetails = message
                isFound = true
            }
        })
        user.bin.map((message)=>{
            if (message.id == id){
                mailDetails = message
                isFound = true
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

    let receiverData = []
    
    try {
        mailDetails.to.map(async (receiver)=>{
            let rec = await getRequestId("http://localhost:3000/users/", receiver.id)
            receiverData.push(rec)
        })
    } catch {
        let rec = await getRequestId("http://localhost:3000/users/", mailDetails.to)
        receiverData.push(rec)
    }
    


    mailDetails.senderData = senderData
    mailDetails.receiverData = receiverData

    return mailDetails
}