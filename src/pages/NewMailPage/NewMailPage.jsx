import { Form, Link, redirect, useLoaderData, useNavigate, useParams } from "react-router-dom"

//api
import { getRequest, getRequestId, putRequest } from "../../API/requests"

//styles
import "./NewMailPage.css"
import { useEffect, useState } from "react"


export const NewMailPage = () => {
    const {answerId} = useParams()
    const [contacts, answerInfo] = useLoaderData()
    let [contactsTuples, setContactsTuple] = useState(contacts)
    let [answeringTo, setAnsweringTo] = useState(answerInfo)
    let [receiverName, setReceiverName] = useState("")
    let [receivers, setReceivers] = useState([])


    const navigate = useNavigate()

    useEffect(()=> {
        const check = setTimeout(()=>{navigate(".")})
        return () => {
            clearTimeout(check)
        }
    }, [])

    const addPerson = async() => {
        //getting all users data
        const users = await getRequest("http://localhost:3000/users/")

        //setting the flag 
        let isFound = false
        let newUser = {}

        //checking if next receiver exists
        users.map((user)=>{
            if (user.login == receiverName){
                isFound = true
                newUser.id = user.id
                newUser.login = user.login
            }
        })
        //verifying if user was found
        if (!isFound) {
            return 
        }
        //setting local useStates variables
        receivers = [receiverName, ...receivers]
        setReceivers(receivers)
        setReceiverName("")

        //getting currentUserData 
        let {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUserData = await getRequestId("http://localhost:3000/users/",id)

        //modifying receivers in the currentUser record
        currentUserData.receivers = [newUser, ...currentUserData.receivers]

        //putting data into database
        try {
            await putRequest(`http://localhost:3000/users/${id}`, currentUserData)
        } catch {
            throw new Error("Error during updating list of receivers")
        }

        return
    }

    const removeReceiver = async (receiverToRemove) => {
        let newReceivers = receivers.filter((receiver) => (receiver != receiverToRemove))
        receivers = newReceivers
        setReceivers(receivers)

        //getting currentUserData 
        let {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUserData = await getRequestId("http://localhost:3000/users/",id)

        //modifying receivers in the currentUser record
        currentUserData.receivers = currentUserData.receivers.filter((receiver)=> (receiver.login != receiverToRemove))

        //putting data into database
        try {
            await putRequest(`http://localhost:3000/users/${id}`, currentUserData)
        } catch {
            throw new Error("Error during updating list of receivers")
        }
    }

    const addPersonFromList = async (contact) => {
        let {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUserData = await getRequestId("http://localhost:3000/users/",id)

        if (currentUserData.receivers.includes({
            id: contact.id,
            login: contact.login
        })){
            return
        }

        currentUserData.receivers = [{
            id: contact.id,
            login: contact.login
        }, ...currentUserData.receivers]

        if (receivers.includes(contact.login)){
            return 
        }

        receivers = [contact.login, ...receivers]
        setReceivers(receivers)

        try {
            await putRequest(`http://localhost:3000/users/${id}`, currentUserData)
        } catch {
            throw new Error("Error during updating list of receivers")
        }

        return 
    }

    return(
        <Form method="POST" action={`/mail/sendMail/${answeringTo.id}`} className="addSection container-fluid d-flex flex-column gap-3 py-4 text-light">
            {answerId != "no-response" ? 
                <div className="rounded container-fluid text-center text-light bg-success p-3 fw-bold">
                    <p>Answering to: {answeringTo.id}</p>
                    <Link to={`/mail/${answeringTo.id}`} className="btn btn-primary">Check details</Link>
                </div> : ""}

            {answerId == "no-response" ? <div className="container-fluid d-flex gap-2">
                <input type="text" value={receiverName} onChange={(e)=>{setReceiverName(e.target.value)}} placeholder="Destination mail:" className="col-lg-11 col-md-10 col-sm-10 col-9 rounded-pill border-1 border-dark text-center p-1" />
                <button type="button" className="col-lg-1 col-md-2 col-sm-2 col-3 btn btn-outline-success btn-lg" onClick={()=>{addPerson()}} ><i class="bi bi-plus-lg"/></button>
            </div> : ""}
            <h2 className="display-5 text-dark">Receivers</h2>
            {answerId == "no-response" ? 
            <div className="container-fluid d-flex gap-2">
                {receivers.map((receiver)=>(
                    <div className="text-light col-lg-2 bg-success rounded-pill p-3 d-flex justify-content-center gap-2">
                        <p className="my-auto">{receiver}</p>
                        <button className="btn btn-outline-danger btn-sm" onClick={()=>{removeReceiver(receiver)}}><i class="bi bi-x"></i></button>
                    </div>
                ))}
            </div>: <div className="container-fluid d-flex gap-2">
                    <div className="text-light col-lg-2 bg-success rounded-pill p-3 d-flex justify-content-center gap-2">
                        <p className="my-auto">{answeringTo.fromName}</p>
                    </div>
            </div>}
            <h2 className="display-5 text-dark">Contacts</h2>
            <div className="container-fluid d-flex gap-2">
                {contactsTuples.map((contact)=>(
                    <div className="text-light col-lg-1 bg-dark rounded-pill d-flex gap-2 p-3">
                        <p className="my-auto">{contact.login}</p>
                        <button className="btn btn-outline-success btn-sm" onClick={()=>{addPersonFromList(contact)}}><i class="bi bi-plus-lg"/></button>
                    </div>
                ))}
            </div>
            <input type="text" name="mailSubject" placeholder="Subject of the mail" className="rounded-pill border-1 border-dark text-center p-1" />
            <textarea name="mailContent" placeholder="Your mail" className="textAreaHeight rounded p-2 text-center"></textarea>
            <button className="btn btn-outline-success btn-lg"><i class="bi bi-send-check-fill"/></button>
        </Form>
    )
}

export const newMailLoader = async ({params}) => {
    const {answerId} = params
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    const currentUser = await getRequestId("http://localhost:3000/users/", id)
    const contacts = currentUser.contacts
    let betterContacts =[]
    let answerInfo = {}
    
    contacts.map(async (contact)=>{
        const userInfo = await getRequestId("http://localhost:3000/users/", contact)
        betterContacts.push(
            {
                id: contact,
                login: userInfo.login
            }
        ) 
    })

    currentUser.messages.map(async (message)=>{
        if (message.id == answerId){
            answerInfo = message
            const user = await getRequestId("http://localhost:3000/users/", message.from)
            answerInfo.fromName = user.login
        }
    })

    return [betterContacts, answerInfo]
}



export const newMailAction = async ({request, params}) => {
    const {answerId} = params
    let answerInfo = {}
    const data = await request.formData()

    //getting data from form
    const mailSubject = data.get("mailSubject")
    const mailContent = data.get("mailContent")

    //getting current user data
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    let currentUserData = await getRequestId("http://localhost:3000/users/", id)
    const destinationMails = currentUserData.receivers

    if (answerId != "no-response"){
        currentUserData.messages.map(async (message)=>{
            if (message.id == answerId){
                answerInfo = message
                const user = await getRequestId("http://localhost:3000/users/", message.from)
                answerInfo.fromName = user.login
            }
        })

        destinationMails.push({
            id: answerInfo.from,
            login: answerInfo.fromName
        })
    }

    if (destinationMails.length == 0){
        return null
    }

    //checking if all fields were provided
    if (mailSubject == "" || mailContent == "") { return {error: "All fields must be provided"}}

    const idOfMail = crypto.randomUUID()

    //sending to owner
    let newMailSent = {
        id: idOfMail,
        type: "send",
        from: id,
        to: destinationMails,
        subject: mailSubject,
        content: mailContent
    }

    if (answerId != "no-response"){
        newMailSent.responseTo = answerInfo.id
    }

    currentUserData.messages = [newMailSent, ...currentUserData.messages]

    try{
        await putRequest(`http://localhost:3000/users/${id}`, currentUserData)
    } catch {
        throw new Error("Something went wrong during sending mail")
    }
    

    //sending to destination

    destinationMails.map(async (destination) => {
        let newMailReceived = {
            id: idOfMail,
            type: "received",
            from: id,
            to: destination.id,
            subject: mailSubject,
            content: mailContent
        }

        if (answerId != "no-response"){
            newMailReceived.responseTo = answerId
        }

        let destinationUserData = await getRequestId("http://localhost:3000/users/",destination.id)

        destinationUserData.messages = [newMailReceived, ...destinationUserData.messages]

        try{
            await putRequest(`http://localhost:3000/users/${destinationUserData.id}`, destinationUserData)
        } catch {
            throw new Error("Something went wrong during sending mail")
        }
    })

    let currentUser = await getRequestId("http://localhost:3000/users/",id)
    currentUser.receivers = []
    try{
        await putRequest(`http://localhost:3000/users/${id}`, currentUser)
    } catch {
        throw new Error("Something went wrong during sending mail")
    }



    return redirect("/mail/")
}