import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userEmail, setUserEmail] = useState('')

    const handleLogin = (email) => {
        setUserEmail(email)
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        setUserEmail('')
        setIsLoggedIn(false)
    }

    if (isLoggedIn) {
        return (
            <Dashboard
                email={userEmail}
                onLogout={handleLogout}
            />
        )
    }

    return <Login onLogin={handleLogin} />
}

export default App