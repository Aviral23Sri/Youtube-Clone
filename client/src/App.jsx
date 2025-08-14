import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Filters from "./components/Filters";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Auth from "./pages/Auth";
import Channel from "./pages/Channel";
import Upload from "./pages/Upload";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Filters />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
