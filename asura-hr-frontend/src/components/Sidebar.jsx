
import { useContext } from 'react'
import './Sidebar.css'
import NavigationContext from './NavigationContext'

function Sidebar({
                     activePage = 'dashboard',
                     onDashboardClick,
                     onEmployeesClick,
                     onAttendanceClick,
                     onLeaveClick,
                     onLogout,
                 }) {
    const navigation = useContext(NavigationContext)

    const handleLeaveClick =
        onLeaveClick || navigation.onLeaveClick

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '▦',
            onClick: onDashboardClick,
        },
        {
            id: 'employees',
            label: 'Employees',
            icon: '♙',
            onClick: onEmployeesClick,
        },
        {
            id: 'departments',
            label: 'Departments',
            icon: '▤',
        },
        {
            id: 'leave',
            label: 'Leave Management',
            icon: '▣',
            onClick: handleLeaveClick,
        },
        {
            id: 'attendance',
            label: 'Attendance',
            icon: '◷',
            onClick: onAttendanceClick,
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: '▥',
        },
    ]

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">A</div>

                <div className="sidebar-brand-text">
                    <h2>ASura HR</h2>
                    <p>HR Management</p>
                </div>
            </div>

            <nav className="sidebar-nav" aria-label="Main navigation">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`sidebar-nav-item ${
                            activePage === item.id ? 'active' : ''
                        }`}
                        onClick={item.onClick}
                        disabled={!item.onClick}
                        aria-current={
                            activePage === item.id ? 'page' : undefined
                        }
                    >
                        <span
                            className="sidebar-nav-icon"
                            aria-hidden="true"
                        >
                            {item.icon}
                        </span>

                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button
                    type="button"
                    className="sidebar-nav-item"
                    disabled
                >
                    <span
                        className="sidebar-nav-icon"
                        aria-hidden="true"
                    >
                        ⚙
                    </span>
                    <span>Settings</span>
                </button>

                <button
                    type="button"
                    className="sidebar-nav-item sidebar-logout"
                    onClick={onLogout}
                >
                    <span
                        className="sidebar-nav-icon"
                        aria-hidden="true"
                    >
                        ⇥
                    </span>
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
