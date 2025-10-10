import userModel from "../Models/userModel.js"
import jwt from 'jsonwebtoken';


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message: "Unauthorised: No token provided"})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({message: 'Unauthorised: User Not Found'})
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Error: ", error);
        res.status(401).json({message: "Unauthorised: Invalid or expires token"})
    }
}
export default authMiddleware;