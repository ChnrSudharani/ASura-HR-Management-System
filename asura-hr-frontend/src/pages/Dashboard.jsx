
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import './Dashboard.css'

function Dashboard({
                       email,
                       onLogout,
                       onEmployeesClick,
                       onAttendanceClick,
                       onLeaveClick,
                   }) {
    return (
        <div className="dashboard-page">
            <Sidebar
                activePage="dashboard"
                onDashboardClick={() => {}}
                onEmployeesClick={onEmployeesClick}
                onAttendanceClick={onAttendanceClick}
                onLeaveClick={onLeaveClick}
                onLogout={onLogout}
            />

            <main className="dashboard-main">
                <PageHeader
                    title="Dashboard"
                    subtitle="Welcome back to ASura HR"
                    email={email}
                />

                <section className="dashboard-content">
                    <div className="welcome-card">
                        <div>
                            <h3>Good morning! 👋</h3>
                            <p>
                                Here's what's happening across your
                                organisation today.
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

                                <button
                                    type="button"
                                    onClick={onLeaveClick}
                                >
                                    View all
                                </button>
                            </div>

                            <div className="leave-row">
                                <div className="employee-avatar">JD</div>
                                <div className="leave-details">
                                    <strong>John Davis</strong>
                                    <span>
                                        Annual Leave · 12 Sep - 16 Sep
                                    </span>
                                </div>
                                <span className="status pending">
                                    Pending
                                </span>
                            </div>

                            <div className="leave-row">
                                <div className="employee-avatar">SK</div>
                                <div className="leave-details">
                                    <strong>Sarah Khan</strong>
                                    <span>
                                        Sick Leave · 10 Sep - 11 Sep
                                    </span>
                                </div>
                                <span className="status approved">
                                    Approved
                                </span>
                            </div>

                            <div className="leave-row">
                                <div className="employee-avatar">RM</div>
                                <div className="leave-details">
                                    <strong>Robert Miller</strong>
                                    <span>
                                        Annual Leave · 18 Sep - 20 Sep
                                    </span>
                                </div>
                                <span className="status pending">
                                    Pending
                                </span>
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Quick Actions</h3>
                                    <p>Common HR tasks</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="quick-action"
                                onClick={onEmployeesClick}
                            >
                                <span>＋</span>
                                <div>
                                    <strong>Add Employee</strong>
                                    <small>
                                        Create a new employee record
                                    </small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="quick-action"
                                onClick={onLeaveClick}
                            >
                                <span>◷</span>
                                <div>
                                    <strong>Review Leave</strong>
                                    <small>Manage pending requests</small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="quick-action"
                            >
                                <span>▥</span>
                                <div>
                                    <strong>View Reports</strong>
                                    <small>
                                        Access HR reports and analytics
                                    </small>
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
