import React, { useState, useEffect } from "react";
import "../styles/wellness-pages.css";

export default function DailyTracker() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Drink 2 liters of water", completed: false },
    { id: 2, text: "Take a 15-minute walk", completed: false },
    { id: 3, text: "Practice deep breathing", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");
  const [streak, setStreak] = useState(0);

  // Load from local storage
  useEffect(() => {
    const savedTasks = localStorage.getItem("daily_tracker_tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedStreak = localStorage.getItem("daily_tracker_streak");
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    // Simple streak check based on date
    const lastActiveDate = localStorage.getItem("daily_tracker_last_date");
    const today = new Date().toDateString();

    if (lastActiveDate !== today) {
      // It's a new day! If they had previous streak, preserve it until they fail?
      // For this simple version, if it's >1 day diff, we could reset it.
      // But let's just make it simple: only increase when they complete a task today.
    }
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem("daily_tracker_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    // Streak logic: update streak if they just completed a task today for the first time
    const today = new Date().toDateString();
    const lastActiveDate = localStorage.getItem("daily_tracker_last_date");
    
    const hasCompletedAny = updatedTasks.some(t => t.completed);

    if (hasCompletedAny && lastActiveDate !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("daily_tracker_streak", newStreak);
      localStorage.setItem("daily_tracker_last_date", today);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  let motivationMessage = "Let's get started!";
  if (totalCount > 0) {
    if (completedCount === totalCount) {
      motivationMessage = "Great job! You completed everything today!";
    } else if (completedCount > 0) {
      motivationMessage = "Good progress, keep going!";
    }
  } else {
    motivationMessage = "Add some tasks to start your journey!";
  }

  return (
    <div className="page-container" style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ fontSize: "2.5rem", color: "#064e3b", marginBottom: "10px" }}>Daily Tracker</h2>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ecfdf5", padding: "15px 20px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #a7f3d0" }}>
        <div style={{ fontSize: "1.2rem", color: "#065f46", fontWeight: "bold" }}>
          🔥 Streak: {streak} {streak === 1 ? "day" : "days"}
        </div>
        <div style={{ color: "#047857" }}>
          You completed {completedCount}/{totalCount} tasks today
        </div>
      </div>

      <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1.3rem", color: "#166534", marginBottom: "10px" }}>{motivationMessage}</h3>
        {/* Progress Bar */}
        {totalCount > 0 && (
          <div style={{ width: "100%", background: "#d1fae5", height: "10px", borderRadius: "5px", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(completedCount / totalCount) * 100}%`, background: "#10b981", transition: "width 0.3s ease-in-out" }}></div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new daily task..."
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} className="btn" style={{ whiteSpace: "nowrap" }}>
          + Add
        </button>
      </div>

      <ul style={{ listStyleType: "none", padding: 0, textAlign: "left" }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => toggleTask(task.id)}
            style={{
              padding: "15px",
              background: task.completed ? "#d1fae5" : "white",
              border: "1px solid",
              borderColor: task.completed ? "#34d399" : "#cbd5e1",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              color: task.completed ? "#065f46" : "#334155",
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              readOnly
              style={{ marginRight: "15px", transform: "scale(1.2)" }}
            />
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
