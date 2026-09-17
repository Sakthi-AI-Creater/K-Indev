export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", marginBottom: 20 }}>
      {tabs.map((tab, i) => {
        const isActive = tab === active;
        const isFirst = i === 0;
        const isLast = i === tabs.length - 1;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              padding: "8px 20px",
              fontSize: 13,
              fontFamily: "inherit",
              cursor: "pointer",
              border: "1px solid #d4dbe6",
              borderLeft: i > 0 ? "none" : "1px solid #d4dbe6",
              borderRadius: isFirst ? "7px 0 0 7px" : isLast ? "0 7px 7px 0" : 0,
              background: isActive ? "#1a6fc4" : "#fff",
              color: isActive ? "#fff" : "#4a5568",
              fontWeight: 500,
              transition: "all .15s",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}