import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getVideoById, incrementView, listVideos } from "../features/videos/videoSlice";
import { fetchComments, addComment } from "../features/comments/commentSlice";

export default function Watch() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected } = useSelector(s => s.videos);
  const comments = useSelector(s => s.comments.byVideo[id]?.items || []);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(getVideoById(id)).then(() => dispatch(incrementView(id)));
    dispatch(fetchComments({ videoId: id }));
    dispatch(listVideos({ limit: 12 })); // for up next
  }, [id]);

  const upNext = useSelector(s => s.videos.items.filter(v => v._id !== id));

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(addComment({ videoId: id, text }));
    setText("");
  };

  if (!selected) return <p>Loading...</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 360px", gap: 24 }}>
      <div>
        <video controls style={{ width:"100%", borderRadius: 10, background:"#000" }}
               src={`${import.meta.env.VITE_API_URL}/videos/stream/${selected.videoFileId}`} />
        <h2 style={{ margin: "12px 0 4px" }}>{selected.title}</h2>
        <div className="row" style={{ justifyContent:"space-between", color:"var(--muted)" }}>
          <div>{selected.views} views • {new Date(selected.createdAt).toLocaleDateString()}</div>
          <div className="actions row" style={{ gap:8 }}>
            <button>👍 Like</button>
            <button>👎 Dislike</button>
            <Link to="/upload"><button>Upload</button></Link>
          </div>
        </div>
        <div className="line" />
        <div style={{ whiteSpace:"pre-wrap" }}>{selected.description}</div>
        <div className="line" />
        <form onSubmit={submit} className="row" style={{ gap:8 }}>
          <input placeholder="Add a comment..." value={text} onChange={(e)=>setText(e.target.value)} style={{ flex:1 }} />
          <button type="submit">Comment</button>
        </form>
        <div style={{ marginTop: 12 }}>
          {comments.map(c => (
            <div key={c._id} className="row" style={{ gap:12, padding:"10px 0", borderBottom:"1px solid var(--line)" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"#444" }} />
              <div>
                <div style={{ fontWeight:600 }}>{c?.userId?.username ?? "User"}</div>
                <div>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside>
        <h3 style={{ marginTop:0, marginBottom:12 }}>Up next</h3>
        <div className="grid" style={{ gridTemplateColumns:"1fr", gap:12 }}>
          {upNext.map(v => (
            <Link key={v._id} to={`/watch/${v._id}`} className="row" style={{ gap:12 }}>
              <img className="thumb" style={{ width:180 }} src={`${import.meta.env.VITE_API_URL}/videos/stream/${v.thumbFileId}`} />
              <div>
                <div style={{ fontWeight:600, lineHeight:1.3 }}>{v.title}</div>
                <div style={{ color:"var(--muted)", fontSize:13 }}>{v?.uploader?.username ?? "Channel"}</div>
                <div style={{ color:"var(--muted)", fontSize:12 }}>{v.views} views</div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
