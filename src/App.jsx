
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

//styles
import './App.css'

//importing bootstrap
import 'bootstrap/dist/css/bootstrap.css'

//layouts
import { HomeLayout } from './layouts/HomeLayout/HomeLayout'
import { MailLayout, mailLayoutloader } from './layouts/MailLayout/MailLayout'

//pages
import { MainPage, mainPageAction } from './pages/MainPage/MainPage'
import { logOutLoader, LogOutPage } from './pages/LogOutPage/LogOutPage'
import { mailLoader, MainPageMail } from './pages/MainPageMail/MainPageMail'
import { newMailAction, newMailLoader, NewMailPage } from './pages/NewMailPage/NewMailPage'
import { sentMessagesLoader, SentMessagesPage } from './pages/SentMessagesPage/SentMessagesPage'
import { mailDetailsLoader, MailDetailsPage } from './pages/MailDetailsPage/MailDetailsPage'
import { binLoader, BinPage } from './pages/BinPage/BinPage'
import { receivedMessagesLoader, ReceivedMessagesPage } from './pages/ReceivedMessagesPage/ReceivedMessagesPage'
import { contactsAction, contactsLoader, ContactsPage } from './pages/ContactsPage/ContactsPage'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout/>} action={mainPageAction}>
        <Route index element={<MainPage/>} action={mainPageAction}/>

        <Route path="/mail/" element={<MailLayout/>} loader={mailLayoutloader} >
            <Route index element={<MainPageMail/>} loader={mailLoader}/>
            <Route path="sentMessages" element={<SentMessagesPage/>} loader={sentMessagesLoader}/>
            <Route path="receivedMessages" element={<ReceivedMessagesPage/>} loader={receivedMessagesLoader}/>
            <Route path="contacts" element={<ContactsPage/>} loader={contactsLoader} action={contactsAction}/>
            <Route path="bin" element={<BinPage/>} loader={binLoader}/>
            <Route path="sendMail" element={<NewMailPage/>} action={newMailAction} loader={newMailLoader}/>
            <Route path=":id" element={<MailDetailsPage/>} loader={mailDetailsLoader}/>
            <Route path="logOut" element={<LogOutPage/>} loader={logOutLoader}/>
        </Route>
    </Route>
  )
)


function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
