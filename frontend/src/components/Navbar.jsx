import { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "./Icons";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const name = user && user.name ? user.name : "Guest";
  const email = user && user.email ? user.email : "";

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-spark">✦</div>
      <span className="topbar-welcome">
        Welcome, <strong>{name}</strong>!
      </span>
      <span className="topbar-divider" />
      <span className="topbar-tagline">Let's improve your negotiation skills today.</span>

      <div className="topbar-user" ref={ref}>
        <button
          type="button"
          className="nb-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <div className="topbar-avatar">{name.charAt(0).toUpperCase()}</div>
          <span className="topbar-chevron">
            <IconChevronDown />
          </span>
        </button>

        {open && (
          <div className="nb-menu" role="menu">
            <div className="nb-menu-name">{name}</div>
            {email && <div className="nb-menu-email">{email}</div>}
            <button
              type="button"
              role="menuitem"
              className="nb-menu-item"
              onClick={() => {
                setOpen(false);
                if (onLogout) onLogout();
              }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}