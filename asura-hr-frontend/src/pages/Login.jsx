
import { useState } from 'react'
import '../App.css'

function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const newErrors = {}

        if (!email.trim()) {
            newErrors.email = 'Email address is required'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        try {
            const response = await fetch(
                'http://localhost:8080/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            )

            if (!response.ok) {
                throw new Error('Invalid email or password')
            }

            const user = await response.json()

            // Store JWT token securely in browser storage
            localStorage.setItem('token', user.token)

            // Store user details for the current session
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: user.id,
                    email: user.email,
                    role: user.role
                })
            )

            onLogin(user.email)

        } catch (error) {
            setErrors({
                password: 'Invalid email or password'
            })
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
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={errors.email ? 'input-error' : ''}
                            autoComplete="email"
                        />

                        {errors.email && (
                            <p className="error-message">{errors.email}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className={errors.password ? 'input-error' : ''}
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword ? 'Hide password' : 'Show password'
                                }
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="error-message">{errors.password}</p>
                        )}
                    </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>

                        <a href="#forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-button">
                        Sign in
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
