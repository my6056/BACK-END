// Creating A TaskSchema For data connection
import { Schema, model } from "mongoose";
const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      require: true,
    },
  },
  { timestamps: true }
);

const TaskModel = model("TaskModel", TaskSchema);
export default TaskModel;
