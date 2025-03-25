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
  deleteGroupExpense,
  editGroupExpense
} from "../controllers/groupsController.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.use(checkToken);

router
.get("/", checkToken, getUserGroups)
.post("/create", checkToken, createGroup)
.patch("/:groupId", checkToken, updateGroup)
.delete("/:groupId", checkToken, deleteGroup) // delete a group (only by the creator)
.post("/:groupId/add", checkToken, addMember) // only by creator
.delete("/:groupId/remove", checkToken, removeMemberFromGroup) // only by creator

// Group expenses
.get("/:groupId/expenses", checkToken, getGroupExpenses)
.post("/:groupId/add-expense", checkToken, addGroupExpense) // only by creator
.patch("/:groupId/edit-expense/:expenseId", checkToken, editGroupExpense) // only by creator
.delete("/:groupId/delete-expense/:expenseId", checkToken, deleteGroupExpense); //only by creator 

export default router;

