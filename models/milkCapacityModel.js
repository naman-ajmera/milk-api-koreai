import mongoose from "mongoose";

const milkCapacitySchema = mongoose.Schema({
  milkCapacityDay: {
    type: Number,
    default: process.env.MAX_CAPACITY,
    required: true,
  },
  _id: {
    type: Date,
    required: true,
  },
});

const MilkCapacity = mongoose.model("MilkCapacity", milkCapacitySchema);

export default MilkCapacity;
