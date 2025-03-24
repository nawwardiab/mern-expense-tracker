import express from "express";
import { 
  getUserGroups, 
  createGroup, 
  updateGroup, 
  deleteGroup, 
  addMember, 
  removeMemberFromGroup, 
  getGroupExpenses,
  addGroupExpense,
  deleteGroupExpense
} from "../controllers/groupsController.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.use(checkToken);

router
.get("/", checkToken, getUserGroups)
.post("/create", checkToken, createGroup)
.patch("/:groupId", checkToken, updateGroup)
.delete("/:groupId", checkToken, deleteGroup) // delete a group (only by the creator)
.post("/:groupId/add", checkToken, addMember)
.delete("/:groupId/remove", checkToken, removeMemberFromGroup)
.get("/:groupId/expenses", checkToken, getGroupExpenses)
.post("/:groupId/add-expense", checkToken, addGroupExpense)
.delete("/:groupId/delete-expense", checkToken, deleteGroupExpense);

export default router;

