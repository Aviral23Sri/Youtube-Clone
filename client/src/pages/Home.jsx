import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listVideos } from "../features/videos/videoSlice";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.videos);

  useEffect(() => {
    dispatch(listVideos({ page:1, limit:24 }));
  }, [dispatch]);

  return (
    <div className="grid video-grid">
      {status === "loading" && <p>Loading...</p>}
      {items.map(v => (
        <Link key={v._id} to={`/watch/${v._id}`} className="card">
          <img className="thumb" src={`${import.meta.env.VITE_API_URL}/videos/stream/${v.thumbFileId}`} alt={v.title} />
          <div className="meta-row">
            <div className="avatar" />
            <div style={{ flex:1 }}>
              <div className="title">{v.title}</div>
              <div className="subtle">{v?.uploader?.username ?? "Channel"}</div>
              <div className="subtle">{v.views} views</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
