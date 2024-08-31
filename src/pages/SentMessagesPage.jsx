import { redirect, useLoaderData } from "react-router-dom"
import { getRequest, getRequestId, putRequest } from "../API/requests"
import { useState } from "react"
import { MessageTab } from "../components/MessageTab"

export const SentMessagesPage = () => {
    const messagesSent = useLoaderData()
    let [messages, setMessages] = useState(messagesSent)

    const deleteMail = async (messageId) => {
        const users = await getRequest("http://localhost:3000/users/")
        let messageInfo = {}
        let newMessages = []
        let newUserInfo = {}
        
        users.map((user)=>{
            user.messages.map((message)=>{
                if (message.id == messageId){
                    messageInfo = message 
                    newUserInfo = user
                } else {
                    newMessages.push(message)
                }
            })
        })

        newUserInfo.messages = newMessages
        newUserInfo.bin = [messageInfo, ...newUserInfo.bin]
        try {
            await putRequest(`http://localhost:3000/users/${newUserInfo.id}`,newUserInfo)
        } catch {
            throw new Error("Error during updating data")
        }

        messages = newMessages
        setMessages(messages)

        return redirect(".")
    }

    return (
        <div className="container-fluid">
            <h1 className="display-3 p-3 fw-bold">Mails sent: {messages.length}</h1>

            {messages.map((message)=>(
                <MessageTab messageInfo={message} onDelete={deleteMail}/>
            ))}

        </div>
    )
}

export const sentMessagesLoader = async () => {
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    const currentUserData = await getRequestId("http://localhost:3000/users/", id)
    const messages = currentUserData.messages
    let sentMessages = []

    messages.map(async (message)=>{
        if (message.type == "send"){
            sentMessages.push(message)
        }
    })

    return sentMessages
}