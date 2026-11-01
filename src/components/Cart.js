
import React from 'react';

export default function Cart({ cart, onUpdate, onRemove, onCheckout }) {
    const items = cart?.items || [];

    return (
        <section>
            <div className="section-heading">
                <div>
                    <p className="eyebrow">YOUR SELECTION</p>
                    <h2>Shopping cart</h2>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="empty">
                    <h3>Your cart is waiting for a story.</h3>
                    <p className="muted">
                        Add a book from the collection to get started.
                    </p>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-lines">
                        {items.map(item => (
                            <article
                                className="cart-line"
                                key={item.bookId}
                            >
                                <div className="mini-cover">P&P</div>

                                <div className="line-details">
                                    <h3>{item.title}</h3>
                                    <p className="muted">{item.author}</p>
                                    <strong>
                                        ₹{Number(item.unitPrice).toFixed(2)}
                                    </strong>
                                </div>

                                <div className="quantity-control">
                                    <button
                                        type="button"
                                        aria-label={`Decrease quantity of ${item.title}`}
                                        disabled={item.quantity <= 1}
                                        onClick={() =>
                                            onUpdate(
                                                item.bookId,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        type="button"
                                        aria-label={`Increase quantity of ${item.title}`}
                                        disabled={item.quantity >= 99}
                                        onClick={() =>
                                            onUpdate(
                                                item.bookId,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <strong>
                                    ₹{Number(item.lineTotal).toFixed(2)}
                                </strong>

                                <button
                                    className="remove"
                                    type="button"
                                    onClick={() => onRemove(item.bookId)}
                                >
                                    Remove
                                </button>
                            </article>
                        ))}
                    </div>

                    <aside className="summary">
                        <h3>Order summary</h3>

                        <div>
                            <span>Items ({cart.totalItems})</span>
                            <strong>
                                ₹{Number(cart.total).toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>Delivery</span>
                            <strong>Free</strong>
                        </div>

                        <hr />

                        <div className="grand">
                            <span>Total</span>
                            <strong>
                                ₹{Number(cart.total).toFixed(2)}
                            </strong>
                        </div>

                        <button
                            className="primary full"
                            type="button"
                            onClick={onCheckout}
                        >
                            Place order
                        </button>

                        <small className="muted">
                            Checkout creates an order; no payment is
                            collected in this kata.
                        </small>
                    </aside>
                </div>
            )}
        </section>
    );
}
