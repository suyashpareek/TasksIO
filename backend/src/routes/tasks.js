import express from "express";
import auth from "../middleware/auth.js";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    toggleTaskComplete
} from "../controllers/tasks.js";

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

// NEW route
router.patch("/:id/complete", auth, toggleTaskComplete);

export default router;
