import { Link } from "react-router-dom"

export const MessageTab = (props) => {
    const message = props.messageInfo

    return (
        <div className="container-fluid border border-1 border-dark p-3">
            <h2 className="display-5 fw-bold">Subject: {message.subject}</h2>
            <p className="display-6"></p>
            <button onClick={()=>{props.onDelete(message.id)}} className="btn btn-outline-danger btn-lg me-3"><i class="bi bi-arrow-90deg-right fs-2"/><i class="bi bi-trash fs-2"/></button>
            <Link to={`/mail/${message.id}`} className="btn btn-outline-primary btn-lg"><i class="bi bi-search fs-2"/></Link>
        </div>
    )
}