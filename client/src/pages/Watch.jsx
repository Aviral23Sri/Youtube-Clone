import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getVideoById, incrementView } from "../features/videos/videoSlice";
import { fetchComments, addComment, updateComment, deleteComment } from "../features/comments/commentSlice";

export default function Watch() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected } = useSelector(s => s.videos);
  const comments = useSelector(s => s.comments.byVideo[id]?.items || []);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(getVideoById(id)).then(() => dispatch(incrementView(id)));
    dispatch(fetchComments({ videoId: id }));
  }, [id, dispatch]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(addComment({ videoId: id, text }));
    setText("");
  };

  if (!selected) return <p>Loading...</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns:"1fr 360px", gap:24 }}>
      <div>
        <video
          controls
          style={{ width:"100%", borderRadius:10, background:"#000" }}
          src={`${import.meta.env.VITE_API_URL}/videos/stream/${selected.videoFileId}`}
        />
        <h2 style={{ margin:"12px 0 4px" }}>{selected.title}</h2>
        <div className="row" style={{ justifyContent:"space-between" }}>
          <div className="subtle">{selected?.uploader?.username ?? "Channel"} • {selected.views} views</div>
          <div className="row actions" style={{ gap:8 }}>
            <button>👍 Like</button>
            <button>👎 Dislike</button>
            <Link to="/upload"><button>Upload</button></Link>
          </div>
        </div>
        <div className="section" />
        <div style={{ whiteSpace:"pre-wrap" }}>{selected.description}</div>
        <div className="section" />
        <form onSubmit={submit} className="row" style={{ gap:8 }}>
          <input placeholder="Add a comment..." value={text} onChange={(e)=>setText(e.target.value)} style={{ flex:1 }} />
          <button type="submit">Comment</button>
        </form>
        <div style={{ marginTop:12 }}>
          {comments.map(c => (
            <div key={c._id} style={{ padding:"10px 0", borderBottom:"1px solid var(--line)" }}>
              <div className="row" style={{ gap:12 }}>
                <div className="avatar" />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600 }}>{c?.userId?.username ?? "User"}</div>
                  <div>{c.text}</div>
                  <div className="row" style={{ gap:8, marginTop:6 }}>
                    <button onClick={() => {
                      const t = prompt("Edit comment", c.text);
                      if (t !== null) dispatch(updateComment({ id: c._id, text: t }));
                    }}>Edit</button>
                    <button onClick={() => dispatch(deleteComment(c._id))}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside>
        <h3 style={{ marginTop:0, marginBottom:12 }}>Up next</h3>
        {/* Optionally map some more videos here if needed */}
      </aside>
    </div>
  );
}
