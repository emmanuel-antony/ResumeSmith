import mongoose from "mongoose";

const connectDB = async () => {
    const dbURI = process.env.MONGODB_URI || "mongodb+srv://emmanuelantony2005:avei2005@cluster0.oxmhtq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  try {
    await mongoose.connect(dbURI).then(() => {
      console.log("MongoDB connected successfully");})
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
export default connectDB;