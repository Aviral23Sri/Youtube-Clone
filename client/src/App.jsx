import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container main">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
