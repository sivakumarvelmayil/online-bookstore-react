
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrders, setExpandedOrders] = useState([]);

    async function fetchOrders() {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/api/orders');
            setOrders(response.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load your orders. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    function toggleOrder(orderId) {
        setExpandedOrders(previous =>
            previous.includes(orderId)
                ? previous.filter(id => id !== orderId)
                : [...previous, orderId]
        );
    }

    function formatPrice(amount) {
        return `₹${Number(amount || 0).toFixed(2)}`;
    }

    function formatDate(date) {
        if (!date) return 'Date unavailable';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date unavailable';
        }

        return parsedDate.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getStatusClass(status) {
        switch (String(status || '').toUpperCase()) {
            case 'COMPLETED':
            case 'DELIVERED':
                return 'status-success';

            case 'PENDING':
                return 'status-pending';

            case 'CANCELLED':
            case 'FAILED':
                return 'status-cancelled';

            case 'PROCESSING':
            case 'CONFIRMED':
                return 'status-processing';

            default:
                return 'status-default';
        }
    }

    if (loading) {
        return (
            <section className="orders-section">
                <p className="eyebrow">YOUR READING JOURNEY</p>
                <h2>Order history</h2>
                <div className="orders-loading">
                    Loading your orders...
                </div>
            </section>
        );
    }

    return (
        <section className="orders-section">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">YOUR READING JOURNEY</p>
                    <h2>Order history</h2>
                    <p className="muted">
                        Keep track of all your book purchases.
                    </p>
                </div>

                <span className="muted">
                    {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
            </div>

            {error && (
                <div className="orders-error" role="alert">
                    <p>{error}</p>
                    <button
                        type="button"
                        className="primary"
                        onClick={fetchOrders}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!error && orders.length === 0 && (
                <div className="empty">
                    <h3>No orders yet.</h3>
                    <p className="muted">
                        Your future purchases will appear here.
                    </p>
                </div>
            )}

            {!error && orders.length > 0 && (
                <div className="orders-list">
                    {orders.map(order => {
                        const isExpanded = expandedOrders.includes(order.id);
                        const itemCount = (order.items || []).reduce(
                            (total, item) => total + Number(item.quantity || 0),
                            0
                        );

                        return (
                            <article className="order-card" key={order.id}>
                                <div className="order-head">
                                    <div>
                                        <p className="eyebrow">ORDER</p>
                                        <h3>#{order.id}</h3>
                                        <p className="muted">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="order-total">
                                        <span className={`status ${getStatusClass(order.status)}`}>
                                            {order.status || 'Unknown'}
                                        </span>

                                        <strong>
                                            {formatPrice(order.total)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="order-summary-row">
                                    <span className="muted">
                                        {itemCount} {itemCount === 1 ? 'book' : 'books'}
                                    </span>

                                    <button
                                        type="button"
                                        className="link"
                                        onClick={() => toggleOrder(order.id)}
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded
                                            ? 'Hide details'
                                            : 'View details'}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="order-items">
                                        <h4>Order items</h4>

                                        {(order.items || []).map((item, index) => (
                                            <div
                                                className="order-item"
                                                key={item.bookId ?? index}
                                            >
                                                <div>
                                                    <strong>{item.title}</strong>
                                                    <p className="muted">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                                <strong>
                                                    {formatPrice(item.lineTotal)}
                                                </strong>
                                            </div>
                                        ))}

                                        <div className="order-final-total">
                                            <span>Total</span>
                                            <strong>
                                                {formatPrice(order.total)}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
