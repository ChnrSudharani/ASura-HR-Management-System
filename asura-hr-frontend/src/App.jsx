
import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import LeaveManagement from './pages/LeaveManagement'
import NavigationContext from './components/NavigationContext'

function getSavedSession() {
    const storages = [localStorage, sessionStorage]

    for (const storage of storages) {
        try {
            const token = storage.getItem('token')
            const savedUser = storage.getItem('user')

            if (
                !token ||
                token.trim() === '' ||
                token === 'null' ||
                token === 'undefined' ||
                !savedUser
            ) {
                continue
            }

            const user = JSON.parse(savedUser)

            if (user.email && user.role) {
                return {
                    email: user.email,
                    role: user.role.toUpperCase()
                }
            }
        } catch {
            // Ignore invalid saved session data.
        }
    }

    return null
}

function App() {
    const [savedSession] = useState(() => getSavedSession())
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedSession))
    const [userEmail, setUserEmail] = useState(savedSession?.email || '')
    const [userRole, setUserRole] = useState(savedSession?.role || 'EMPLOYEE')
    const [currentPage, setCurrentPage] = useState('dashboard')

    const canManageEmployees =
        userRole === 'HR_ADMIN' || userRole === 'MANAGER'

    const handleLogin = (email) => {
        let role = 'EMPLOYEE'

        try {
            const savedUser =
                localStorage.getItem('user') ||
                sessionStorage.getItem('user') ||
                '{}'

            const user = JSON.parse(savedUser)

            role = (user.role || 'EMPLOYEE').toUpperCase()
            email = user.email || email
        } catch {
            // Use the fallback role if saved user data is invalid.
        }

        setUserEmail(email)
        setUserRole(role)
        setIsLoggedIn(true)
        setCurrentPage('dashboard')
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')

        setUserEmail('')
        setUserRole('EMPLOYEE')
        setIsLoggedIn(false)
        setCurrentPage('dashboard')
    }

    const goToDashboard = () => {
        setCurrentPage('dashboard')
    }

    const goToEmployees = () => {
        if (!canManageEmployees) {
            setCurrentPage('dashboard')
            return
        }

        setCurrentPage('employees')
    }

    const goToAttendance = () => {
        setCurrentPage('attendance')
    }

    const goToLeave = () => {
        setCurrentPage('leave')
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />
    }

    return (
        <NavigationContext.Provider
            value={{
                onDashboardClick: goToDashboard,
                onEmployeesClick: goToEmployees,
                onAttendanceClick: goToAttendance,
                onLeaveClick: goToLeave
            }}
        >
            {currentPage === 'employees' && canManageEmployees ? (
                <Employees
                    email={userEmail}
                    onDashboardClick={goToDashboard}
                    onLogout={handleLogout}
                    onAttendanceClick={goToAttendance}
                    onLeaveClick={goToLeave}
                />
            ) : currentPage === 'attendance' ? (
                <Attendance
                    email={userEmail}
                    onDashboardClick={goToDashboard}
                    onEmployeesClick={goToEmployees}
                    onLogout={handleLogout}
                    onLeaveClick={goToLeave}
                />
            ) : currentPage === 'leave' ? (
                <LeaveManagement
                    email={userEmail}
                    role={userRole}
                    onDashboardClick={goToDashboard}
                    onEmployeesClick={goToEmployees}
                    onAttendanceClick={goToAttendance}
                    onLeaveClick={goToLeave}
                    onLogout={handleLogout}
                />
            ) : (
                <Dashboard
                    email={userEmail}
                    onLogout={handleLogout}
                    onEmployeesClick={goToEmployees}
                    onAttendanceClick={goToAttendance}
                    onLeaveClick={goToLeave}
                />
            )}
        </NavigationContext.Provider>
    )
}

export default App