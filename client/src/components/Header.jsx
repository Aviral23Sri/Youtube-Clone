import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../features/ui/uiSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listVideos } from "../features/videos/videoSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    navigate("/");
    dispatch(listVideos({ q, category: cat, page: 1, limit: 12 }));
  };

  return (
    <header className="header">
      <div className="container row" style={{ justifyContent: "space-between", height: 56 }}>
        <div className="row">
          <button onClick={() => dispatch(toggleSidebar())} title="Menu">☰</button>
          <Link to="/" className="row" style={{ fontWeight: 700, marginLeft: 8 }}>MiniTube</Link>
        </div>
        <form onSubmit={onSearch} className="row" style={{ flex: 1, maxWidth: 720 }}>
          <input
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <select value={cat} onChange={(e)=>setCat(e.target.value)} style={{ borderRadius: 0 }}>
            <option value="">All</option>
            <option>Programming</option><option>Music</option><option>Gaming</option>
          </select>
          <button type="submit" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>Search</button>
        </form>
        <div className="row">
          {user ? (
            <div className="row" title={user.username} style={{ padding: "6px 10px", background:"#222", borderRadius: 20 }}>
              <span style={{ width:28, height:28, borderRadius:"50%", background:"#444", display:"grid", placeItems:"center" }}>
                {user.username?.[0]?.toUpperCase() ?? "U"}
              </span>
              <span>{user.username}</span>
            </div>
          ) : (
            <Link to="/login"><button>Sign in</button></Link>
          )}
        </div>
      </div>
    </header>
  );
}
