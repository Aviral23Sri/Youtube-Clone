import { useDispatch, useSelector } from "react-redux";
import { listVideos } from "../features/videos/videoSlice";

const categories = ["All","Programming","Music","Gaming","News","Sports","Education","Comedy"];

export default function Sidebar() {
  const open = useSelector(s => s.ui.sidebarOpen);
  const dispatch = useDispatch();
  if (!open) return null;
  return (
    <aside className="sidebar">
      {categories.map(cat => (
        <button
          key={cat}
          className="chip"
          onClick={() => dispatch(listVideos({ category: cat==="All" ? "" : cat, page:1, limit:24 }))}
        >
          {cat}
        </button>
      ))}
    </aside>
  );
}
