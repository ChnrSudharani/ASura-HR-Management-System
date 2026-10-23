
import { useState } from 'react'
import '../App.css'

function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const newErrors = {}
        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            newErrors.email = 'Email address is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(
                'http://localhost:8080/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        email: trimmedEmail,
                        password,
                        rememberMe
                    })
                }
            )

            let data = {}

            try {
                data = await response.json()
            } catch {
                data = {}
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Invalid email or password')
                }

                throw new Error(
                    data.message ||
                    data.error ||
                    `Login failed (HTTP ${response.status}). Please try again.`
                )
            }

            if (!data.token || !data.email || !data.role) {
                throw new Error(
                    'The server response is missing login details. Please check the backend response.'
                )
            }

            const user = {
                id: data.id,
                email: data.email,
                role: data.role
            }

            // Clear any previous login before storing the new session.
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')

            // Remember Me persists across browser restarts.
            // Otherwise, store the login in the current browser session.
            const storage = rememberMe
                ? localStorage
                : sessionStorage

            storage.setItem('token', data.token)
            storage.setItem('user', JSON.stringify(user))

            setErrors({})
            onLogin(user.email)
        } catch (error) {
            if (
                error instanceof TypeError &&
                error.message.toLowerCase().includes('fetch')
            ) {
                setErrors({
                    general:
                        'Cannot connect to the server. Check that the Spring Boot backend is running on port 8080.'
                })
            } else if (error instanceof TypeError) {
                setErrors({
                    general:
                        'Unable to connect to the server. Check your connection and backend CORS settings.'
                })
            } else {
                setErrors({
                    general:
                        error.message || 'Unable to sign in. Please try again.'
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="brand">
                    <div className="brand-logo">A</div>
                    <h1>ASura HR</h1>
                    <p>HR Management System</p>
                </div>

                <div className="welcome">
                    <h2>Welcome back</h2>
                    <p>Sign in to access your HR dashboard</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value)
                                setErrors((previous) => ({
                                    ...previous,
                                    email: '',
                                    general: ''
                                }))
                            }}
                            className={errors.email ? 'input-error' : ''}
                            autoComplete="username"
                            disabled={isLoading}
                        />

                        {errors.email && (
                            <p className="error-message">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                    setErrors((previous) => ({
                                        ...previous,
                                        password: '',
                                        general: ''
                                    }))
                                }}
                                className={
                                    errors.password ? 'input-error' : ''
                                }
                                autoComplete="current-password"
                                disabled={isLoading}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                                disabled={isLoading}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="error-message">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {errors.general && (
                        <p className="error-message" role="alert">
                            {errors.general}
                        </p>
                    )}

                    <div className="login-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(event.target.checked)
                                }
                                disabled={isLoading}
                            />
                            <span>Remember me</span>
                        </label>

                        <a
                            href="#forgot-password"
                            onClick={(event) => {
                                event.preventDefault()
                                setErrors({
                                    general:
                                        'Password resets are managed by HR Admin. Please contact your HR administrator.'
                                })
                            }}
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2026 ASura HR. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Login
