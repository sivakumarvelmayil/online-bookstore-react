import React,{useEffect,useState} from 'react';
import api from '../api';
export default function BookList({onAdd}){
 const [books,setBooks]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{api.get('/api/books').then(r=>setBooks(r.data.content)).catch(()=>setError('Unable to load books. Please refresh.')).finally(()=>setLoading(false));},[]);
 if(loading)return <p>Loading books…</p>;if(error)return <p role="alert">{error}</p>;
 return <section><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Books worth keeping</h2></div><span className="muted">{books.length} titles</span></div><div className="book-grid">{books.map(book=><article className="book-card" key={book.id}><div className="book-cover"><span>PAGE<br/>& PINE</span><small>READ · REFLECT · REPEAT</small></div><div className="book-info"><h3>{book.title}</h3><p className="muted">by {book.author}</p><p className="description">{book.description}</p><div className="book-bottom"><strong>₹{Number(book.price).toFixed(2)}</strong><button className="primary" disabled={book.stock===0} onClick={()=>onAdd(book.id)}>{book.stock===0?'Sold out':'Add to cart'}</button></div><small className="muted">{book.stock} in stock</small></div></article>)}</div></section>;
}
