import { useEffect, useState } from "react";
import { IconChevronDown } from "./Icons";

const readName = () => localStorage.getItem("player_name") || "Akanksha";

export default function Navbar() {
  const [name, setName] = useState(readName);

  // Settings fires this event when the name is saved, so the bar updates without a refresh
  useEffect(() => {
    const refresh = () => setName(readName());
    window.addEventListener("player-name-change", refresh);
    return () => window.removeEventListener("player-name-change", refresh);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-spark">✦</div>
      <span className="topbar-welcome">
        Welcome back, <strong>{name}</strong>!
      </span>
      <span className="topbar-divider" />
      <span className="topbar-tagline">Let's improve your negotiation skills today.</span>

      <div className="topbar-user">
        <div className="topbar-avatar">{name.charAt(0).toUpperCase()}</div>
        <span className="topbar-chevron">
          <IconChevronDown />
        </span>
      </div>
    </header>
  );
}