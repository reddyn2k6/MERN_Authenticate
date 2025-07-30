import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(" MongoDB connected successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(" MongoDB disconnected.");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/Mern_Auth`);

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
