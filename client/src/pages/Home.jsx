import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listVideos } from "../features/videos/videoSlice";
import { Link } from "react-router-dom";
import Watch from "./Watch";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.videos);

  useEffect(() => {
    dispatch(listVideos({ page:1, limit:24 }));
  }, [dispatch]);

  return (
    <div className="grid video-grid">
      {status === "loading" && <p>Loading...</p>}
      {<Watch/>}
    </div>
  );
}
