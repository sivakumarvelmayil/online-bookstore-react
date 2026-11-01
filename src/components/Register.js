import React,{useState} from 'react';
import api from '../api';
import {errorMessage} from '../App';
export default function Register({onSuccess,onLogin}){
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState('');
 async function submit(e){e.preventDefault();setError('');try{const {data}=await api.post('/api/auth/register',{name,email,password});onSuccess(data);}catch(err){setError(errorMessage(err));}}
 return <form onSubmit={submit}><h2>Create account</h2>{error&&<p role="alert" className="error">{error}</p>}<label>Name<input required maxLength="120" value={name} onChange={e=>setName(e.target.value)}/></label><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required minLength="8" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary full">Register</button><p className="switch">Already registered? <button type="button" className="link" onClick={onLogin}>Sign in</button></p></form>;
}
