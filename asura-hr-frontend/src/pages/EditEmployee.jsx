import { useEffect, useState } from 'react'
import './EditEmployee.css'

function EditEmployee({ employee, onClose, onEmployeeUpdated }) {

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        jobTitle: '',
        role: 'EMPLOYEE',
        joiningDate: '',
        employmentStatus: 'ACTIVE'
    })

    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                phone: employee.phone || '',
                department: employee.department || '',
                jobTitle: employee.jobTitle || '',
                role: employee.role || 'EMPLOYEE',
                joiningDate: employee.joiningDate || '',
                employmentStatus: employee.employmentStatus || 'ACTIVE'
            })
        }
    }, [employee])

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setSaving(true)
            setError('')

            const token = localStorage.getItem('token')

            const response = await fetch(
                `http://localhost:8080/api/employees/${employee.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            )

            if (!response.ok) {
                const message = await response.text()

                throw new Error(
                    message || 'Unable to update employee'
                )
            }

            const updatedEmployee = await response.json()

            onEmployeeUpdated(updatedEmployee)

            onClose()

        } catch (err) {
            setError(err.message)

        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="edit-employee-card">

            <div className="edit-employee-header">

                <div>
                    <h2>Edit Employee</h2>
                    <p>Update employee information</p>
                </div>

                <button
                    type="button"
                    className="edit-employee-close"
                    onClick={onClose}
                >
                    ×
                </button>

            </div>

            {error && (
                <div className="edit-employee-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="edit-employee-form-grid">

                    <div className="edit-employee-field">
                        <label htmlFor="edit-firstName">
                            First Name *
                        </label>

                        <input
                            id="edit-firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-lastName">
                            Last Name *
                        </label>

                        <input
                            id="edit-lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-email">
                            Email *
                        </label>

                        <input
                            id="edit-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-phone">
                            Phone
                        </label>

                        <input
                            id="edit-phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-department">
                            Department
                        </label>

                        <input
                            id="edit-department"
                            name="department"
                            type="text"
                            value={formData.department}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-jobTitle">
                            Job Title
                        </label>

                        <input
                            id="edit-jobTitle"
                            name="jobTitle"
                            type="text"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-role">
                            Role
                        </label>

                        <select
                            id="edit-role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="EMPLOYEE">
                                Employee
                            </option>

                            <option value="MANAGER">
                                Manager
                            </option>

                            <option value="HR_ADMIN">
                                HR Admin
                            </option>
                        </select>
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-joiningDate">
                            Joining Date
                        </label>

                        <input
                            id="edit-joiningDate"
                            name="joiningDate"
                            type="date"
                            value={formData.joiningDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="edit-employee-field">
                        <label htmlFor="edit-employmentStatus">
                            Employment Status
                        </label>

                        <select
                            id="edit-employmentStatus"
                            name="employmentStatus"
                            value={formData.employmentStatus}
                            onChange={handleInputChange}
                        >
                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

                            <option value="ON_LEAVE">
                                On Leave
                            </option>
                        </select>
                    </div>

                </div>

                <div className="edit-employee-actions">

                    <button
                        type="button"
                        className="edit-employee-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="edit-employee-save"
                        disabled={saving}
                    >
                        {saving
                            ? 'Updating...'
                            : 'Update Employee'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default EditEmployee