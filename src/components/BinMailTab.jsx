import { Link } from "react-router-dom"

export const BinMailTab = (props) => {
    const message = props.messageInfo

    return (
        <div className="container-fluid border border-1 border-dark p-3">
            <h2 className="display-5 fw-bold">Subject: {message.subject}</h2>
            <p className="display-6"></p>
            <button className="btn btn-outline-dark btn-lg me-3" onClick={()=>{props.onRestore(message.id)}}><i class="bi bi-arrow-repeat fs-2"/></button>
            <button className="btn btn-outline-danger btn-lg me-3" onClick={()=>{props.onRemove(message.id)}}><i class="bi bi-x-lg fs-2"/></button>
            <Link to={`/mail/${message.id}`} className="btn btn-outline-primary btn-lg"><i class="bi bi-search fs-2"/></Link>
        </div>
    )
}