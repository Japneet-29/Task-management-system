const Task = require("../models/Task");

/**
 * @desc Create a new task
 * @route POST /api/tasks
 */
exports.createTask = async (req, res) => {
  const { title, description, category, priority, status, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    title,
    description,
    category,
    priority,
    status,
    dueDate,
    user: req.user.id,
  });

  res.status(201).json(task);
};

/**
 * @desc Get all tasks for logged-in user
 * @route GET /api/tasks
 */
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
};

/**
 * @desc Get single task
 * @route GET /api/tasks/:id
 */
exports.getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

/**
 * @desc Update task
 * @route PUT /api/tasks/:id
 */
exports.updateTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  Object.assign(task, req.body);
  const updatedTask = await task.save();

  res.json(updatedTask);
};

/**
 * @desc Delete task
 * @route DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
};

/**
 * @desc Get task statistics
 * @route GET /api/tasks/stats
 */
exports.getTaskStats = async (req, res) => {
  const userId = req.user.id;

  const total = await Task.countDocuments({ user: userId });
  const completed = await Task.countDocuments({
    user: userId,
    status: "Completed",
  });
  const pending = await Task.countDocuments({
    user: userId,
    status: "Pending",
  });
  const inProgress = await Task.countDocuments({
    user: userId,
    status: "In Progress",
  });
  const highPriority = await Task.countDocuments({
    user: userId,
    priority: "High",
  });

  res.json({
    total,
    completed,
    pending,
    inProgress,
    highPriority,
  });
};
