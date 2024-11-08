"use client";

import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore"; // Import getDoc to fetch the document
import { auth, db } from "../firebase/firebaseconfig"; // Ensure you're importing Firebase correctly
import { FaTrash, FaPen } from "react-icons/fa"; // Import icons for delete and edit actions
import { BsFilter } from "react-icons/bs"; // New attractive filter icon
import { FaCheckSquare, FaSquare } from "react-icons/fa"; // Checkbox icons for marking as completed

const Welcome = () => {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [taskFilter, setTaskFilter] = useState("all"); // 'all', 'completed', 'incomplete'
  const [editTask, setEditTask] = useState(null); // To track the task being edited
  const [updatedTaskText, setUpdatedTaskText] = useState(""); // Text for updated task
  const [filterMenuOpen, setFilterMenuOpen] = useState(false); // To toggle the dropdown menu

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef); // Use getDoc for fetching the document

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.firstName); // Set user name
            setTasks(userData.tasks); // Set tasks
          } else {
            setError("No user data found");
          }
        } catch (error) {
          setError("Error fetching user data");
        }
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []); // Empty dependency array ensures this effect runs once on component mount

  const addTask = async () => {
    if (!newTask) return;
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        tasks: [...tasks, { task: newTask, completed: false }],
      });
      setTasks([...tasks, { task: newTask, completed: false }]);
      setNewTask("");
    } catch (error) {
      setError("Error adding task");
    }
  };

  const deleteTask = async (task) => {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        tasks: arrayRemove(task),
      });
      setTasks(tasks.filter((t) => t !== task)); // Update the local state
    } catch (error) {
      setError("Error deleting task");
    }
  };

  const markAsCompleted = async (task) => {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    try {
      const updatedTasks = tasks.map((t) =>
        t.task === task.task ? { ...t, completed: !t.completed } : t
      );
      await updateDoc(userRef, {
        tasks: updatedTasks,
      });
      setTasks(updatedTasks); // Update the local state
    } catch (error) {
      setError("Error updating task status");
    }
  };

  const updateTask = async (task) => {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    try {
      const updatedTasks = tasks.map((t) =>
        t.task === task.task ? { ...t, task: updatedTaskText } : t
      );
      await updateDoc(userRef, {
        tasks: updatedTasks,
      });
      setTasks(updatedTasks); // Update the local state
      setEditTask(null); // Reset edit mode
      setUpdatedTaskText(""); // Clear the text input
    } catch (error) {
      setError("Error updating task");
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks =
    taskFilter === "all"
      ? tasks
      : tasks.filter((task) => task.completed === (taskFilter === "completed"));

  // Toggle filter menu visibility
  const toggleFilterMenu = () => {
    setFilterMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Welcome, {userName ? userName : "Loading..."}
        </h1>
        <h2 className="text-xl font-medium text-center text-gray-700 mb-6">Your Tasks</h2>

        {/* Task input and Add button */}
        <div className="flex justify-between mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="w-full border-2 border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white py-2 px-3 ml-4 rounded-lg text-xs shadow-lg hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Filter Icon and Dropdown */}
        <div className="relative inline-block mb-6">
          <button
            onClick={toggleFilterMenu}
            className="flex items-center text-gray-800 hover:text-gray-600"
          >
            <BsFilter size={24} />
            <span className="ml-2">Filter</span>
          </button>
          {filterMenuOpen && (
            <div
              className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-10"
            >
              <button
                onClick={() => { setTaskFilter("all"); setFilterMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${taskFilter === "all" ? "bg-blue-100 font-semibold" : ""}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => { setTaskFilter("completed"); setFilterMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${taskFilter === "completed" ? "bg-blue-100 font-semibold" : ""}`}
              >
                Completed
              </button>
              <button
                onClick={() => { setTaskFilter("incomplete"); setFilterMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${taskFilter === "incomplete" ? "bg-blue-100 font-semibold" : ""}`}
              >
                Incomplete
              </button>
            </div>
          )}
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available</p>
        ) : (
          <>
            <ul className="space-y-4">
              {filteredTasks.map((task, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b-2 border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    opacity: task.completed ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {editTask === task ? (
                      <input
                        type="text"
                        value={updatedTaskText || task.task}
                        onChange={(e) => setUpdatedTaskText(e.target.value)}
                        className="border-2 border-gray-300 p-2 rounded-lg"
                      />
                    ) : (
                      <span className="text-lg text-gray-800">{task.task}</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {editTask === task ? (
                      <button
                        onClick={() => updateTask(task)}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg text-xs"
                      >
                        Done
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditTask(task)}
                          className="bg-yellow-500 text-white py-1 px-2 rounded-lg text-xs"
                        >
                          <FaPen />
                        </button>
                        <button
                          onClick={() => deleteTask(task)}
                          className="bg-red-500 text-white py-1 px-2 rounded-lg text-xs"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => markAsCompleted(task)}
                      className="p-2 rounded-full text-blue-500 border-2 border-gray-300 hover:bg-blue-100"
                    >
                      {task.completed ? (
                        <FaCheckSquare size={18} />
                      ) : (
                        <FaSquare size={18} />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
