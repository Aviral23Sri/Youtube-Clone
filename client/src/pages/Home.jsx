import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listVideos } from "../features/videos/videoSlice";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, page, pages } = useSelector(s => s.videos);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(listVideos({ q, category, page: 1, limit: 12 }));
  }, [q, category, dispatch]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option>Programming</option>
          <option>Music</option>
          <option>Gaming</option>
        </select>
      </div>
      {status === "loading" && <p>Loading...</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {items.map(v => (
          <Link key={v._id} to={`/watch/${v._id}`} style={{ border: "1px solid #eee", padding: 8, textDecoration: "none", color: "inherit" }}>
            <div style={{ background: "#ddd", height: 140, display: "grid", placeItems: "center" }}>
              {/* Thumbnail image stream endpoint */}
              <img
                alt="thumb"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={`${import.meta.env.VITE_API_URL}/videos/stream/${v.thumbFileId}`}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <h4>{v.title}</h4>
            <p style={{ margin: 0, color: "#666" }}>{v?.uploader?.username ?? "Unknown"}</p>
            <p style={{ margin: 0, color: "#666" }}>{v.views} views</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
