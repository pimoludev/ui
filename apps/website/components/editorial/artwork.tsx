export function EditorialArtwork({ kind }: { kind: "system" | "palette" | "interaction" }) {
  return <div className={`editorial-art editorial-art--${kind}`} aria-hidden="true">
    <svg viewBox="0 0 560 320" fill="none">
      <path d="M0 80H560M0 160H560M0 240H560M80 0V320M160 0V320M240 0V320M320 0V320M400 0V320M480 0V320" className="editorial-art-grid" />
      {kind === "palette" ? <>
        <rect x="100" y="70" width="270" height="170" rx="20" fill="var(--pimolu-muted)" transform="rotate(-9 100 70)" />
        <rect x="156" y="70" width="270" height="170" rx="20" fill="var(--pimolu-primary)" transform="rotate(7 156 70)" />
        <circle cx="220" cy="156" r="31" fill="var(--pimolu-primary-foreground)" />
        <circle cx="288" cy="165" r="31" fill="var(--pimolu-primary-foreground)" opacity=".65" />
        <circle cx="356" cy="174" r="31" fill="var(--pimolu-primary-foreground)" opacity=".3" />
      </> : kind === "system" ? <>
        <path d="M156 160H404" stroke="var(--pimolu-primary)" strokeWidth="2" strokeDasharray="6 6" />
        {[100, 230, 360].map((x, index) => <g key={x}>
          <rect x={x} y="108" width="100" height="104" rx="16" fill={index === 1 ? "var(--pimolu-primary)" : "var(--pimolu-surface)"} stroke="var(--pimolu-border)" />
          <text x={x + 50} y="168" textAnchor="middle" fill={index === 1 ? "var(--pimolu-primary-foreground)" : "var(--pimolu-foreground)"} fontFamily="monospace" fontSize="20">{["01", "02", "03"][index]}</text>
        </g>)}
      </> : <>
        <rect x="126" y="78" width="308" height="170" rx="20" fill="var(--pimolu-surface)" stroke="var(--pimolu-border)" />
        <rect x="150" y="102" width="260" height="122" rx="10" stroke="var(--pimolu-primary)" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M230 162H330M306 140L330 162L306 184" stroke="var(--pimolu-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="230" cy="162" r="9" fill="var(--pimolu-primary)" />
      </>}
    </svg>
    <span className="editorial-art-label">{kind === "palette" ? "One system. Your identity." : kind === "system" ? "Data → styles → interface" : "Designed for the whole journey."}</span>
  </div>;
}
