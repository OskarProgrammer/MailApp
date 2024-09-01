export const ContactTab = (props) => {

    const contact = props.contactInfo

    return(
        <div className="container-fluid bg-dark text-light my-3 border border-4 border-dark rounded p-3">
            <h3 className="display-5">{contact.login}</h3>
            <p className="fs-4">{contact.id}</p>
            <button className="btn btn-outline-danger btn-lg" onClick={()=>{props.onRemove(contact.id)}}><i class="bi bi-trash"/></button>
        </div>
    )
}