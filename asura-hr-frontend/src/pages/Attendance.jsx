
import { useState } from 'react'
import './Attendance.css'

import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'

const initialRecords = [
    {
        id: 1,
        name: 'John Davis',
        email: 'john.davis@asura.com',
        date: '2026-10-09',
        checkIn: '09:00',
        checkOut: '17:00',
        status: 'Present',
    },
    {
        id: 2,
        name: 'Sarah Khan',
        email: 'sarah.khan@asura.com',
        date: '2026-10-09',
        checkIn: '09:15',
        checkOut: '17:00',
        status: 'Late',
    },
    {
        id: 3,
        name: 'Robert Miller',
        email: 'robert.miller@asura.com',
        date: '2026-10-09',
        checkIn: '08:55',
        checkOut: '17:05',
        status: 'Present',
    },
    {
        id: 4,
        name: 'Priya Sharma',
        email: 'priya.sharma@asura.com',
        date: '2026-10-09',
        checkIn: '—',
        checkOut: '—',
        status: 'Absent',
    },
    {
        id: 5,
        name: 'David Wilson',
        email: 'david.wilson@asura.com',
        date: '2026-10-09',
        checkIn: '09:05',
        checkOut: '—',
        status: 'Present',
    },
]

function Attendance({
                        email = '',
                        onDashboardClick,
                        onEmployeesClick,
                        onLeaveClick,
                        onLogout,
                    }) {
    const [records, setRecords] = useState(initialRecords)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDate, setSelectedDate] = useState('2026-10-09')
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [checkedInAt, setCheckedInAt] = useState('')
    const [checkedOutAt, setCheckedOutAt] = useState('')

    const currentEmail = email.trim().toLowerCase()

    const todayRecords = records.filter(
        (record) => record.date === selectedDate
    )

    const presentCount = todayRecords.filter(
        (record) => record.status === 'Present'
    ).length

    const lateCount = todayRecords.filter(
        (record) => record.status === 'Late'
    ).length

    const absentCount = todayRecords.filter(
        (record) => record.status === 'Absent'
    ).length

    const filteredRecords = todayRecords.filter((record) => {
        const search = searchTerm.trim().toLowerCase()

        const matchesSearch =
            record.name.toLowerCase().includes(search) ||
            record.email.toLowerCase().includes(search)

        const matchesStatus =
            selectedStatus === 'All' ||
            record.status === selectedStatus

        return matchesSearch && matchesStatus
    })

    const getCurrentTime = () =>
        new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        })

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value)
        setCheckedInAt('')
        setCheckedOutAt('')
    }

    const handleCheckIn = () => {
        if (checkedInAt || !currentEmail) return

        const time = getCurrentTime()

        const existingRecord = records.find(
            (record) =>
                record.email.toLowerCase() === currentEmail &&
                record.date === selectedDate
        )

        const status = time > '09:00' ? 'Late' : 'Present'

        setRecords((previousRecords) => {
            if (existingRecord) {
                return previousRecords.map((record) =>
                    record.id === existingRecord.id
                        ? {
                            ...record,
                            checkIn: time,
                            status,
                        }
                        : record
                )
            }

            return [
                ...previousRecords,
                {
                    id: Date.now(),
                    name: currentEmail.split('@')[0],
                    email: currentEmail,
                    date: selectedDate,
                    checkIn: time,
                    checkOut: '—',
                    status,
                },
            ]
        })

        setCheckedInAt(time)
    }

    const handleCheckOut = () => {
        if (!checkedInAt || checkedOutAt || !currentEmail) return

        const time = getCurrentTime()
        setCheckedOutAt(time)

        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.email.toLowerCase() === currentEmail &&
                record.date === selectedDate
                    ? { ...record, checkOut: time }
                    : record
            )
        )
    }

    return (
        <div className="attendance-page">
            <Sidebar
                activePage="attendance"
                onDashboardClick={onDashboardClick}
                onEmployeesClick={onEmployeesClick}
                onAttendanceClick={() => {}}
                onLeaveClick={onLeaveClick}
                onLogout={onLogout}
            />

            <main className="attendance-main">
                <PageHeader
                    title="Attendance"
                    subtitle="Monitor and manage employee attendance"
                    email={email}
                />

                <section className="attendance-content">
                    <div className="attendance-welcome">
                        <div>
                            <h3>Attendance Overview</h3>
                            <p>
                                Review attendance records and manage
                                your daily check-in and check-out.
                            </p>
                        </div>

                        <div className="attendance-date-control">
                            <label htmlFor="attendance-date">
                                Attendance date
                            </label>
                            <input
                                id="attendance-date"
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>

                    <div className="attendance-stats">
                        <div className="attendance-stat-card">
                            <div className="attendance-stat-icon present-icon">
                                ✓
                            </div>
                            <div>
                                <span>Present</span>
                                <strong>{presentCount}</strong>
                                <small>Employees present</small>
                            </div>
                        </div>

                        <div className="attendance-stat-card">
                            <div className="attendance-stat-icon absent-icon">
                                ✕
                            </div>
                            <div>
                                <span>Absent</span>
                                <strong>{absentCount}</strong>
                                <small>Employees absent</small>
                            </div>
                        </div>

                        <div className="attendance-stat-card">
                            <div className="attendance-stat-icon late-icon">
                                ◷
                            </div>
                            <div>
                                <span>Late Arrivals</span>
                                <strong>{lateCount}</strong>
                                <small>Arrived after 09:00</small>
                            </div>
                        </div>

                        <div className="attendance-stat-card">
                            <div className="attendance-stat-icon total-icon">
                                ♙
                            </div>
                            <div>
                                <span>Total Records</span>
                                <strong>{todayRecords.length}</strong>
                                <small>For selected date</small>
                            </div>
                        </div>
                    </div>

                    <div className="attendance-panel">
                        <div className="attendance-panel-header">
                            <div>
                                <h3>My Attendance</h3>
                                <p>Record your working hours</p>
                            </div>

                            <div className="attendance-clock-actions">
                                <button
                                    type="button"
                                    className="attendance-checkin-btn"
                                    onClick={handleCheckIn}
                                    disabled={
                                        Boolean(checkedInAt) || !currentEmail
                                    }
                                >
                                    {checkedInAt
                                        ? `Checked in at ${checkedInAt}`
                                        : 'Check In'}
                                </button>

                                <button
                                    type="button"
                                    className="attendance-checkout-btn"
                                    onClick={handleCheckOut}
                                    disabled={
                                        !checkedInAt ||
                                        Boolean(checkedOutAt)
                                    }
                                >
                                    {checkedOutAt
                                        ? `Checked out at ${checkedOutAt}`
                                        : 'Check Out'}
                                </button>
                            </div>
                        </div>

                        <p className="attendance-demo-notice">
                            Demo mode: changes are held in page memory
                            and are not saved to the database.
                        </p>
                    </div>

                    <div className="attendance-panel attendance-records-panel">
                        <div className="attendance-panel-header">
                            <div>
                                <h3>Attendance Records</h3>
                                <p>
                                    Search and filter employee records
                                </p>
                            </div>
                        </div>

                        <div className="attendance-filters">
                            <input
                                type="search"
                                placeholder="Search employee or email..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                aria-label="Search employee or email"
                            />

                            <select
                                value={selectedStatus}
                                onChange={(event) =>
                                    setSelectedStatus(event.target.value)
                                }
                                aria-label="Filter by attendance status"
                            >
                                <option value="All">All statuses</option>
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>

                        <div className="attendance-table-wrapper">
                            <table className="attendance-table">
                                <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <tr key={record.id}>
                                            <td>
                                                <div className="attendance-employee-cell">
                                                    <div className="attendance-employee-avatar">
                                                        {record.name
                                                            .split(' ')
                                                            .map((part) =>
                                                                part.charAt(0)
                                                            )
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {record.name}
                                                        </strong>
                                                        <span>
                                                                {record.email}
                                                            </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{record.date}</td>
                                            <td>{record.checkIn}</td>
                                            <td>{record.checkOut}</td>

                                            <td>
                                                    <span
                                                        className={`attendance-status ${record.status.toLowerCase()}`}
                                                    >
                                                        {record.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="attendance-empty"
                                        >
                                            No attendance records found
                                            for the selected filters.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Attendance
