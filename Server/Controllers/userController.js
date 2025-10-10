import userModel from '../Models/userModel.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

 
// Register a User
const registerUser = async (req, res)=> {
    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const existing = await userModel.findOne({email})
        if(existing) return res.status(409).json({success: false, message: "Email already registered"})

            const user = await userModel.create({
                name, email, password: hashedPassword
            })
            res.status(201).json({ success: true,  message: "User registered successfully",
                 user: { id: user._id, name: user.name, email: user.email }
})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Registration failed"})
    }
}

// Log In a User

const loginUser  = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})
        if(!user || !await bcrypt.compare(password, user.password)){
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({success: true, token})
    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, message: "Could Not Login the User"})
    }
}

//Get a profile
const getProfile = async(req, res)=> {
    try {
        res.status(200).json({user: req.user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Could not fetch your profile"})
    }
}

export {loginUser, registerUser, getProfile}