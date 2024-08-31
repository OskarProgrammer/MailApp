import { useState } from "react"
import { Form, redirect, useActionData } from "react-router-dom"

//api
import { getRequest, postRequest, putRequest } from "../../API/requests"

//styles
import "./MainPage.css"

export const MainPage = () => {
    const [isLoginPage, setIsLoginPage] = useState(true)
    const actionData = useActionData()
    
    return (
        <div className={`mainPage container-lg-fluid container-md-5 bg-dark text-dark d-flex ${isLoginPage ? "justify-content-start" : "justify-content-end"} p-5 my-5 fs-3`}>
            {isLoginPage ? <div className="col-lg-6 col-md-6 col-sm-8 col-12 text-center bg-light p-5 rounded">
                <Form method="POST" action="/" className="d-flex flex-column gap-4 p-5 fs-5">
                    <h1 className="display-4 fw-bold my-4 mx-auto">Login Form</h1>
                    <input type="text" name="login" placeholder="Login" className="col-lg-10 mx-auto col-sm-12 col-12 p-2"/>
                    <input type="password" name="pass" placeholder="Password" className="col-lg-10 mx-auto col-sm-12 col-12 p-2"/>
                    <p className="fs-5 fst-italic">Havent got email yet? <a onClick={()=>{setIsLoginPage(!isLoginPage)}}>Click here</a></p>
                    {actionData && actionData.error && <p class="text-danger">{actionData.error}</p>}
                    <button className="btn btn-outline-dark col-lg-6 mx-auto">Login</button>
                </Form>
            </div>: ""}
            {!isLoginPage ? <div className="col-lg-6 col-md-6 col-sm-8 col-12 bg-light text-center p-5 rounded">
                <Form method="POST" action="/" className="d-flex flex-column gap-4 p-5 fs-5">
                    <h1 className="display-4 fw-bold my-4">Register Form</h1>
                    <input type="text" name="login" placeholder="Login" className="col-lg-10 mx-auto col-sm-12 col-12 p-2"/>
                    <input type="password" name="pass" placeholder="Password" className="col-lg-10 mx-auto col-sm-12 col-12 p-2"/>
                    <input type="password" name="repeatedPass" placeholder="Repeat password" className="col-lg-10 mx-auto col-sm-12 col-12 p-2"/>
                    <p className="fs-5 fst-italic">Have got email already? <a onClick={()=>{setIsLoginPage(!isLoginPage)}}>Click here</a></p>
                    {actionData && actionData.error && <p class="text-danger">{actionData.error}</p>}
                    <button className="btn btn-outline-dark col-lg-6 mx-auto">Register</button>
                </Form>
            </div>: ""}
        </div>
    )
}

export const mainPageAction = async ({request}) => {
    const data = await request.formData()
    const login = data.get("login")
    const pass = data.get("pass")
    const repeatedPass = data.get("repeatedPass")

    if (repeatedPass == null) {
        if (login == "" || pass == ""){
            return {error: "Login and password must be provided"}
        }

        const users = await getRequest("http://localhost:3000/users/")
        let isFound = false
        let newCurrent = {}

        users.map((user)=>{
            if (user.login == login && user.pass == pass){
                isFound = true

                newCurrent = {
                    id: user.id,
                    isLogged: true
                }
            }
        })

        if (!isFound) {
            return {error: "Invalid login or password"}
        }

        try {
            await putRequest("http://localhost:3000/currentUser/", newCurrent)
        } catch {
            return {error: "Something went wrong"} 
        }

        return redirect("/mail/")

    }else{
        if (login == "" || pass == ""){
            return {error: "Login and password must be provided"}
        } else if (pass != repeatedPass) {
            return {error: "Repeated password and password must be the same"}
        }

        const users = await getRequest("http://localhost:3000/users/")
        let isTaken = false

        users.map((user)=>{
            if (user.login == login){
                isTaken = true
            }
        })

        if (isTaken) {
            return {error: "This login is taken"}
        }
    
        const id = crypto.randomUUID()

        const newUser = {
            id: id,
            login: login,
            pass: pass,
            messages: [],
            bin: []
        }
    
        try {
            await postRequest("http://localhost:3000/users/", newUser)
        } catch {
            return {error: "Something went wrong"} 
        }

        const newCurrentUser = {
            id: id,
            isLogged: true
        }
        
    
        try {
            await putRequest("http://localhost:3000/currentUser/", newCurrentUser)
        } catch {
            return {error: "Something went wrong"} 
        }
    
        return redirect("/mail/")
    }
}