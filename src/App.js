
import React, { useCallback, useEffect, useState } from 'react';

import api from './api';

import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import Cart from './components/Cart';
import Orders from './components/Orders';

const EMPTY_CART = {
    items: [],
    total: 0,
    totalItems: 0
};

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
}

export default function App() {
    const [user, setUser] = useState(getStoredUser);
    const [view, setView] = useState('books');
    const [message, setMessage] = useState('');
    const [cart, setCart] = useState(EMPTY_CART);
    const [authMode, setAuthMode] = useState('login');

    const [cartLoading, setCartLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // ---------------- AUTHENTICATION ----------------

    const onAuthenticated = useCallback((data) => {
        if (!data?.token) {
            setMessage('Authentication failed. No token received.');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));

        setUser(data);
        setAuthMode('login');
        setView('books');
        setMessage(`Welcome, ${data.name || 'Reader'}!`);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setCart(EMPTY_CART);
        setView('books');
        setAuthMode('login');
        setMessage('You have signed out.');
    }, []);

    // ---------------- GLOBAL AUTH ERROR HANDLING ----------------

    useEffect(() => {
        function handleUnauthorized() {
            logout();
            setMessage('Your session has expired. Please sign in again.');
        }

        window.addEventListener(
            'auth:unauthorized',
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                'auth:unauthorized',
                handleUnauthorized
            );
        };
    }, [logout]);

    // ---------------- CART MANAGEMENT ----------------

    const loadCart = useCallback(async () => {
        if (!user) {
            setCart(EMPTY_CART);
            return;
        }

        setCartLoading(true);

        try {
            const { data } = await api.get('/api/cart');
            setCart(data || EMPTY_CART);
        } catch (error) {
            setMessage(errorMessage(error));
        } finally {
            setCartLoading(false);
        }
    }, [user]);

    useEffect(() => {
        let active = true;

        async function fetchCart() {
            if (!user) {
                setCart(EMPTY_CART);
                return;
            }

            setCartLoading(true);

            try {
                const { data } = await api.get('/api/cart');

                if (active) {
                    setCart(data || EMPTY_CART);
                }
            } catch (error) {
                if (active) {
                    setMessage(errorMessage(error));
                }
            } finally {
                if (active) {
                    setCartLoading(false);
                }
            }
        }

        fetchCart();

        return () => {
            active = false;
        };
    }, [user]);

    // Add a book to the cart.
    async function addToCart(bookId) {
        try {
            const { data } = await api.post('/api/cart/items', {
                bookId,
                quantity: 1
            });

            setCart(data || EMPTY_CART);
            setMessage('Book added to cart.');
        } catch (error) {
            setMessage(errorMessage(error));
        }
    }

    // Update quantity or remove the item when quantity reaches zero.
    async function updateQuantity(bookId, quantity) {
        if (quantity <= 0) {
            await removeItem(bookId);
            return;
        }

        try {
            const { data } = await api.put(
                `/api/cart/items/${bookId}`,
                { quantity }
            );

            setCart(data || EMPTY_CART);
            setMessage('Cart updated successfully.');
        } catch (error) {
            setMessage(errorMessage(error));
        }
    }

    // Remove a book from the cart.
    async function removeItem(bookId) {
        try {
            const { data } = await api.delete(
                `/api/cart/items/${bookId}`
            );

            setCart(data || EMPTY_CART);
            setMessage('Book removed from cart.');
        } catch (error) {
            setMessage(errorMessage(error));
        }
    }

    // ---------------- CHECKOUT ----------------

    async function checkout() {
        if (!cart.items.length) {
            setMessage('Your cart is empty.');
            return;
        }

        setCheckoutLoading(true);

        try {
            const { data } = await api.post('/api/orders/checkout');

            setCart(EMPTY_CART);
            setMessage(`Order #${data.id} placed successfully.`);
            setView('orders');
        } catch (error) {
            setMessage(errorMessage(error));
        } finally {
            setCheckoutLoading(false);
        }
    }

    // ---------------- AUTHENTICATION VIEW ----------------

    if (!user) {
        return (
            <main className="auth-shell">
                <section className="auth-card">
                    <h1>Book Nest</h1>

                    <p className="muted">
                        A little corner for readers.
                    </p>

                    {message && (
                        <div role="alert" className="notice">
                            {message}
                            <button
                                aria-label="Dismiss message"
                                onClick={() => setMessage('')}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {authMode === 'login' ? (
                        <Login
                            onSuccess={onAuthenticated}
                            onRegister={() => {
                                setMessage('');
                                setAuthMode('register');
                            }}
                        />
                    ) : (
                        <Register
                            onSuccess={onAuthenticated}
                            onLogin={() => {
                                setMessage('');
                                setAuthMode('login');
                            }}
                        />
                    )}

                    <p className="hint">
                        Demo: demo@bookstore.local / Password123!
                    </p>
                </section>
            </main>
        );
    }

    // ---------------- MAIN APPLICATION ----------------

    return (
        <div className="app-shell">

            <header className="topbar">
                <div>
                    <strong>Book Nest</strong>
                    <span className="tagline">Online Bookstore</span>
                </div>

                <nav aria-label="Main navigation">
                    <button
                        className={view === 'books' ? 'active' : ''}
                        onClick={() => setView('books')}
                    >
                        Books
                    </button>

                    <button
                        className={view === 'cart' ? 'active' : ''}
                        onClick={() => setView('cart')}
                    >
                        Cart ({cart.totalItems})
                    </button>

                    <button
                        className={view === 'orders' ? 'active' : ''}
                        onClick={() => setView('orders')}
                    >
                        Orders
                    </button>

                    <button onClick={logout}>
                        Sign out
                    </button>
                </nav>
            </header>

            <main className="container">

                <section className="welcome">
                    <div>
                        <p className="eyebrow">WELCOME BACK</p>

                        <h1>Find your next favourite.</h1>

                        <p className="muted">
                            Thoughtful reads, delivered one chapter at a time.
                        </p>
                    </div>

                    <div className="welcome-mark">P&P</div>
                </section>

                {message && (
                    <div role="status" className="notice">
                        {message}

                        <button
                            aria-label="Dismiss message"
                            onClick={() => setMessage('')}
                        >
                            ×
                        </button>
                    </div>
                )}

                {view === 'books' && (
                    <BookList
                        onAdd={addToCart}
                        cart={cart}
                        onUpdate={updateQuantity}
                        onRemove={removeItem}
                    />
                )}

                {view === 'cart' && (
                    cartLoading ? (
                        <p>Loading your cart...</p>
                    ) : (
                        <Cart
                            cart={cart}
                            onUpdate={updateQuantity}
                            onRemove={removeItem}
                            onCheckout={checkout}
                            checkoutLoading={checkoutLoading}
                        />
                    )
                )}

                {view === 'orders' && <Orders />}

            </main>

            <footer>
                Book Nest · Built for readers
            </footer>

        </div>
    );
}

// ---------------- COMMON ERROR HANDLER ----------------

export function errorMessage(error) {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.code === 'ECONNABORTED') {
        return 'Request timed out. Please try again.';
    }

    if (!error.response) {
        return 'Unable to connect to the server. Please check your connection.';
    }

    return 'Something went wrong. Please try again.';
}
