import { useDispatch, useSelector } from "react-redux";
import { listVideos } from "../features/videos/videoSlice";

const cats = ["All","Programming","Music","Gaming","News","Sports","Education","Comedy"];

export default function Sidebar() {
  const dispatch = useDispatch();
  const open = useSelector(s => s.ui.sidebarOpen);

  if (!open) return null;
  return (
    <aside className="sidebar">
      {cats.map(c => (
        <button key={c}
          className="chip"
          onClick={() => dispatch(listVideos({ category: c === "All" ? "" : c }))}>
          {c}
        </button>
      ))}
    </aside>
  );
}
