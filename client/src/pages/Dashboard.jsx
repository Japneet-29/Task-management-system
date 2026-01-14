import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Dashboard.css";

export default function Dashboard() {
  
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dueDate, setDueDate] = useState("");


  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const fetchStats = async () => {
    const res = await API.get("/tasks/stats");
    setStats(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return toast.error("Title required");

    await API.post("/tasks", { title, description, priority, status, dueDate });
    toast.success("Task added");
    setTitle("");
    setDescription("");
    setDueDate("");
    fetchTasks(); 
    fetchStats();
  };

  const updateStatus = async (id, newStatus) => {
    await API.put(`/tasks/${id}`, { status: newStatus });
    fetchTasks();
    fetchStats();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    await API.delete(`/tasks/${id}`);
    fetchTasks();
    fetchStats();
  };

  return (
    <div className="dashboard">
      <div className="container">

        <div className="header">
          <div>
            <h1>Welcome, {user?.name} 👋</h1>
            <p>Manage your tasks efficiently</p>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>

        <div className="top-section">

          {/* ADD TASK */}
          <div className="card">
            <h3>➕ Add New Task</h3>

            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
  <label>Due Date</label>
  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
  />
</div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <button className="add-btn">Add Task</button>
            </form>
          </div>

          {/* STATS */}
          <div className="card">
            <h3>📊 Task Statistics</h3>
            <div className="stats-grid">
              {stats &&
                Object.entries(stats).map(([k, v]) => (
                  <div className="stat" key={k}>
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* TASK LIST */}
        <h2>Your Tasks</h2>
        <div className="filter-bar">
  <input
    type="text"
    placeholder="Search by title or description..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>

  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
  >
    <option value="All">All Priority</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
</div>

        <div className="tasks">
          {tasks
  .filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  )
  .filter(task =>
    statusFilter === "All" || task.status === statusFilter
  )
  .filter(task =>
    priorityFilter === "All" || task.priority === priorityFilter
  )
  .map(task => (
            <div
              key={task._id}
              className={`task ${task.priority.toLowerCase()}`}
            >
              <p><b>Title:</b> {task.title}</p>
              <p><b>Description:</b> {task.description || "-"}</p>
              <p><b>Priority:</b> {task.priority}</p>
              <p><b>Status:</b> {task.status}</p>
              <p>
  <b>Due Date:</b>{" "}
  {task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "Not set"}
</p>

              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={e => updateStatus(task._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
