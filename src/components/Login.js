
import React, { useState } from 'react';
import api from '../api';
import { errorMessage } from '../App';

export default function Login({ onSuccess, onRegister }) {
    const [email, setEmail] = useState('demo@bookstore.local');
    const [password, setPassword] = useState('Password123!');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function submit(e) {
        e.preventDefault();

        if (loading) return;

        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/api/auth/login', {
                email: email.trim(),
                password
            });

            onSuccess(data);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={submit}>
            <div className="auth-header">
                <p className="eyebrow">WELCOME BACK</p>
                <h2>Sign in</h2>
                <p className="muted">
                    Continue your reading journey with Book Nest.
                </p>
            </div>

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            <label htmlFor="email">
                Email address
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </label>

            <label htmlFor="password">
                Password
                <div className="password-wrapper">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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
            </label>

            <button
                type="submit"
                className="primary full"
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="switch">
                New here?{' '}
                <button
                    type="button"
                    className="link"
                    onClick={onRegister}
                >
                    Create an account
                </button>
            </p>
        </form>
    );
}
