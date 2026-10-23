import { useEffect, useState } from 'react'
import './EditEmployee.css'

function EditEmployee({ employee, onClose, onEmployeeUpdated }) {
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

    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                phone: employee.phone || '',
                department: employee.department || '',
                jobTitle: employee.jobTitle || '',
                role: employee.role || '',
                joiningDate: employee.joiningDate || '',
                employmentStatus: employee.employmentStatus || ''
            })

            setErrors({})
        }
    }, [employee])

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
        const employmentStatus =
            formData.employmentStatus.trim()

        const namePattern =
            /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/

        const emailPattern =
            /^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/

        const phonePattern =
            /^\+?[0-9][0-9\s()-]*$/

        const jobTitlePattern =
            /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 '&/().,-]*$/

        // First Name
        if (!firstName) {
            newErrors.firstName =
                'First name is required.'
        } else if (!namePattern.test(firstName)) {
            newErrors.firstName =
                'First name can contain only letters, spaces, hyphens or apostrophes.'
        }

        // Last Name
        if (!lastName) {
            newErrors.lastName =
                'Last name is required.'
        } else if (!namePattern.test(lastName)) {
            newErrors.lastName =
                'Last name can contain only letters, spaces, hyphens or apostrophes.'
        }

        // Email
        if (!email) {
            newErrors.email =
                'Email address is required.'
        } else if (/\s/.test(email)) {
            newErrors.email =
                'Email address must not contain spaces.'
        } else if (!emailPattern.test(email)) {
            newErrors.email =
                'Please enter a valid email address, for example name@example.com.'
        }

        // Phone
        if (!phone) {
            newErrors.phone =
                'Phone number is required.'
        } else if (!phonePattern.test(phone)) {
            newErrors.phone =
                'Phone number can contain only numbers, spaces, +, hyphens and brackets.'
        } else {
            const digitsOnly =
                phone.replace(/\D/g, '')

            if (
                digitsOnly.length < 9 ||
                digitsOnly.length > 15
            ) {
                newErrors.phone =
                    'Phone number must contain between 9 and 15 digits.'
            } else if (/^(\d)\1+$/.test(digitsOnly)) {
                newErrors.phone =
                    'Please enter a valid phone number.'
            } else if (digitsOnly === '1234567890') {
                newErrors.phone =
                    'Please enter a valid phone number.'
            }
        }

        // Department
        if (!department) {
            newErrors.department =
                'Department is required.'
        }

        // Job Title
        if (!jobTitle) {
            newErrors.jobTitle =
                'Job title is required.'
        } else if (!jobTitlePattern.test(jobTitle)) {
            newErrors.jobTitle =
                'Please enter a valid job title.'
        }

        // Role
        if (!role) {
            newErrors.role =
                'Please select an employee role.'
        }

        // Joining Date
        if (!joiningDate) {
            newErrors.joiningDate =
                'Joining date is required.'
        }

        // Employment Status
        if (!employmentStatus) {
            newErrors.employmentStatus =
                'Please select an employment status.'
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

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token')

            if (!token || token === 'null' || token === 'undefined') {
                setErrors((currentErrors) => ({
                    ...currentErrors,
                    form: 'Your login session has expired. Please log in again.'
                }))
                return
            }

            const cleanedData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                department: formData.department.trim(),
                jobTitle: formData.jobTitle.trim(),
                role: formData.role.trim(),
                joiningDate: formData.joiningDate,
                employmentStatus:
                    formData.employmentStatus.trim()
            }

            const response = await fetch(
                `http://localhost:8080/api/employees/${employee.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    },
                    body: JSON.stringify(cleanedData)
                }
            )

            if (!response.ok) {
                const message =
                    await response.text()

                if (
                    message.toLowerCase().includes(
                        'email address already exists'
                    ) ||
                    message.toLowerCase().includes(
                        'email already exists'
                    )
                ) {
                    setErrors((currentErrors) => ({
                        ...currentErrors,
                        email:
                            'Email address already exists. Please use a different email address.',
                        form: ''
                    }))

                    return
                }

                if (
                    message.toLowerCase().includes(
                        'phone number'
                    ) ||
                    message.toLowerCase().includes(
                        'valid phone number'
                    )
                ) {
                    setErrors((currentErrors) => ({
                        ...currentErrors,
                        phone: message,
                        form: ''
                    }))

                    return
                }

                if (
                    message.toLowerCase().includes(
                        'job title'
                    )
                ) {
                    setErrors((currentErrors) => ({
                        ...currentErrors,
                        jobTitle: message,
                        form: ''
                    }))

                    return
                }

                throw new Error(
                    message ||
                    'Unable to update employee.'
                )
            }

            const updatedEmployee =
                await response.json()

            onEmployeeUpdated(updatedEmployee)
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
        <div className="edit-employee-card">

            <div className="edit-employee-header">

                <div>
                    <h2>Edit Employee</h2>

                    <p>
                        Update employee information
                    </p>
                </div>

                <button
                    type="button"
                    className="edit-employee-close"
                    onClick={onClose}
                    disabled={saving}
                >
                    ×
                </button>

            </div>

            {errors.form && (
                <div className="edit-employee-error">
                    {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="edit-employee-form-grid">

                    {/* First Name */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-firstName">
                            First Name
                        </label>

                        <input
                            id="edit-firstName"
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

                    {/* Last Name */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-lastName">
                            Last Name
                        </label>

                        <input
                            id="edit-lastName"
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

                    {/* Email */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-email">
                            Email Address
                        </label>

                        <input
                            id="edit-email"
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

                    {/* Phone */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-phone">
                            Phone Number
                        </label>

                        <input
                            id="edit-phone"
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

                    {/* Department */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-department">
                            Department
                        </label>

                        <input
                            id="edit-department"
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

                    {/* Job Title */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-jobTitle">
                            Job Title
                        </label>

                        <input
                            id="edit-jobTitle"
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

                    {/* Role */}

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

                    {/* Joining Date */}

                    <div className="edit-employee-field">

                        <label htmlFor="edit-joiningDate">
                            Joining Date
                        </label>

                        <input
                            id="edit-joiningDate"
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

                    {/* Employment Status */}

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

                <div className="edit-employee-actions">

                    <button
                        type="button"
                        className="edit-employee-back"
                        onClick={onClose}
                        disabled={saving}
                    >
                        ← Back to Employees
                    </button>

                    <button
                        type="button"
                        className="edit-employee-cancel"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="edit-employee-save"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : 'Update Employee'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default EditEmployee