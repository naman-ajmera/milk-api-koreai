import pkg from "mongoose";

const { connect } = pkg;

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Errro: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
