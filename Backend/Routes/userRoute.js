import express from "express";
import { isAuth, Login, Logout, Register } from "../Controllers/userController.js";
import authUser from "../Middleware/authUser.js";
const userRouter = express.Router();

userRouter.post("/register",Register);
userRouter.post('/login',Login);
userRouter.get('/is-auth',authUser ,isAuth);
userRouter.post('/logout',authUser,Logout);


export default userRouter;