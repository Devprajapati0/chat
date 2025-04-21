import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loader from './components/layout/Loader'
import { SocketProvider } from './Socket'
import Signup from './pages/signup'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'))
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'))

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/group" element={<Group />} />

            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/user" element={<UserManagement />} />
            <Route path="/admin/message" element={<MessageManagement />} />
            <Route path="/admin/chat" element={<ChatManagement />} />

            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Suspense>
      </SocketProvider>
    </Router>
  )
}

export default App
