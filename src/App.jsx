
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'

//importing bootstrap
import 'bootstrap/dist/css/bootstrap.css'

//layouts
import { HomeLayout } from './layouts/HomeLayout'
import { MailLayout, mailLayoutloader } from './layouts/MailLayout'

//pages
import { MainPage, mainPageAction } from './pages/MainPage'
import { logOutLoader, LogOutPage } from './pages/LogOutPage'
import { mailLoader, MainPageMail } from './pages/MainPageMail'
import { newMailAction, NewMailPage } from './pages/NewMailPage'
import { sentMessagesLoader, SentMessagesPage } from './pages/SentMessagesPage'
import { mailDetailsLoader, MailDetailsPage } from './pages/MailDetailsPage'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout/>} action={mainPageAction}>
        <Route index element={<MainPage/>} action={mainPageAction}/>

        <Route path="/mail/" element={<MailLayout/>} loader={mailLayoutloader} >
            <Route index element={<MainPageMail/>} loader={mailLoader}/>
            <Route path="sentMessages" element={<SentMessagesPage/>} loader={sentMessagesLoader}/>
            <Route path="sendMail" element={<NewMailPage/>} action={newMailAction}/>
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
