import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ display: "flex", gap: 16, padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/">MiniTube</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/login">Login</Link>
      </header>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
