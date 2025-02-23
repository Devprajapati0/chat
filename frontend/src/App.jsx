
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {lazy, Suspense} from 'react'
const Home = lazy(()=>import('./pages/Home'))
const Login = lazy(()=>import('./pages/Login'))
const Chat = lazy(()=>import('./pages/Chat'))
const Group = lazy(()=>import('./pages/Group'))
import ProtectRoute from './components/auth/protectRoute'
import Loader from './components/layout/Loader'
let user = true;
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
      </Routes>
       </Suspense>
    </Router>
  )
}

export default App