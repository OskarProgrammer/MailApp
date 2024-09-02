import { useState } from "react"
import { redirect, useLoaderData } from "react-router-dom"

//api
import { getRequest, getRequestId, putRequest } from "../../API/requests"

//components
import { MessageTab } from "../../components/MessageTab"

export const ReceivedMessagesPage = () => {
    const messagesSent = useLoaderData()
    let [messages, setMessages] = useState(messagesSent)

    const deleteMail = async (messageId) => {
        const {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUserData = await getRequestId("http://localhost:3000/users/", id)

        let messageToRemove = {}
        //filtring data in messages of current user
        currentUserData.messages = currentUserData.messages.filter((message)=>{
            if (message.id == messageId){
                messageToRemove = message
            }
            return message.id != messageId
        })

        //adding message to the bin 
        currentUserData.bin = [messageToRemove, ...currentUserData.bin]

        //updating data in useState variables
        messages = currentUserData.messages
        setMessages(messages)

        //putting data into the database
        try {
            await putRequest(`http://localhost:3000/users/${id}`,currentUserData)
        } catch {
            throw new Error("Error during updating the data")
        }
    }


    return (
        <div className="container-fluid">
            <h1 className="display-3 p-3 fw-bold">Mails received: {messages.length}</h1>

            {messages.map((message)=>(
                <MessageTab messageInfo={message} onDelete={deleteMail} />
            ))}
        
        </div>
    )
}

export const receivedMessagesLoader = async () => {
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    const currentUserData = await getRequestId("http://localhost:3000/users/", id)
    const messages = currentUserData.messages
    let receivedMessages = []

    messages.map(async (message)=>{
        if (message.type == "received"){
            receivedMessages.push(message)
        }
    })

    return receivedMessages
}