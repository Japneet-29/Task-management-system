const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *   post:
 *     summary: Create a new task
 */
router.route("/").post(protect, createTask).get(protect, getTasks);
/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics
 */
router.get("/stats", protect, getTaskStats);
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *   put:
 *     summary: Update task
 *   delete:
 *     summary: Delete task
 */
router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
