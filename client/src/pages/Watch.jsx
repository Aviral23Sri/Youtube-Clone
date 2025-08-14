import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideoById, incrementView } from "../features/videos/videoSlice";
import { fetchComments, addComment, deleteComment } from "../features/comments/commentSlice";
import { useParams } from "react-router-dom";
import { useState } from "react";

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

  return selected ? (
    <div>
      <video
        style={{ width: "100%", maxHeight: 480, background: "#000" }}
        src={`${import.meta.env.VITE_API_URL}/videos/stream/${selected.videoFileId}`}
        controls
      />
      <h2>{selected.title}</h2>
      <p>{selected.description}</p>
      <p>Views: {selected.views}</p>
      <hr />
      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Post</button>
      </form>
      <div style={{ marginTop: 12 }}>
        {comments.map(c => (
          <div key={c._id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
            <strong>{c?.userId?.username ?? "User"}</strong>
            <p style={{ margin: "4px 0" }}>{c.text}</p>
            <button onClick={() => dispatch(deleteComment(c._id))}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
