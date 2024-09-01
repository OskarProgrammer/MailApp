import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom"
import {getRequest, getRequestId, putRequest} from "../../API/requests"
import { useEffect, useState } from "react"
import { ContactTab } from "../../components/ContactTab"


export const ContactsPage = () => {
    const usersContacts = useLoaderData()
    let [contacts, setContacts] = useState(usersContacts)
    const navigate = useNavigate() 

    useEffect(()=> {
        const check = setTimeout(()=>{navigate(".")})
        return () => {
            clearTimeout(check)
        }
    }, [])

    const removeContact = async (contactId) => {
        const {id} = await getRequest("http://localhost:3000/currentUser/")
        let currentUser = await getRequestId("http://localhost:3000/users/", id)

        currentUser.contacts = currentUser.contacts.filter((contact)=>(contact != contactId))
        contacts = currentUser.contacts
        setContacts(contacts)

        try {
            await putRequest(`http://localhost:3000/users/${id}`,currentUser)
        } catch {
            throw new Error("Error during removing contact")
        }
    }

    return(
        <div className="container-fluid pt-4 mb-4">
            <h1 className="display-4">Your contacts: </h1>
            {contacts.map((contact)=>(
                <ContactTab contactInfo={contact} onRemove={removeContact}/>
            ))}
            <Form method="POST" action="/mail/contacts" className="container-fluid p-3 d-flex gap-3 flex-column bg-dark border border-2 border-dark rounded">
                <input className="col-6 mx-auto p-3 text-center rounded" name="login" type="text" placeholder="Name of new contact"/>
                <button className="btn btn-outline-success btn-lg col-2 mx-auto"><i class="bi bi-plus-lg"/></button>
            </Form>
        </div>
    )
}

export const contactsAction = async ({request}) => {
    const data = await request.formData()
    const login = data.get("login")

    if (login == "") {
        return {error: "Field must be provided"}
    }

    const {id} = await getRequest("http://localhost:3000/currentUser/")
    let currentUser = await getRequestId("http://localhost:3000/users/", id)
    const users = await getRequest("http://localhost:3000/users/")

    let isFound = false
    let newContact = {}

    users.map((user)=>{
        if (user.login == login){
            isFound = true
            newContact = {
                id: user.id,
                login: login
            }
        }
    })

    if (!isFound) {
        return {error: "No such email in the database"}
    }

    if (currentUser.contacts.includes(newContact.id)){
        return {error: "You have got this account already on contacts list"}
    }

    currentUser.contacts = [newContact.id, ...currentUser.contacts]

    try {
        await putRequest(`http://localhost:3000/users/${id}`,currentUser)
    } catch {
        throw new Error("Error during removing contact")
    }


    return
}

export const contactsLoader = async () => {
    const {id} = await getRequest("http://localhost:3000/currentUser/")
    const currentUser = await getRequestId("http://localhost:3000/users/", id)
    const contacts = currentUser.contacts
    let tuplesOfContacts = []

    contacts.map(async (contact)=>{
        const thisUser = await getRequestId("http://localhost:3000/users/", contact)
        tuplesOfContacts.push({
            id: contact,
            login: thisUser.login
        })
    })

    return tuplesOfContacts
}