
import { useEffect, useState } from 'react'
import './Employees.css'
import AddEmployee from './AddEmployee'
import EditEmployee from './EditEmployee'
import DeleteEmployee from './DeleteEmployee'

function Employees() {

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

            const token = localStorage.getItem('token')

            const response = await fetch(
                'http://localhost:8080/api/employees',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Unable to load employees')
            }

            const data = await response.json()

            setEmployees(data)

        } catch (err) {

            setError(err.message)

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    const filteredEmployees = employees.filter((employee) => {

        const search = searchTerm.toLowerCase()

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

    return (
        <div className="employees-page">

            <div className="employees-header">

                <div>
                    <h1>Employees</h1>

                    <p>
                        Manage your organisation's employees
                    </p>
                </div>

                <button
                    className="add-employee-button"
                    onClick={() => {
                        setShowForm(true)
                        setError('')
                    }}
                >
                    + Add Employee
                </button>

            </div>

            {error && (
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
                            newEmployee
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

                            <thead>

                                <tr>
                                    <th>Employee</th>
                                    <th>Department</th>
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
                                            colSpan="7"
                                            className="empty-employees"
                                        >
                                            {employees.length === 0
                                                ? 'No employees found'
                                                : 'No employees match your search'
                                            }
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

                                                    <div>

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
                                                {employee.department || '-'}
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
    employee.employmentStatus
        ?.toLowerCase()
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

        </div>
    )
}

export default Employees

