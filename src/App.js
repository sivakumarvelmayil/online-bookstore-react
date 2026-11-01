import React, { useEffect, useState } from 'react';
import api from './api';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import Cart from './components/Cart';
import Orders from './components/Orders';

export default function App() {
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('user')||'null'));
  const [view,setView]=useState('books');
  const [message,setMessage]=useState('');
  const [cart,setCart]=useState({items:[],total:0,totalItems:0});
  const [authMode,setAuthMode]=useState('login');

  async function loadCart(){ if(!user)return; try{const {data}=await api.get('/api/cart');setCart(data);}catch(e){setMessage(errorMessage(e));} }
  useEffect(()=>{loadCart();},[user]);
  function onAuthenticated(data){localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data));setUser(data);setAuthMode('login');setMessage('Welcome, '+data.name);}
  function logout(){localStorage.removeItem('token');localStorage.removeItem('user');setUser(null);setCart({items:[],total:0,totalItems:0});setMessage('You have signed out.');}
  async function addToCart(bookId){try{const {data}=await api.post('/api/cart/items',{bookId,quantity:1});setCart(data);setMessage('Book added to cart.');}catch(e){setMessage(errorMessage(e));}}
  async function updateQuantity(bookId,quantity){try{const {data}=await api.put(`/api/cart/items/${bookId}`,{quantity});setCart(data);}catch(e){setMessage(errorMessage(e));}}
  async function removeItem(bookId){try{const {data}=await api.delete(`/api/cart/items/${bookId}`);setCart(data);}catch(e){setMessage(errorMessage(e));}}
  async function checkout(){try{const {data}=await api.post('/api/orders/checkout');setCart({items:[],total:0,totalItems:0});setMessage(`Order #${data.id} placed successfully.`);setView('orders');}catch(e){setMessage(errorMessage(e));}}
  if(!user) return <main className="auth-shell"><section className="auth-card"><h1>Page & Pine</h1><p className="muted">A little corner for readers.</p>{authMode==='login'?<Login onSuccess={onAuthenticated} onRegister={()=>setAuthMode('register')}/>:<Register onSuccess={onAuthenticated} onLogin={()=>setAuthMode('login')}/>}<p className="hint">Demo: demo@bookstore.local / Password123!</p></section></main>;
  return <div className="app-shell"><header className="topbar"><div><strong>Page & Pine</strong><span className="tagline">Online Bookstore</span></div><nav><button className={view==='books'?'active':''} onClick={()=>setView('books')}>Books</button><button className={view==='cart'?'active':''} onClick={()=>setView('cart')}>Cart ({cart.totalItems})</button><button className={view==='orders'?'active':''} onClick={()=>setView('orders')}>Orders</button><button onClick={logout}>Sign out</button></nav></header>
    <main className="container"><div className="welcome"><div><p className="eyebrow">WELCOME BACK</p><h1>Find your next favourite.</h1><p className="muted">Thoughtful reads, delivered one chapter at a time.</p></div><div className="welcome-mark">P&P</div></div>
      {message&&<div role="status" className="notice">{message}<button aria-label="Dismiss message" onClick={()=>setMessage('')}>×</button></div>}
      {view==='books'&&<BookList onAdd={addToCart}/>}
      {view==='cart'&&<Cart cart={cart} onUpdate={updateQuantity} onRemove={removeItem} onCheckout={checkout}/>}
      {view==='orders'&&<Orders/>}
    </main><footer>Page & Pine · Built for readers</footer></div>;
}
export function errorMessage(error){return error.response?.data?.message || 'Something went wrong. Please try again.';}
