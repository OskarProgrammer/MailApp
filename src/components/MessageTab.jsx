import { Link } from "react-router-dom"

export const MessageTab = (props) => {
    const message = props.messageInfo

    return (
        <div className="container-fluid border border-1 border-dark p-3">
            <h2 className="display-5 fw-bold">Subject: {message.subject}</h2>
            <p className="display-6"></p>
            <button onClick={()=>{props.onDelete(message.id)}} className="btn btn-outline-danger btn-lg me-3">Put into the bin</button>
            <Link to={`/mail/${message.id}`} className="btn btn-outline-primary btn-lg">See details</Link>
        </div>
    )
}