import { useRef, useState } from "react";
 
export function PhotoUpload() {
  const [preview, setPreview] = useState(null);
  const ref = useRef();
 
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
 
  const s = {
    card: { width: 116, flexShrink: 0, background: "#fff", borderRadius: 10, border: "1px solid #e4e9f0", padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
    box: {
      width: 90, height: 90, borderRadius: 8, border: "1.5px dashed #c8d2e0",
      background: preview ? "none" : "#f7f9fc",
      backgroundImage: preview ? `url(${preview})` : "none",
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: "pointer", gap: 6,
    },
    label: { fontSize: 10.5, color: "#8a97a8", textAlign: "center", lineHeight: 1.4 },
  };
 
  return (
    <div style={s.card}>
      <div style={s.box} onClick={() => ref.current.click()}>
        {!preview && (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8d2e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style={s.label}>Click to upload photo</span>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}