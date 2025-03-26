
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {lazy, Suspense} from 'react'
const Home = lazy(()=>import('./pages/Home'))
const Login = lazy(()=>import('./pages/Login'))
const Chat = lazy(()=>import('./pages/Chat'))
const Group = lazy(()=>import('./pages/Group'))
import ProtectRoute from './components/auth/protectRoute'
import Loader from './components/layout/Loader'
const AdminLogin = lazy(()=>import('./pages/admin/AdminLogin'))
const Dashboard = lazy(()=>import('./pages/admin/Dashboard'))
const UserManagement = lazy(()=>import('./pages/admin/UserManagement'))
const MessageManagement = lazy(()=>import('./pages/admin/MessageManagement'))
const ChatManagement = lazy(()=>import('./pages/admin/ChatManagement'))
let user = false;
const App = () => {
  return (
    <Router>
       <Suspense fallback={<Loader />}>
      <Routes>
       <Route element={<ProtectRoute user={user}/>} >
       <Route path="/home" element={<Home/>} />
        <Route path="/chat/:id" element={<Chat/>} />
        <Route path="/group" element={<Group/>} />
       </Route>
        <Route path="/login" element={<ProtectRoute user={!user} redirect='/'><Login/></ProtectRoute>} />
        <Route path="*" element={<div>404</div>} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/user' element={<UserManagement />} />
        <Route path='/admin/message' element={<MessageManagement />} />
        <Route path='/admin/chat' element={<ChatManagement />} />
      </Routes>
       </Suspense>
    </Router>
  )
}

export default App