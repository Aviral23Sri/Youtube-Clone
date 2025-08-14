import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getChannelById, createChannel } from "../features/channels/channelSlice";
import { listVideos, deleteVideo, updateVideo } from "../features/videos/videoSlice";

export default function Channel() {
  const { id } = useParams(); // channel id
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { current } = useSelector(s => s.channel);
  const { items } = useSelector(s => s.videos);
  const isOwner = user && current && user._id === current.owner?._id;

  const [form, setForm] = useState({ name:"", description:"" });

  useEffect(() => {
    if (id) {
      dispatch(getChannelById(id));
      dispatch(listVideos({ page:1, limit:50 })); // You may filter by channel on backend if available
    }
  }, [id, dispatch]);

  if (!id) {
    // Create channel flow if none
    return (
      <div style={{ maxWidth:600 }}>
        <h2>Create Channel</h2>
        {!user && <p>Please sign in first.</p>}
        <form onSubmit={(e)=>{e.preventDefault(); if(!user) return; dispatch(createChannel({ name: form.name, description: form.description }));}}>
          <input placeholder="Channel name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
          <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} style={{ marginTop:8 }} />
          <div style={{ marginTop:8 }}><button type="submit" disabled={!user}>Create</button></div>
        </form>
      </div>
    );
  }

  return current ? (
    <div>
      <div style={{ marginBottom:16 }}>
        <h2 style={{ marginBottom:4 }}>{current.name}</h2>
        <div className="subtle">{current.description}</div>
      </div>
      <div className="grid video-grid">
        {items
          .filter(v => v?.uploader?._id === current.owner?._id) // simple owner filter; ideally filter by channelId if modeled
          .map(v => (
          <div key={v._id} className="card">
            <Link to={`/watch/${v._id}`}>
              <img className="thumb" src={`${import.meta.env.VITE_API_URL}/videos/stream/${v.thumbFileId}`} alt={v.title} />
            </Link>
            <div className="title" style={{ marginTop:8 }}>{v.title}</div>
            {isOwner && (
              <div className="row" style={{ gap:8, marginTop:8 }}>
                <button onClick={() => {
                  const t = prompt("New title", v.title);
                  if (t !== null) dispatch(updateVideo({ id: v._id, data: { title: t } }));
                }}>Edit</button>
                <button onClick={() => dispatch(deleteVideo(v._id))}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading channel...</p>
  );
}
