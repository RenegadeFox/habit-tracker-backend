import express from "express";
import {
  addActivity,
  getPaginatedActivities,
  getActivitiesByTypeWithPagination,
  getActivityById,
  editActivityById,
  removeActivityById,
} from "../controllers/activityController.js";

const router = express.Router();

// All routes start with http://${URL}/activities

router.post("/", addActivity); // CREATE a new activity
// router.get("/", getActivities); // READ all activities
router.get("/", getPaginatedActivities); // READ paginated activities
router.get("/bytype/:type_id", getActivitiesByTypeWithPagination); // READ all activities of a specific type with pagination
router.get("/:id", getActivityById); // READ a single activity by ID
router.put("/:id", editActivityById); // UPDATE an activity by ID
router.delete("/:id", removeActivityById); // DELETE an activity by ID

export default router;
