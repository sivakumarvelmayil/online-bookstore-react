import React,{useState} from 'react';
import api from '../api';
import {errorMessage} from '../App';
export default function Login({onSuccess,onRegister}){
 const [email,setEmail]=useState('demo@bookstore.local'),[password,setPassword]=useState('Password123!'),[error,setError]=useState('');
 async function submit(e){e.preventDefault();setError('');try{const {data}=await api.post('/api/auth/login',{email,password});onSuccess(data);}catch(err){setError(errorMessage(err));}}
 return <form onSubmit={submit}><h2>Sign in</h2>{error&&<p role="alert" className="error">{error}</p>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary full">Sign in</button><p className="switch">New here? <button type="button" className="link" onClick={onRegister}>Create an account</button></p></form>;
}
