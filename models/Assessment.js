import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    goal: [{ type: String }],           
    struggleWeek: String,             
    bedInTime: String,                 
    bedOutTime: String,                 
    sleepDuration: Number               
}, { timestamps: true });

export const Assessment = mongoose.model("Assessment", assessmentSchema);
