import React,{useEffect,useState} from 'react';
import api from '../api';
export default function Orders(){
 const [orders,setOrders]=useState([]),[error,setError]=useState('');
 useEffect(()=>{api.get('/api/orders').then(r=>setOrders(r.data)).catch(()=>setError('Unable to load your orders.'));},[]);
 return <section><div className="section-heading"><div><p className="eyebrow">YOUR READING JOURNEY</p><h2>Order history</h2></div></div>{error&&<p role="alert">{error}</p>}{orders.length===0&&!error?<div className="empty"><h3>No orders yet.</h3><p className="muted">Your future purchases will appear here.</p></div>:orders.map(o=><article className="order-card" key={o.id}><div className="order-head"><strong>Order #{o.id}</strong><span className="status">{o.status}</span><strong>₹{Number(o.total).toFixed(2)}</strong></div><p className="muted">{new Date(o.createdAt).toLocaleString()}</p>{o.items.map((i,index)=><p key={index}>{i.title} × {i.quantity} — ₹{Number(i.lineTotal).toFixed(2)}</p>)}</article>)}</section>;
}
