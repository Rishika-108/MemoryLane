import express from 'express'
import { registerUser, loginUser, getProfile } from '../Controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser)
userRouter.get('/profile', authMiddleware, getProfile);
export default userRouter;