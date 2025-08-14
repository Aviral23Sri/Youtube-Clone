import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../features/ui/uiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { listVideos } from "../features/videos/videoSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    navigate("/");
    dispatch(listVideos({ q, page:1, limit:24 }));
  };

  return (
    <div className="header">
      <div className="header-inner">
        <div className="row" style={{ gap:12 }}>
          <button onClick={() => dispatch(toggleSidebar())} title="Menu">☰</button>
          <Link to="/" style={{ fontWeight:700 }}>YouTube</Link>
        </div>
        <form onSubmit={onSearch} className="row" style={{ flex:1, maxWidth:720 }}>
          <input
            style={{ flex:1, borderTopRightRadius:0, borderBottomRightRadius:0 }}
            placeholder="Search"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button type="submit" style={{ borderTopLeftRadius:0, borderBottomLeftRadius:0 }}>Search</button>
        </form>
        <div className="row">
          {user ? (
            <div className="row" style={{ gap:8 }}>
              <div className="avatar" style={{ display:"grid", placeItems:"center" }}>
                {user.username?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span>{user.username}</span>
            </div>
          ) : (
            <Link to="/login"><button>Sign in</button></Link>
          )}
        </div>
      </div>
    </div>
  );
}
