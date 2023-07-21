// Creating A UserSchemaaa For data connection
import { Schema, model } from "mongoose";
const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    // Other user properties...
    tasks: [{ type: Schema.Types.ObjectId, ref: "TaskModel" }],
  },
  { timestamps: true }
);

const UserModel = model("UserModel", UserSchema);
export default UserModel;
