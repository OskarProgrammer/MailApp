import { useLoaderData } from "react-router-dom"
import { getRequest, getRequestId, putRequest } from "../../API/requests"
import { useState } from "react"
import { BinMailTab } from "../../components/BinMailTab"
import "./BinPage.css"

export const BinPage = () => {
    const messagesLoader = useLoaderData()
    let [messages, setMessages] = useState(messagesLoader)

    const restoreMail = async (messageId) => {
        // getting current user data
        const {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUser = await getRequestId("http://localhost:3000/users/",id)
        let mailDetails = {}

        messages = messages.filter((message)=>{
            if (message.id == messageId){mailDetails = message}
            return message.id != messageId
        })
        setMessages(messages)

        currentUser.bin = messages
        currentUser.messages = [mailDetails, ...currentUser.messages]

        try{
            await putRequest(`http://localhost:3000/users/${id}`, currentUser)
        } catch {
            throw new Error("Error during updating data")
        }
    }

    const removeMail = async (messageId) => {
        // getting current user data
        const {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUser = await getRequestId("http://localhost:3000/users/",id)
        
        currentUser.bin = currentUser.bin.filter((message)=>(message.id != messageId))
        messages = currentUser.bin
        setMessages(messages)

        try{
            await putRequest(`http://localhost:3000/users/${id}`, currentUser)
        } catch {
            throw new Error("Error during updating data")
        }
    }

    const clearBin = async () => {
        // getting current user data
        const {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUser = await getRequestId("http://localhost:3000/users/",id)

        currentUser.bin = []

        messages = []
        setMessages(messages)

        try{
            await putRequest(`http://localhost:3000/users/${id}`, currentUser)
        } catch {
            throw new Error("Error during updating data")
        }
    }

    return (
        <div className="container-fluid">
            <h1 className="display-3 p-2 fw-bold">Bin</h1>
            <h1 className="display-5 fw-bold">Messages: {messages.length}</h1>
            {messages.length != 0 ? <button className="btn btn-outline-danger btn-lg my-4 icon-40" onClick={()=>{clearBin()}}>Clear whole bin</button> : ""}
            {messages.map((message)=>(
                <BinMailTab messageInfo={message} onRestore={restoreMail} onRemove={removeMail}/>
            ))}
        </div>
    )
}


export const binLoader = async () => {
    // getting current user data
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    const currentUser = await getRequestId("http://localhost:3000/users/",id)


    return currentUser.bin
}