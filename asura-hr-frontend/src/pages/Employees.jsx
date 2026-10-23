
import { useEffect, useState } from 'react'
import './Employees.css'

import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'

import AddEmployee from './AddEmployee'
import EditEmployee from './EditEmployee'
import DeleteEmployee from './DeleteEmployee'

function Employees({
                       email = '',
                       onDashboardClick,
                       onLogout,
                       onAttendanceClick,
                   }) {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingEmployee, setEditingEmployee] = useState(null)
    const [deletingEmployee, setDeletingEmployee] = useState(null)

    const fetchEmployees = async () => {
        try {
            setLoading(true)
            setError('')

            // Read the token from either browser storage.
            const localToken = localStorage.getItem('token')
            const sessionToken = sessionStorage.getItem('token')

            const isValidStoredToken = (value) =>
                value &&
                value !== 'null' &&
                value !== 'undefined' &&
                value.trim() !== ''

            const token = isValidStoredToken(localToken)
                ? localToken
                : isValidStoredToken(sessionToken)
                    ? sessionToken
                    : null

            if (!token) {
                setError('Your login session is missing. Please sign in again.')
                return
            }

            const response = await fetch(
                'http://localhost:8080/api/employees',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            )

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    response.status === 401
                        ? 'Your login session is invalid or expired. Please sign in again.'
                        : 'Access denied (403). Your token may be invalid, or your account may not have permission to view employees.'
                )
            }

            if (!response.ok) {
                throw new Error(
                    `Unable to load employees. Server returned ${response.status}.`
                )
            }

            const data = await response.json()

            if (!Array.isArray(data)) {
                throw new Error(
                    'The server returned an unexpected employee response.'
                )
            }

            setEmployees(data)
        } catch (err) {
            setError(err.message || 'Unable to load employees.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    const filteredEmployees = employees.filter((employee) => {
        const search = searchTerm.trim().toLowerCase()

        return (
            employee.firstName?.toLowerCase().includes(search) ||
            employee.lastName?.toLowerCase().includes(search) ||
            employee.email?.toLowerCase().includes(search) ||
            employee.department?.toLowerCase().includes(search) ||
            employee.jobTitle?.toLowerCase().includes(search) ||
            employee.role?.toLowerCase().includes(search) ||
            employee.employmentStatus?.toLowerCase().includes(search)
        )
    })

    const isFormOpen =
        showForm || editingEmployee !== null || deletingEmployee !== null

    return (
        <div className="employees-page">
            <Sidebar
                activePage="employees"
                onDashboardClick={onDashboardClick}
                onEmployeesClick={() => {}}
                onAttendanceClick={onAttendanceClick}
                onLogout={onLogout}
            />

            <main className="employees-main">
                <PageHeader
                    title="Employees"
                    subtitle="Manage your organisation's employees"
                    email={email}
                />

                {!isFormOpen && (
                    <div className="employees-header-actions">
                        <button
                            type="button"
                            className="add-employee-button"
                            onClick={() => {
                                setShowForm(true)
                                setError('')
                            }}
                        >
                            + Add Employee
                        </button>
                    </div>
                )}

                {error && !isFormOpen && (
                    <div className="employees-error">
                        {error}
                    </div>
                )}

                {showForm && (
                    <AddEmployee
                        onClose={() => setShowForm(false)}
                        onEmployeeAdded={(newEmployee) => {
                            setEmployees((currentEmployees) => [
                                ...currentEmployees,
                                newEmployee,
                            ])
                            setShowForm(false)
                        }}
                    />
                )}

                {editingEmployee && (
                    <EditEmployee
                        employee={editingEmployee}
                        onClose={() => setEditingEmployee(null)}
                        onEmployeeUpdated={(updatedEmployee) => {
                            setEmployees((currentEmployees) =>
                                currentEmployees.map((employee) =>
                                    employee.id === updatedEmployee.id
                                        ? updatedEmployee
                                        : employee
                                )
                            )
                            setEditingEmployee(null)
                        }}
                    />
                )}

                {deletingEmployee && (
                    <DeleteEmployee
                        employee={deletingEmployee}
                        onClose={() => setDeletingEmployee(null)}
                        onEmployeeDeleted={(deletedEmployeeId) => {
                            setEmployees((currentEmployees) =>
                                currentEmployees.filter(
                                    (employee) =>
                                        employee.id !== deletedEmployeeId
                                )
                            )
                            setDeletingEmployee(null)
                        }}
                    />
                )}

                {!isFormOpen && (
                    <div className="employees-card">
                        <div className="employees-card-header">
                            <h2>Employee Directory</h2>

                            <div className="employee-search">
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    aria-label="Search employees"
                                />
                            </div>
                        </div>

                        {loading && (
                            <div className="employees-message">
                                Loading employees...
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="employees-table-wrapper">
                                <table className="employees-table">
                                    <colgroup>
                                        <col className="employee-column" />
                                        <col className="job-title-column" />
                                        <col className="role-column" />
                                        <col className="status-column" />
                                        <col className="joining-date-column" />
                                        <col className="actions-column" />
                                    </colgroup>

                                    <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Job Title</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joining Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {filteredEmployees.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="empty-employees"
                                            >
                                                {employees.length === 0
                                                    ? 'No employees found'
                                                    : 'No employees match your search'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEmployees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td>
                                                    <div className="employee-info">
                                                        <div className="employee-avatar">
                                                            {employee.firstName
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                            {employee.lastName
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="employee-details">
                                                            <strong>
                                                                {employee.firstName}{' '}
                                                                {employee.lastName}
                                                            </strong>

                                                            <span>
                                                                    {employee.email}
                                                                </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {employee.jobTitle || '-'}
                                                </td>

                                                <td>
                                                    {employee.role || '-'}
                                                </td>

                                                <td>
                                                        <span
                                                            className={`status-badge ${
                                                                employee.employmentStatus?.toLowerCase()
                                                            }`}
                                                        >
                                                            {employee.employmentStatus || '-'}
                                                        </span>
                                                </td>

                                                <td>
                                                    {employee.joiningDate || '-'}
                                                </td>

                                                <td>
                                                    <div className="employee-actions">
                                                        <button
                                                            className="edit-button"
                                                            type="button"
                                                            onClick={() =>
                                                                setEditingEmployee(employee)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            type="button"
                                                            onClick={() =>
                                                                setDeletingEmployee(employee)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Employees
