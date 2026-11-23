import { useState } from "react";
import { login, register } from "../api";
import "./Login.css";

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let user;
      if (isRegister) {
        user = await register(name, email, password);
      } else {
        user = await login(email, password);
      }
      onAuthenticated(user);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="lg-page">
      <div className="lg-card">
        <h1 className="lg-brand">
          Negotiation <span>Coach</span>
        </h1>
        <p className="lg-sub">
          {isRegister
            ? "Create an account to save your practice history."
            : "Log in to continue your practice."}
        </p>

        <div className="lg-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={"lg-tab" + (!isRegister ? " active" : "")}
            onClick={function () {
              switchMode("login");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={"lg-tab" + (isRegister ? " active" : "")}
            onClick={function () {
              switchMode("register");
            }}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lg-form">
          {isRegister && (
            <label className="lg-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={function (e) {
                  setName(e.target.value);
                }}
                autoComplete="name"
                maxLength={50}
                required
              />
            </label>
          )}

          <label className="lg-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={function (e) {
                setEmail(e.target.value);
              }}
              autoComplete="email"
              required
            />
          </label>

          <label className="lg-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={function (e) {
                setPassword(e.target.value);
              }}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
            />
            {isRegister && <small>At least 8 characters.</small>}
          </label>

          {error && (
            <div className="lg-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="lg-submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
          </button>

          {loading && (
            <p className="lg-hint">
              The server may take up to a minute to wake up on first use.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}