
import { useState } from 'react'
import './DeleteEmployee.css'

function DeleteEmployee({
                            employee,
                            onClose,
                            onEmployeeDeleted
                        }) {
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const handleDelete = async () => {
        try {
            setDeleting(true)
            setError('')

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token')

            if (
                !token ||
                token === 'null' ||
                token === 'undefined'
            ) {
                setError(
                    'Your login session has expired. Please log in again.'
                )
                return
            }

            const response = await fetch(
                `http://localhost:8080/api/employees/${employee.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                const message = await response.text()

                if (response.status === 401 ||
                    response.status === 403) {
                    throw new Error(
                        'You are not authorised to delete this employee, or your login session has expired.'
                    )
                }

                throw new Error(
                    message || 'Unable to delete employee.'
                )
            }

            onEmployeeDeleted(employee.id)
        } catch (err) {
            setError(err.message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="delete-employee-overlay">
            <div className="delete-employee-card">
                <div className="delete-employee-icon">
                    !
                </div>

                <h2>Delete Employee</h2>

                <p>
                    Are you sure you want to delete
                    <strong>
                        {' '}
                        {employee.firstName} {employee.lastName}
                    </strong>
                    ?
                </p>

                <p className="delete-warning">
                    This action cannot be undone.
                </p>

                {error && (
                    <div className="delete-employee-error">
                        {error}
                    </div>
                )}

                <div className="delete-employee-actions">
                    <button
                        type="button"
                        className="delete-cancel-button"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="delete-confirm-button"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? 'Deleting...'
                            : 'Delete Employee'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteEmployee
