import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../features/auth/authSlice";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", username: "" });

  const submit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(login({ email: form.email, password: form.password }));
    } else {
      dispatch(register({ username: form.username, email: form.email, password: form.password }));
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <h3>{mode === "login" ? "Login" : "Register"}</h3>
      {mode === "register" && (
        <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      )}
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
    </form>
  );
}
