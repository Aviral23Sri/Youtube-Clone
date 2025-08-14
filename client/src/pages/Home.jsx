import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listVideos } from "../features/videos/videoSlice";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.videos);

  useEffect(() => {
    if (!items.length) dispatch(listVideos({ page:1, limit:24 }));
  }, [dispatch]);

  return (
    <div className="grid video-grid">
      {status === "loading" && <p>Loading...</p>}
      {items.map(v => (
        <Link key={v._id} to={`/watch/${v._id}`} className="card">
          <img className="thumb" src={`${import.meta.env.VITE_API_URL}/videos/stream/${v.thumbFileId}`} alt={v.title} />
          <div className="row" style={{ marginTop: 8, alignItems:"start" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background:"#444" }} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, lineHeight:1.3 }}>{v.title}</div>
              <div style={{ color:"var(--muted)", fontSize:14 }}>{v?.uploader?.username ?? "Channel"}</div>
              <div style={{ color:"var(--muted)", fontSize:13 }}>{v.views} views • {new Date(v.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
