import express from "express";
import {
  getAllUsers,
  createUser,
  verifyOTP,
  login,
  logoutUser,
} from "../controllers/users.js";
import { verifyJWT } from "../middlewares/jwtVerify.js";
import {
  blacklistToken,
  checkBlacklitedTokens,
} from "../middlewares/tokenValidation.js";
let router = express.Router();

router.get("/getallusers", checkBlacklitedTokens, verifyJWT, getAllUsers);
router.post("/login", login);
router.post("/createuser", createUser);
router.put("/verifyuser", verifyOTP);
router.put("/logoutuser", logoutUser, blacklistToken);

export default router;
