import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [filter, setFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/tasks/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTasks();
      await fetchStats();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    await API.post("/tasks", {
      title,
      description,
      priority,
      status,
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("Pending");

    fetchTasks();
    fetchStats();
  };

  const handleDeleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
    fetchStats();
  };

  const updateStatus = async (id, newStatus) => {
    await API.put(`/tasks/${id}`, { status: newStatus });
    fetchTasks();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white p-4 rounded shadow text-center"
            >
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
        <h3 className="font-semibold mb-2">Add Task</h3>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          className="w-full border p-2 mb-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="border p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Task List */}
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet.</p>
      ) : (
        <div className="grid gap-4">
          {tasks
            .filter((task) => filter === "All" || task.status === filter)
            .map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded shadow flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{task.title}</h3>

                  {task.description && (
                    <p className="text-sm text-gray-600">
                      {task.description}
                    </p>
                  )}

                  <p className="text-sm mt-1">
                    Priority:{" "}
                    <span className="font-medium">{task.priority}</span>
                  </p>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task._id, e.target.value)
                    }
                    className="border p-1 text-sm mt-2"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
