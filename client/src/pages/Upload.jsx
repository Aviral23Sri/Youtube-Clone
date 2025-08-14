import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createVideo } from "../features/videos/videoSlice";

export default function Upload() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnailFile, setThumb] = useState(null);
  const [videoFile, setVideo] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!thumbnailFile || !videoFile) return alert("Select files");
    dispatch(createVideo({ title, description, category, thumbnailFile, videoFile }));
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
      <h3>Upload Video</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDesc(e.target.value)} />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <label>Thumbnail: <input type="file" accept="image/*" onChange={(e) => setThumb(e.target.files[0])} required /></label>
      <label>Video: <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required /></label>
      <button type="submit">Upload</button>
    </form>
  );
}
