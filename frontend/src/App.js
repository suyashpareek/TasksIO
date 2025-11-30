import React, { useState, useEffect } from "react";

// ---------------- Styles OUTSIDE component (fixes cursor disappearing) ----------------
const PAGE = {
  fontFamily: "Inter, sans-serif",
  maxWidth: "360px",
  margin: "60px auto",
  padding: "20px",
};

const INPUT = {
  width: "100%",
  padding: "10px 4px",
  marginBottom: "18px",
  border: "none",
  borderBottom: "1px solid #ccc",
  outline: "none",
  fontSize: "15px",
  background: "transparent",
};

const BUTTON = {
  width: "100%",
  padding: "12px",
  background: "#222",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "8px",
};

const SMALL_BTN = {
  padding: "6px 10px",
  fontSize: "12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  cursor: "pointer",
};

const TOPBAR = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
  alignItems: "center",
};

// -------------------------------------------------------------------------------------

const API = process.env.REACT_APP_API || "http://localhost:5000/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [authMode, setAuthMode] = useState("login");
  const [auth, setAuth] = useState({ name: "", email: "", password: "" });

  const [task, setTask] = useState({ title: "", description: "" });

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  async function loadProfile() {
    const res = await fetch(`${API}/users/me`, {
      headers: { Authorization: "Bearer " + token },
    });

    if (res.ok) {
      setProfile(await res.json());
      loadTasks();
    } else {
      localStorage.removeItem("token");
      setToken("");
    }
  }

  async function loadTasks() {
    const res = await fetch(`${API}/tasks`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) setTasks(await res.json());
  }

  async function register() {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auth),
    });
    const d = await res.json();
    if (d.token) {
      localStorage.setItem("token", d.token);
      setToken(d.token);
    } else alert(JSON.stringify(d));
  }

  async function login() {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: auth.email, password: auth.password }),
    });
    const d = await res.json();
    if (d.token) {
      localStorage.setItem("token", d.token);
      setToken(d.token);
    } else alert(JSON.stringify(d));
  }

  async function createTask() {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      setTask({ title: "", description: "" });
      loadTasks();
    }
  }

  async function toggleComplete(id) {
    await fetch(`${API}/tasks/${id}/complete`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    loadTasks();
  }

  // ---------------- AUTH SCREEN ----------------

  if (!token)
    return (
      <div style={PAGE}>
        <h2 style={{ marginBottom: 30 }}>
          {authMode === "login" ? "Login" : "Register"}
        </h2>

        {authMode === "register" && (
          <input
            style={INPUT}
            placeholder="Name"
            value={auth.name}
            onChange={(e) => setAuth({ ...auth, name: e.target.value })}
          />
        )}

        <input
          style={INPUT}
          placeholder="Email"
          value={auth.email}
          onChange={(e) => setAuth({ ...auth, email: e.target.value })}
        />

        <input
          style={INPUT}
          type="password"
          placeholder="Password"
          value={auth.password}
          onChange={(e) => setAuth({ ...auth, password: e.target.value })}
        />

        <button
          style={BUTTON}
          onClick={authMode === "login" ? login : register}
        >
          {authMode === "login" ? "Login" : "Create Account"}
        </button>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            style={{
              border: "none",
              background: "transparent",
              textDecoration: "underline",
              cursor: "pointer",
              color: "#444",
              fontSize: "14px",
            }}
          >
            {authMode === "login" ? "New user? Register" : "Back to login"}
          </button>
        </div>
      </div>
    );

  // ---------------- DASHBOARD ----------------

  return (
    <div style={PAGE}>
      <div style={TOPBAR}>
        <h3 style={{ margin: 0 }}>Welcome, {profile?.name}</h3>

        <button
          style={{
            ...SMALL_BTN,
            background: "#f55",
            border: "none",
            color: "white",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            setToken("");
          }}
        >
          Logout
        </button>
      </div>

      <h4>Create Task</h4>

      <input
        style={INPUT}
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <input
        style={INPUT}
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <button style={BUTTON} onClick={createTask}>
        Add Task
      </button>

      <h4 style={{ marginTop: 30 }}>Your Tasks</h4>

      {tasks.map((t) => (
        <div
          key={t._id}
          style={{
            padding: "10px 0",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <b
              style={{
                textDecoration: t.completed ? "line-through" : "none",
              }}
            >
              {t.title}
            </b>
            <div style={{ fontSize: "13px", opacity: 0.7 }}>
              {t.description}
            </div>
          </div>

          <button
            style={{
              ...SMALL_BTN,
              background: t.completed ? "#c8ffc8" : "#eee",
            }}
            onClick={() => toggleComplete(t._id)}
          >
            {t.completed ? "Undo" : "Done"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
