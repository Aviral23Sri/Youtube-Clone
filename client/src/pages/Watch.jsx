  import YoutubeEmbed from "../components/YoutubeEmbed";

  const EMBEDS = [
    { id: "IYR9h933AF0", title: "Never Gonna Give You Up" },
    { id: "dQw4w9WgXcQ", title: "Another Video" },
    { id: "rokGy0huYEA", title: "Bohemian Rhapsody" },
    { id: "i3tRkbsE54Q", title: "YouTube video player" },
  
    
  ];

  export default function Watch() {
    return (
      <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 12,
      width: "100%", 
    }}
  >
    {EMBEDS.map((v, i) => (
      <div
        key={i}
        style={{
          width: "320px",         // fixed card width
          flex: "0 0 320px",          // don't shrink below this width
        }}
      >
        <div style={{ aspectRatio: "16/9" }}>
          <YoutubeEmbed id={v.id} title={v.title} />
        </div>
        <div className="subtle" style={{ marginTop: 6 }}>
          {v.title}
        </div>
      </div>
    ))}
  </div>

    );
  }
