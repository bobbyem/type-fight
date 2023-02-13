import mongoose, { Error } from "mongoose";
import env from "../env/env";
import colors from "colors"

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(env.mongo_url ?? "", {
      dbName: "typefight"
    })
    console.log(colors.bgGreen(`Connected to DB url: ${connect.connection.host}`));
  } catch (error: any) {
    console.log(colors.bgRed(error))
  }
  
}

