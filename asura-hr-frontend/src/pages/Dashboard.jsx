function Dashboard({ email, onLogout, onEmployeesClick }) {
    return (
        <div className="dashboard-page">

            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">A</div>
                    <div>
                        <h1>ASura HR</h1>
                        <span>HR Management</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={onEmployeesClick}
                    >
                        <span>♙</span>
                        Employees
                    </button>

                    <button className="nav-item">
                        <span>▤</span>
                        Departments
                    </button>

                    <button className="nav-item">
                        <span>◷</span>
                        Leave Management
                    </button>

                    <button className="nav-item">
                        <span>✓</span>
                        Attendance
                    </button>

                    <button className="nav-item">
                        <span>▥</span>
                        Reports
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <button className="nav-item">
                        <span>⚙</span>
                        Settings
                    </button>

                    <button className="nav-item logout-item" onClick={onLogout}>
                        <span>↪</span>
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <h2>Dashboard</h2>
                        <p>Welcome back to ASura HR</p>
                    </div>

                    <div className="user-profile">
                        <div className="user-avatar">
                            {email.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>HR Administrator</strong>
                            <span>{email}</span>
                        </div>
                    </div>
                </header>

                <section className="dashboard-content">

                    <div className="welcome-card">
                        <div>
                            <h3>Good morning! 👋</h3>
                            <p>
                                Here's what's happening across your organisation today.
                            </p>
                        </div>
                    </div>

                    <div className="stats-grid">

                        <div className="stat-card">
                            <div className="stat-icon">♙</div>
                            <div>
                                <span>Total Employees</span>
                                <strong>248</strong>
                                <small>+8 this month</small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">✓</div>
                            <div>
                                <span>Present Today</span>
                                <strong>221</strong>
                                <small>89.1% attendance</small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">◷</div>
                            <div>
                                <span>Leave Requests</span>
                                <strong>12</strong>
                                <small>Awaiting approval</small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">▣</div>
                            <div>
                                <span>Departments</span>
                                <strong>14</strong>
                                <small>Across organisation</small>
                            </div>
                        </div>

                    </div>

                    <div className="dashboard-grid">

                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Recent Leave Requests</h3>
                                    <p>Latest employee requests</p>
                                </div>

                                <button>View all</button>
                            </div>

                            <div className="leave-row">
                                <div className="employee-avatar">JD</div>

                                <div className="leave-details">
                                    <strong>John Davis</strong>
                                    <span>Annual Leave · 12 Sep - 16 Sep</span>
                                </div>

                                <span className="status pending">Pending</span>
                            </div>

                            <div className="leave-row">
                                <div className="employee-avatar">SK</div>

                                <div className="leave-details">
                                    <strong>Sarah Khan</strong>
                                    <span>Sick Leave · 10 Sep - 11 Sep</span>
                                </div>

                                <span className="status approved">Approved</span>
                            </div>

                            <div className="leave-row">
                                <div className="employee-avatar">RM</div>

                                <div className="leave-details">
                                    <strong>Robert Miller</strong>
                                    <span>Annual Leave · 18 Sep - 20 Sep</span>
                                </div>

                                <span className="status pending">Pending</span>
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Quick Actions</h3>
                                    <p>Common HR tasks</p>
                                </div>
                            </div>

                            <button className="quick-action">
                                <span>＋</span>
                                <div>
                                    <strong>Add Employee</strong>
                                    <small>Create a new employee record</small>
                                </div>
                            </button>

                            <button className="quick-action">
                                <span>◷</span>
                                <div>
                                    <strong>Review Leave</strong>
                                    <small>Manage pending requests</small>
                                </div>
                            </button>

                            <button className="quick-action">
                                <span>▥</span>
                                <div>
                                    <strong>View Reports</strong>
                                    <small>Access HR reports and analytics</small>
                                </div>
                            </button>
                        </div>

                    </div>

                </section>
            </main>
        </div>
    )
}

export default Dashboard