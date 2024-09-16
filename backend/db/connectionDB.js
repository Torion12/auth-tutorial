import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connection", connect.connection.host);
  } catch (error) {
    console.log("Error Connection to MongoDb", error.message);
    process.exit(1);
  }
};
