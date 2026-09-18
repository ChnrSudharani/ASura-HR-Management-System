import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [currentPage, setCurrentPage] = useState('dashboard')

    const handleLogin = (email) => {
        setUserEmail(email)
        setIsLoggedIn(true)
        setCurrentPage('dashboard')
    }

    const handleLogout = () => {
        setUserEmail('')
        setIsLoggedIn(false)
        setCurrentPage('dashboard')
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />
    }

    if (currentPage === 'employees') {
        return (
            <Employees />
        )
    }

    return (
        <Dashboard
            email={userEmail}
            onLogout={handleLogout}
            onEmployeesClick={() => setCurrentPage('employees')}
        />
    )
}

export default App