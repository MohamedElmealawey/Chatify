import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from "react-hot-toast"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import assets from "./assets/assets"

const App = () => {
  const { authUser, checkingAuth } = useContext(AuthContext);

  return (
    <div className='bg-cover bg-center' style={{ backgroundImage: `url(${assets.bgImage})` }}>
      <Toaster />
      {checkingAuth ? (
        <div className='min-h-screen flex items-center justify-center text-white'>Loading...</div>
      ) : (
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  )
}

export default App
