
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function BookList({ onAdd, cart, onUpdate }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/books')
            .then(response => setBooks(response.data.content))
            .catch(() => setError('Unable to load books. Please refresh.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading books…</p>;
    if (error) return <p role="alert">{error}</p>;

    const cartItems = cart?.items || [];

    return (
        <section>
            <div className="section-heading">
                <div>
                    <p className="eyebrow">THE COLLECTION</p>
                    <h2>Books worth keeping</h2>
                </div>
                <span className="muted">{books.length} titles</span>
            </div>

            <div className="book-grid">
                {books.map(book => {
                    const cartItem = cartItems.find(
                        item => Number(item.bookId) === Number(book.id)
                    );

                    const quantity = cartItem?.quantity || 0;

                    return (
                        <article className="book-card" key={book.id}>
                            <div className="book-cover">
                                <span>PAGE<br />& PINE</span>
                                <small>READ · REFLECT · REPEAT</small>
                            </div>

                            <div className="book-info">
                                <h3>{book.title}</h3>
                                <p className="muted">by {book.author}</p>
                                <p className="description">
                                    {book.description}
                                </p>

                                <div className="book-bottom">
                                    <strong>
                                        ₹{Number(book.price).toFixed(2)}
                                    </strong>

                                    {quantity === 0 ? (
                                        <button
                                            className="primary"
                                            disabled={book.stock === 0}
                                            onClick={() => onAdd(book.id)}
                                        >
                                            {book.stock === 0
                                                ? 'Sold out'
                                                : 'Add to cart'}
                                        </button>
                                    ) : (
                                        <div className="quantity-control">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onUpdate(
                                                        book.id,
                                                        quantity - 1
                                                    )
                                                }
                                            >
                                                -
                                            </button>

                                            <span>{quantity}</span>

                                            <button
                                                type="button"
                                                disabled={
                                                    quantity >= 99 ||
                                                    quantity >= book.stock
                                                }
                                                onClick={() =>
                                                    onUpdate(
                                                        book.id,
                                                        quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <small className="muted">
                                    {book.stock} in stock
                                </small>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
