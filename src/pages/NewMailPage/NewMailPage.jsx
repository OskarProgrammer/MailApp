import { Form, redirect } from "react-router-dom"

//api
import { getRequest, getRequestId, putRequest } from "../../API/requests"

//styles
import "./NewMailPage.css"


export const NewMailPage = () => {

    return(
        <Form method="POST" action="/mail/sendMail" className="addSection container-fluid d-flex flex-column gap-3 py-4 text-light">
            <input type="text" name="destinationMail" placeholder="Destination mail:" className="rounded-pill border-1 border-dark text-center p-1" />
            <input type="text" name="mailSubject" placeholder="Subject of the mail" className="rounded-pill border-1 border-dark text-center p-1" />
            <textarea name="mailContent" placeholder="Your mail" className="textAreaHeight rounded p-2 text-center"></textarea>
            <button className="btn btn-outline-success btn-lg">Send!</button>
        </Form>
    )
}

export const newMailAction = async ({request}) => {
    const data = await request.formData()

    //getting data from form
    const destinationMail = data.get("destinationMail")
    const mailSubject = data.get("mailSubject")
    const mailContent = data.get("mailContent")

    //getting current user data
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    let currentUserData = await getRequestId("http://localhost:3000/users/", id)

    //getting all users
    const users = await getRequest("http://localhost:3000/users/")

    //checking if all fields were provided
    if (destinationMail == "" || mailSubject == "" || mailContent == "") { return {error: "All fields must be provided"}}

    // checking if destinationmail exists in database
    let isFound = false
    let destinationUser = {}
    users.map((user)=>{
        if (user.login == destinationMail) { 
            isFound = true
            destinationUser.id = user.id
        } 
    })

    //verification
    if (!isFound){return {error: "No such email found!"}}


    //sending to owner
    const newMailSent = {
        id: crypto.randomUUID(),
        type: "send",
        from: id,
        to: destinationUser.id,
        subject: mailSubject,
        content: mailContent
    }

    currentUserData.messages = [newMailSent, ...currentUserData.messages]

    try{
        await putRequest(`http://localhost:3000/users/${id}`, currentUserData)
    } catch {
        throw new Error("Something went wrong during sending mail")
    }
    

    //sending to destination
    const newMailReceived = {
        id: crypto.randomUUID(),
        type: "received",
        from: id,
        to: destinationUser.id,
        subject: mailSubject,
        content: mailContent
    }

    let destinationUserData = await getRequestId("http://localhost:3000/users/",destinationUser.id)

    destinationUserData.messages = [newMailReceived, ...destinationUserData.messages]

    try{
        await putRequest(`http://localhost:3000/users/${destinationUserData.id}`, destinationUserData)
    } catch {
        throw new Error("Something went wrong during sending mail")
    }



    return redirect("/mail/")
}