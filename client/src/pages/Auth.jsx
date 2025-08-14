import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, register as signup } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode,setMode]=useState("login");
  const [f,setF]=useState({ username:"", email:"", password:"" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (mode==="login") {
      await dispatch(login({ email: f.email, password: f.password }));
    } else {
      await dispatch(signup({ username: f.username, email: f.email, password: f.password }));
    }
    nav("/");
  };

  return (
    <div style={{ display:"grid", placeItems:"center", minHeight:"60vh" }}>
      <form onSubmit={submit} style={{ width: 380, background:"var(--card)", padding: 24, borderRadius: 12, border:"1px solid var(--line)" }}>
        <h2 style={{ marginTop:0, marginBottom:12 }}>{mode==="login"?"Sign in":"Create account"}</h2>
        {mode==="register" && (
          <div style={{ marginBottom:12 }}>
            <label>Username</label>
            <input value={f.username} onChange={(e)=>setF({...f, username:e.target.value})} required />
          </div>
        )}
        <div style={{ marginBottom:12 }}>
          <label>Email</label>
          <input type="email" value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} required />
        </div>
        <div style={{ marginBottom:16 }}>
          <label>Password</label>
          <input type="password" value={f.password} onChange={(e)=>setF({...f, password:e.target.value})} required />
        </div>
        <button type="submit" style={{ width:"100%" }}>{mode==="login"?"Sign in":"Register"}</button>
        <div className="row" style={{ justifyContent:"center", marginTop:12 }}>
          <button type="button" onClick={()=>setMode(mode==="login"?"register":"login")}>
            {mode==="login"?"Create account":"Have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
