
import { useState } from 'react'
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
    const [resetEmail, setResetEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showResetPassword, setShowResetPassword] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const [resetMessage, setResetMessage] = useState('')
    const [resetError, setResetError] = useState(false)

    // Read the signed-in user's stored role.
    const storedUser = (() => {
        try {
            const savedUser =
                localStorage.getItem('user') ||
                sessionStorage.getItem('user')

            return savedUser ? JSON.parse(savedUser) : null
        } catch {
            return null
        }
    })()

    const isHrAdmin =
        storedUser?.role?.toUpperCase() === 'HR_ADMIN'

    const handlePasswordReset = async (event) => {
        event.preventDefault()

        setResetMessage('')
        setResetError(false)

        const trimmedEmail = resetEmail.trim()

        if (!trimmedEmail) {
            setResetError(true)
            setResetMessage('Please enter the user email address.')
            return
        }

        if (!newPassword || newPassword.length < 8) {
            setResetError(true)
            setResetMessage(
                'The new password must contain at least 8 characters.'
            )
            return
        }

        const token =
            localStorage.getItem('token') ||
            sessionStorage.getItem('token')

        if (!token) {
            setResetError(true)
            setResetMessage(
                'Your session has expired. Please sign in again.'
            )
            return
        }

        setIsResetting(true)

        try {
            const response = await fetch(
                'http://localhost:8080/api/admin/users/password',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        email: trimmedEmail,
                        newPassword,
                    }),
                }
            )

            const responseText = await response.text()

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        'Your session has expired. Please sign in again.'
                    )
                }

                if (response.status === 403) {
                    throw new Error(
                        'You are not authorised to reset passwords.'
                    )
                }

                throw new Error(
                    responseText ||
                    `Password reset failed (HTTP ${response.status}).`
                )
            }

            setResetError(false)
            setResetMessage(
                'Password reset successfully. The user can now sign in with the new password.'
            )
            setResetEmail('')
            setNewPassword('')
            setShowResetPassword(false)
        } catch (error) {
            setResetError(true)
            setResetMessage(
                error instanceof TypeError
                    ? 'Cannot connect to the backend. Check that Spring Boot is running.'
                    : error.message || 'Unable to reset the password.'
            )
        } finally {
            setIsResetting(false)
        }
    }

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

                    {isHrAdmin && (
                        <div
                            className="dashboard-panel"
                            style={{ marginTop: '24px' }}
                        >
                            <div className="panel-header">
                                <div>
                                    <h3>Reset User Password</h3>
                                    <p>
                                        Set a new password for an existing
                                        user account.
                                    </p>
                                </div>
                            </div>

                            {!showResetPassword ? (
                                <button
                                    type="button"
                                    className="quick-action"
                                    onClick={() => {
                                        setShowResetPassword(true)
                                        setResetMessage('')
                                        setResetError(false)
                                    }}
                                >
                                    <span>🔐</span>
                                    <div>
                                        <strong>Reset Password</strong>
                                        <small>
                                            Enter the user's email and new
                                            password
                                        </small>
                                    </div>
                                </button>
                            ) : (
                                <form
                                    onSubmit={handlePasswordReset}
                                    className="password-reset-form"
                                >
                                    <div className="form-group">
                                        <label htmlFor="reset-email">
                                            User email address
                                        </label>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            value={resetEmail}
                                            onChange={(event) =>
                                                setResetEmail(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter existing user's email"
                                            autoComplete="off"
                                            required
                                            disabled={isResetting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="new-password">
                                            New password
                                        </label>
                                        <input
                                            id="new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(event) =>
                                                setNewPassword(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter new password"
                                            autoComplete="new-password"
                                            minLength={8}
                                            required
                                            disabled={isResetting}
                                        />
                                        <small>
                                            Must contain at least 8 characters.
                                        </small>
                                    </div>

                                    {resetMessage && (
                                        <p
                                            className={
                                                resetError
                                                    ? 'error-message'
                                                    : 'success-message'
                                            }
                                            role="status"
                                        >
                                            {resetMessage}
                                        </p>
                                    )}

                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            className="login-button"
                                            disabled={isResetting}
                                        >
                                            {isResetting
                                                ? 'Resetting...'
                                                : 'Reset Password'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowResetPassword(false)
                                                setResetEmail('')
                                                setNewPassword('')
                                                setResetMessage('')
                                                setResetError(false)
                                            }}
                                            disabled={isResetting}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default Dashboard
