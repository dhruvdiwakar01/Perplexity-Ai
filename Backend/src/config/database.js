import mongoose from "mongoose";

const connectToDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)


}

export default connectToDB;