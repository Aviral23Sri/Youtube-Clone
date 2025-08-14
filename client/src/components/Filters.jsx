import { listVideos } from "../features/videos/videoSlice";
import { useDispatch } from "react-redux";

const FILTERS = ["All","Programming","Music","Gaming","News","Sports","Education","Comedy"];

export default function Filters() {
  const dispatch = useDispatch();
  return (
    <div className="filters">
      {FILTERS.map(f => (
        <button key={f} className="chip"
          onClick={() => dispatch(listVideos({ category: f==="All" ? "" : f, page:1, limit:24 }))}>
          {f}
        </button>
      ))}
    </div>
  );
}
