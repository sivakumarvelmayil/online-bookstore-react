
import React, { useState } from 'react';
import api from '../api';
import { errorMessage } from '../App';

export default function Register({ onSuccess, onLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function submit(e) {
        e.preventDefault();

        if (loading) return;

        setError('');

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            setError('Please enter your name.');
            return;
        }

        if (!trimmedEmail) {
            setError('Please enter your email address.');
            return;
        }

        if (password.length < 8) {
            setError('Password must contain at least 8 characters.');
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post('/api/auth/register', {
                name: trimmedName,
                email: trimmedEmail,
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
                <p className="eyebrow">JOIN BOOK NEST</p>
                <h2>Create account</h2>
                <p className="muted">
                    Create your account and discover your next favourite book.
                </p>
            </div>

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            <label htmlFor="register-name">
                Full name
                <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </label>

            <label htmlFor="register-email">
                Email address
                <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </label>

            <label htmlFor="register-password">
                Password
                <div className="password-wrapper">
                    <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                        minLength={8}
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

                <small className="muted">
                    Password must contain at least 8 characters.
                </small>
            </label>

            <button
                type="submit"
                className="primary full"
                disabled={loading}
            >
                {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="switch">
                Already registered?{' '}
                <button
                    type="button"
                    className="link"
                    onClick={onLogin}
                >
                    Sign in
                </button>
            </p>
        </form>
    );
}
