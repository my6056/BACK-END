import TaskModel from "../models/TaskModel.js";
import UserModel from "../models/UserModel.js";

// CREATE NEW TASK

const CreateNewTask = async (req, res, next) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    // Extract the task data from the request body
    const { title, description, due_date, status } = req.body;

    // Validate the required fields
    if (!title || !description || !due_date) {
      return res.json({
        status: false,
        message: "Title, description, and due date are required.",
      });
    }

    // Validate the status field against allowed values
    const allowedStatuses = ["pending", "in_progress", "completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.json({
        status: false,
        message:
          "Invalid status value. Allowed values are 'pending', 'in_progress', and 'completed'.",
      });
    }

    // Check if the user exists in the UserModel
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.json({ status: false, message: "User not found." });
    }
    // Convert the due_date to a Date object if it's a valid date string
    const parsedDueDate = new Date(due_date);
    if (isNaN(parsedDueDate.getTime())) {
      return res.json({ status: false, message: "Invalid due date format." });
    }

    // Create a new task using the TaskModel and the provided user ID
    const newTask = new TaskModel({
      title,
      description,
      due_date: parsedDueDate,
      status: status || "pending",
      user: userId,
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    // Return the saved task as a response
    return res.json({
      status: true,
      task: savedTask,
      message: "Task Created Successfully",
    });
  } catch (error) {
    next(error);
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

/* GET THE SPECIFIC TASK*/

const GetSpecificTaskWthAPI = async (req, res, next) => {
  const { taskID } = req.params;
  try {
    // Find the task with the specified taskID
    const task = await TaskModel.findById(taskID);
    if (!task) {
      return res.json({ status: false, message: "Task not found" });
    }
    // Return the task object
    return res.json({
      status: true,
      message: "task loaded",
      task: task,
    });
  } catch (error) {
    next(error);
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

/* GET ALL TASK WITH USER'S ID*/

const GetAllTaskWithAPI = async (req, res, next) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    const userTasks = await TaskModel.find({ user: userId }).populate("user");

    // If no tasks are found, return an empty array or an appropriate response
    if (!userTasks) {
      return res.json({
        status: true,
        message: "No tasks found for the user.",
      });
    }

    // Return the user's tasks as a response
    return res.json({ status: true, tasks: userTasks, message: "All Tasks" });
  } catch (error) {
    next(error);
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

/* UPDATE THE TASK*/

const UpdateTask = async (req, res, next) => {
  try {
    // Extract the task ID and updated task data from the request body
    const { taskId } = req.params;
    const { title, description, due_date, status } = req.body;

    // Find the task with the provided ID in the database
    const existingTask = await TaskModel.findById(taskId);

    // Check if the task exists
    if (!existingTask) {
      return res.json({ status: false, message: "Task not found." });
    }

    // Update the task properties with the provided data
    if (title) {
      existingTask.title = title;
    }

    if (description) {
      existingTask.description = description;
    }

    if (due_date) {
      // Convert the due_date to a Date object if it's a valid date string
      const parsedDueDate = new Date(due_date);
      if (isNaN(parsedDueDate.getTime())) {
        return res.json({ status: false, message: "Invalid due date format." });
      }
      existingTask.due_date = parsedDueDate;
    }

    if (status) {
      // Validate the status field against allowed values
      const allowedStatuses = ["pending", "in_progress", "completed"];
      if (!allowedStatuses.includes(status)) {
        return res.json({
          status: false,
          message:
            "Invalid status value. Allowed values are 'pending', 'in_progress', and 'completed'.",
        });
      }
      existingTask.status = status;
    }

    // Save the updated task to the database
    const updatedTask = await existingTask.save();

    // Return the updated task as a response
    return res.json({ status: true, task: updatedTask });
  } catch (error) {
    next();
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

/* DELETE THE TASK*/
const DeleteTask = async (req, res, next) => {
  try {
    // Extract the task ID from the request parameters
    const { taskId } = req.params;

    // Find the task with the provided ID in the database
    const existingTask = await TaskModel.findByIdAndDelete(taskId);

    // Check if the task exists
    if (!existingTask) {
      return res.json({ status: false, message: "Task not found." });
    }

    // Return a success message as a response
    return res.json({ status: true, message: "Task deleted successfully." });
  } catch (error) {
    next(error);
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

// export all for global use
export {
  CreateNewTask,
  GetSpecificTaskWthAPI,
  GetAllTaskWithAPI,
  UpdateTask,
  DeleteTask,
};
