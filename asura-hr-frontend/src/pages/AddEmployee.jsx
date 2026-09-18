import { useState } from 'react'
import './AddEmployee.css'

function AddEmployee({ onClose, onEmployeeAdded }) {
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

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

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: '',
            form: ''
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        const firstName = formData.firstName.trim()
        const lastName = formData.lastName.trim()
        const email = formData.email.trim()
        const phone = formData.phone.trim()
        const department = formData.department.trim()
        const jobTitle = formData.jobTitle.trim()
        const role = formData.role.trim()
        const joiningDate = formData.joiningDate.trim()
        const employmentStatus = formData.employmentStatus.trim()

        const namePattern = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/
        const emailPattern = /^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/
        const phonePattern = /^\+?[0-9][0-9\s()-]*$/
        const jobTitlePattern = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 '&/().,-]*$/

        if (!firstName) {
            newErrors.firstName = 'First name is required.'
        } else if (!namePattern.test(firstName)) {
            newErrors.firstName = 'First name can contain only letters, spaces, hyphens or apostrophes.'
        }

        if (!lastName) {
            newErrors.lastName = 'Last name is required.'
        } else if (!namePattern.test(lastName)) {
            newErrors.lastName = 'Last name can contain only letters, spaces, hyphens or apostrophes.'
        }

        if (!email) {
            newErrors.email = 'Email address is required.'
        } else if (/\s/.test(email)) {
            newErrors.email = 'Email address must not contain spaces.'
        } else if (!emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address, for example name@example.com.'
        }

        if (!phone) {
            newErrors.phone = 'Phone number is required.'
        } else if (!phonePattern.test(phone)) {
            newErrors.phone = 'Phone number can contain only numbers, spaces, +, hyphens and brackets.'
        } else {
            const digitsOnly = phone.replace(/\D/g, '')

            if (digitsOnly.length < 9 || digitsOnly.length > 15) {
                newErrors.phone = 'Phone number must contain between 9 and 15 digits.'
            } else if (/^(\d)\1+$/.test(digitsOnly)) {
                newErrors.phone = 'Please enter a valid phone number.'
            } else if (digitsOnly === '1234567890') {
                newErrors.phone = 'Please enter a valid phone number.'
            }
        }

        if (!department) {
            newErrors.department = 'Department is required.'
        }

        if (!jobTitle) {
            newErrors.jobTitle = 'Job title is required.'
        } else if (!jobTitlePattern.test(jobTitle)) {
            newErrors.jobTitle = 'Please enter a valid job title.'
        }

        if (!role) {
            newErrors.role = 'Please select an employee role.'
        }

        if (!joiningDate) {
            newErrors.joiningDate = 'Joining date is required.'
        }

        if (!employmentStatus) {
            newErrors.employmentStatus = 'Please select an employment status.'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const isValid = validateForm()

        if (!isValid) {
            return
        }

        try {
            setSaving(true)

            const token = localStorage.getItem('token')

            const cleanedData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                department: formData.department.trim(),
                jobTitle: formData.jobTitle.trim(),
                role: formData.role.trim(),
                joiningDate: formData.joiningDate,
                employmentStatus: formData.employmentStatus.trim()
            }

            const response = await fetch(
                'http://localhost:8080/api/employees',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    },
                    body: JSON.stringify(cleanedData)
                }
            )

            if (!response.ok) {
                const message = await response.text()

                if (
                    message.toLowerCase().includes('email address already exists') ||
                    message.toLowerCase().includes('email already exists')
                ) {
                    setErrors((currentErrors) => ({
                        ...currentErrors,
                        email: 'Email address already exists. Please use a different email address.',
                        form: ''
                    }))

                    return
                }

                if (
                    message.toLowerCase().includes('phone number') ||
                    message.toLowerCase().includes('valid phone number')
                ) {
                    setErrors((currentErrors) => ({
                        ...currentErrors,
                        phone: message,
                        form: ''
                    }))

                    return
                }

                if (
                    message.toLowerCase().includes('job title')
                ) {
                    setErrors((currentErrors) => ({
                        ...currentErrors,
                        jobTitle: message,
                        form: ''
                    }))

                    return
                }

                throw new Error(
                    message || 'Unable to create employee.'
                )
            }

            const newEmployee = await response.json()

            onEmployeeAdded(newEmployee)
            onClose()

        } catch (err) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                form: err.message
            }))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="add-employee-card">

            <div className="add-employee-header">
                <div>
                    <h2>Add Employee</h2>
                    <p>Enter the employee details below.</p>
                </div>

                <button
                    type="button"
                    className="add-employee-close"
                    onClick={onClose}
                    disabled={saving}
                >
                    ×
                </button>
            </div>

            {errors.form && (
                <div className="add-employee-error">
                    {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="add-employee-form-grid">

                    <div className="add-employee-field">
                        <label htmlFor="firstName">
                            First Name
                        </label>

                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />

                        {errors.firstName && (
                            <div className="field-error">
                                {errors.firstName}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="lastName">
                            Last Name
                        </label>

                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />

                        {errors.lastName && (
                            <div className="field-error">
                                {errors.lastName}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />

                        {errors.email && (
                            <div className="field-error">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />

                        {errors.phone && (
                            <div className="field-error">
                                {errors.phone}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="department">
                            Department
                        </label>

                        <input
                            id="department"
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                        />

                        {errors.department && (
                            <div className="field-error">
                                {errors.department}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="jobTitle">
                            Job Title
                        </label>

                        <input
                            id="jobTitle"
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                        />

                        {errors.jobTitle && (
                            <div className="field-error">
                                {errors.jobTitle}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="role">
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="">
                                Select Role
                            </option>

                            <option value="HR_ADMIN">
                                HR Admin
                            </option>

                            <option value="MANAGER">
                                Manager
                            </option>

                            <option value="EMPLOYEE">
                                Employee
                            </option>
                        </select>

                        {errors.role && (
                            <div className="field-error">
                                {errors.role}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="joiningDate">
                            Joining Date
                        </label>

                        <input
                            id="joiningDate"
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleInputChange}
                        />

                        {errors.joiningDate && (
                            <div className="field-error">
                                {errors.joiningDate}
                            </div>
                        )}
                    </div>

                    <div className="add-employee-field">
                        <label htmlFor="employmentStatus">
                            Employment Status
                        </label>

                        <select
                            id="employmentStatus"
                            name="employmentStatus"
                            value={formData.employmentStatus}
                            onChange={handleInputChange}
                        >
                            <option value="">
                                Select Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>
                        </select>

                        {errors.employmentStatus && (
                            <div className="field-error">
                                {errors.employmentStatus}
                            </div>
                        )}
                    </div>

                </div>

                <div className="add-employee-actions">

                    <button
                        type="button"
                        className="add-employee-cancel"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="add-employee-save"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Add Employee'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default AddEmployee