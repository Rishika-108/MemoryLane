import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true},
    email : {type: String, required: true},
    password: {type: String, required: true, unique: true},
    blacklistedDomains: { type: [String], default: ["mail.google.com", "paypal.com", "chase.com", "bankofamerica.com", "wellsfargo.com"] },
})

const userModel = mongoose.model.user || mongoose.model('user', userSchema)

export default userModel;