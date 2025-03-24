 import mongoose from "mongoose"


 export const connectDB = async ()=>{
            const connect = await mongoose.connect(process.env.MONGO_URI)
            try {
                console.log(`Mongo DB connected : ${connect.connection.host}`);
                
            } catch (error) {
                console.log(error);
                
            }
 }