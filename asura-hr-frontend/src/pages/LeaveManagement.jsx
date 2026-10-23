
import { useCallback, useEffect, useMemo, useState } from 'react'
import './LeaveManagement.css'

const API_URL = 'http://localhost:8080/api/leaves'

const leaveTypes = [
    { value: 'ANNUAL', label: 'Annual leave' },
    { value: 'SICK', label: 'Sick leave' },
    { value: 'UNPAID', label: 'Unpaid leave' },
    { value: 'COMPASSIONATE', label: 'Compassionate leave' },
    { value: 'OTHER', label: 'Other' },
]

const emptyForm = {
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: '',
}

function LeaveManagement({
                             email = '',
                             role = 'EMPLOYEE',
                             onDashboardClick,
                             onEmployeesClick,
                             onAttendanceClick,
                             onLeaveClick,
                             onLogout,
                         }) {
    const [requests, setRequests] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [reviewNotes, setReviewNotes] = useState({})

    const normalisedRole = role.toUpperCase()
    const canReview = ['HR_ADMIN', 'MANAGER'].includes(normalisedRole)

    const apiRequest = useCallback(async (url, options = {}) => {
        const token =
            localStorage.getItem('token') ||
            sessionStorage.getItem('token')

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        })

        if (!response.ok) {
            let message = `Request failed (${response.status})`

            try {
                const body = await response.json()
                message = body.message || body.error || message
            } catch {
                // Keep the HTTP status message if the response is not JSON.
            }

            throw new Error(message)
        }

        if (response.status === 204) return null
        return response.json()
    }, [])

    const loadRequests = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const data = await apiRequest(API_URL)
            setRequests(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'Unable to load leave requests.')
        } finally {
            setLoading(false)
        }
    }, [apiRequest])

    useEffect(() => {
        loadRequests()
    }, [loadRequests])

    const filteredRequests = useMemo(() => {
        const term = search.trim().toLowerCase()

        return requests.filter((request) => {
            const matchesSearch = [
                request.employeeEmail,
                request.leaveType,
                request.reason,
                request.status,
            ].some((value) => String(value || '').toLowerCase().includes(term))

            const matchesStatus =
                statusFilter === 'ALL' || request.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [requests, search, statusFilter])

    const counts = useMemo(() => ({
        total: requests.length,
        pending: requests.filter((item) => item.status === 'PENDING').length,
        approved: requests.filter((item) => item.status === 'APPROVED').length,
        rejected: requests.filter((item) => item.status === 'REJECTED').length,
    }), [requests])

    const updateForm = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
        setError('')
        setSuccess('')
    }

    const handleApply = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!form.startDate || !form.endDate || !form.reason.trim()) {
            setError('Complete all required fields before submitting.')
            return
        }

        if (form.endDate < form.startDate) {
            setError('End date cannot be before the start date.')
            return
        }

        if (form.startDate < new Date().toLocaleDateString('en-CA')) {
            setError('Leave cannot start in the past.')
            return
        }

        setSubmitting(true)

        try {
            await apiRequest(API_URL, {
                method: 'POST',
                body: JSON.stringify({
                    leaveType: form.leaveType,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    reason: form.reason.trim(),
                }),
            })

            setForm(emptyForm)
            setShowForm(false)
            setSuccess('Your leave request has been submitted.')
            await loadRequests()
        } catch (err) {
            setError(err.message || 'Unable to submit your leave request.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDecision = async (id, decision) => {
        setError('')
        setSuccess('')

        try {
            await apiRequest(`${API_URL}/${id}/decision`, {
                method: 'PUT',
                body: JSON.stringify({
                    decision,
                    note: reviewNotes[id] || '',
                }),
            })

            setSuccess(`Leave request ${decision.toLowerCase()}.`)
            await loadRequests()
        } catch (err) {
            setError(err.message || 'Unable to review the leave request.')
        }
    }

    const formatDate = (value) => {
        if (!value) return '—'

        return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const formatType = (value) =>
        leaveTypes.find((type) => type.value === value)?.label || value

    return (
        <div className="leave-page">
            <aside className="leave-sidebar">
                <div className="leave-brand">
                    <div className="leave-logo">A</div>
                    <div>
                        <h1>ASura HR</h1>
                        <span>HR Management</span>
                    </div>
                </div>

                <nav className="leave-nav">
                    <button type="button" className="leave-nav-item"
                            onClick={onDashboardClick}>
                        <span>▦</span> Dashboard
                    </button>
                    <button type="button" className="leave-nav-item"
                            onClick={onEmployeesClick}>
                        <span>♙</span> Employees
                    </button>
                    <button type="button" className="leave-nav-item">
                        <span>▤</span> Departments
                    </button>
                    <button type="button" className="leave-nav-item active"
                            aria-current="page" onClick={onLeaveClick}>
                        <span>◷</span> Leave Management
                    </button>
                    <button type="button" className="leave-nav-item"
                            onClick={onAttendanceClick}>
                        <span>✓</span> Attendance
                    </button>
                    <button type="button" className="leave-nav-item">
                        <span>▥</span> Reports
                    </button>
                </nav>

                <div className="leave-sidebar-bottom">
                    <button type="button" className="leave-nav-item">
                        <span>⚙</span> Settings
                    </button>
                    <button type="button"
                            className="leave-nav-item leave-logout"
                            onClick={onLogout}>
                        <span>↪</span> Sign out
                    </button>
                </div>
            </aside>

            <main className="leave-main">
                <header className="leave-header">
                    <div>
                        <button type="button" className="leave-back-button"
                                onClick={onDashboardClick}>
                            ← Back to Dashboard
                        </button>
                        <h2>Leave Management</h2>
                        <p>Apply for leave and manage leave requests</p>
                    </div>
                    <div className="leave-user">
                        <span className="leave-avatar">
                            {(email || 'U').charAt(0).toUpperCase()}
                        </span>
                        <div>
                            <strong>{email || 'User'}</strong>
                            <span>{normalisedRole.replace('_', ' ')}</span>
                        </div>
                    </div>
                </header>

                {error && <div className="leave-alert leave-alert-error"
                               role="alert">{error}</div>}
                {success && <div className="leave-alert leave-alert-success"
                                 role="status">{success}</div>}

                <section className="leave-stats">
                    <article className="leave-stat-card">
                        <span>Total requests</span>
                        <strong>{counts.total}</strong>
                    </article>
                    <article className="leave-stat-card">
                        <span>Pending</span>
                        <strong>{counts.pending}</strong>
                    </article>
                    <article className="leave-stat-card">
                        <span>Approved</span>
                        <strong>{counts.approved}</strong>
                    </article>
                    <article className="leave-stat-card">
                        <span>Rejected</span>
                        <strong>{counts.rejected}</strong>
                    </article>
                </section>

                <section className="leave-panel">
                    <div className="leave-panel-heading">
                        <div>
                            <h3>{canReview ? 'Leave requests' : 'My leave requests'}</h3>
                            <p>
                                {canReview
                                    ? 'Review requests submitted by employees'
                                    : 'Track the status of your submitted requests'}
                            </p>
                        </div>
                        {!showForm && (
                            <button type="button" className="leave-primary-button"
                                    onClick={() => {
                                        setShowForm(true)
                                        setError('')
                                        setSuccess('')
                                    }}>
                                + Apply for leave
                            </button>
                        )}
                    </div>

                    {showForm && (
                        <form className="leave-form" onSubmit={handleApply}>
                            <h3>New leave request</h3>

                            <div className="leave-form-grid">
                                <label>
                                    Leave type *
                                    <select name="leaveType" value={form.leaveType}
                                            onChange={updateForm} required>
                                        {leaveTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Start date *
                                    <input type="date" name="startDate"
                                           min={new Date().toLocaleDateString('en-CA')}
                                           value={form.startDate}
                                           onChange={updateForm} required />
                                </label>

                                <label>
                                    End date *
                                    <input type="date" name="endDate"
                                           min={form.startDate || new Date().toLocaleDateString('en-CA')}
                                           value={form.endDate}
                                           onChange={updateForm} required />
                                </label>

                                <label className="leave-reason-field">
                                    Reason *
                                    <textarea name="reason" value={form.reason}
                                              onChange={updateForm} rows="3"
                                              maxLength="1000"
                                              placeholder="Explain the reason for your leave"
                                              required />
                                </label>
                            </div>

                            <div className="leave-form-actions">
                                <button type="button" className="leave-cancel-button"
                                        onClick={() => {
                                            setShowForm(false)
                                            setForm(emptyForm)
                                            setError('')
                                        }}>
                                    Cancel
                                </button>
                                <button type="submit" className="leave-primary-button"
                                        disabled={submitting}>
                                    {submitting ? 'Submitting…' : 'Submit request'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="leave-filters">
                        <input type="search" value={search}
                               onChange={(event) => setSearch(event.target.value)}
                               placeholder="Search by email, type or reason"
                               aria-label="Search leave requests" />

                        <select value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                aria-label="Filter by status">
                            <option value="ALL">All statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>

                        <button type="button" className="leave-refresh-button"
                                onClick={loadRequests}>
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className="leave-empty-state">Loading leave requests…</p>
                    ) : filteredRequests.length === 0 ? (
                        <p className="leave-empty-state">
                            No leave requests match your search.
                        </p>
                    ) : (
                        <div className="leave-table-wrap">
                            <table className="leave-table">
                                <thead>
                                <tr>
                                    {canReview && <th>Employee</th>}
                                    <th>Leave type</th>
                                    <th>Dates</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    {canReview && <th>Review action</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        {canReview && (
                                            <td>{request.employeeEmail}</td>
                                        )}
                                        <td>{formatType(request.leaveType)}</td>
                                        <td>
                                            <span>{formatDate(request.startDate)}</span>
                                            <span className="leave-date-separator">to</span>
                                            <span>{formatDate(request.endDate)}</span>
                                        </td>
                                        <td className="leave-reason-cell">{request.reason}</td>
                                        <td>
                                                <span className={`leave-status leave-status-${request.status.toLowerCase()}`}>
                                                    {request.status}
                                                </span>
                                            {request.decisionNote && (
                                                <p className="leave-review-note">
                                                    {request.decisionNote}
                                                </p>
                                            )}
                                        </td>
                                        {canReview && (
                                            <td className="leave-review-cell">
                                                {request.status === 'PENDING' ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            aria-label={`Review note for request ${request.id}`}
                                                            placeholder="Optional note"
                                                            value={reviewNotes[request.id] || ''}
                                                            onChange={(event) => setReviewNotes((current) => ({
                                                                ...current,
                                                                [request.id]: event.target.value,
                                                            }))}
                                                        />
                                                        <div className="leave-review-actions">
                                                            <button type="button"
                                                                    className="leave-approve-button"
                                                                    onClick={() => handleDecision(request.id, 'APPROVED')}>
                                                                Approve
                                                            </button>
                                                            <button type="button"
                                                                    className="leave-reject-button"
                                                                    onClick={() => handleDecision(request.id, 'REJECTED')}>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="leave-reviewed-by">
                                                            {request.reviewedBy || 'Reviewed'}
                                                        </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default LeaveManagement
