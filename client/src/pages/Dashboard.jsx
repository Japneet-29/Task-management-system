import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [filter, setFilter] = useState("All");

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const priorityColor = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-orange-100 text-orange-700",
    Low: "bg-green-100 text-green-700",
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const fetchStats = async () => {
    const res = await API.get("/tasks/stats");
    setStats(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTasks();
        await fetchStats();
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return toast.error("Task title is required");

    try {
      setBtnLoading(true);
      await API.post("/tasks", { title, description, priority, status });
      toast.success("Task added");
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Pending");
      fetchTasks();
      fetchStats();
    } catch {
      toast.error("Failed to add task");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
      fetchStats();
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/tasks/${id}`, { status: newStatus });
      toast.success("Status updated");
      fetchTasks();
      fetchStats();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500 capitalize">{key}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Task */}
        <form
          onSubmit={handleAddTask}
          className="bg-white p-4 rounded shadow mb-6"
        >
          <h3 className="font-semibold mb-3">Add Task</h3>

          <input
            className="w-full border p-2 mb-2 rounded"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-2 mb-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-2">
            <select
              className="border p-2 rounded"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              className="border p-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <button
            disabled={btnLoading}
            className={`mt-3 px-4 py-2 rounded text-white ${
              btnLoading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {btnLoading ? "Adding..." : "Add Task"}
          </button>
        </form>

        {/* Filter */}
        <select
          className="border p-2 mb-4 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Task List */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add your first task to get started 🚀</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks
              .filter((task) => filter === "All" || task.status === filter)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded shadow flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600">{task.description}</p>
                    )}

                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${priorityColor[task.priority]}`}
                      >
                        {task.priority}
                      </span>

                      <span
                        className={`px-2 py-1 rounded text-sm ${statusColor[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task._id, e.target.value)
                      }
                      className="border p-1 text-sm mt-2 rounded"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
