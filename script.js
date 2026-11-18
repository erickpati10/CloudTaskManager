import { db, auth, authReady } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskStatus = document.getElementById("taskStatus");

// Store the ID of the task currently being edited
let editingTaskId = null;

// Wait for Firebase Authentication before using Firestore
async function initializeApp() {
  try {
    await authReady;
    await loadTasks();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    taskList.textContent =
      "Unable to connect to Firebase. Check your configuration and authentication settings.";
  }
}

// Add a new task or update an existing one
taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const dueDate = taskDate.value;
  const status = taskStatus.value;

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    alert("Firebase is not connected yet.");
    return;
  }

  try {
    if (editingTaskId) {
      // Update the selected Firestore document
      await updateDoc(doc(db, "tasks", editingTaskId), {
        title,
        description,
        dueDate,
        status,
      });

      editingTaskId = null;
      taskForm.querySelector('button[type="submit"]').textContent = "Add Task";
    } else {
      // Create a document in the cloud database
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        dueDate,
        status,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    taskForm.reset();
    await loadTasks();
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Unable to save task: " + error.message);
  }
});

// Retrieve tasks belonging to the current user
async function loadTasks() {
  const user = auth.currentUser;

  if (!user) {
    taskList.textContent = "You must be signed in to view tasks.";
    return;
  }

  taskList.textContent = "Loading tasks...";

  try {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
    );

    const snapshot = await getDocs(tasksQuery);
    taskList.replaceChildren();

    if (snapshot.empty) {
      taskList.textContent = "No tasks available.";
      return;
    }

    snapshot.forEach((taskDocument) => {
      const task = taskDocument.data();
      const taskId = taskDocument.id;

      // Create a card for every task returned by Firestore
      const card = document.createElement("div");
      card.className = "task-card";

      const title = document.createElement("h3");
      title.textContent = task.title;

      const description = document.createElement("p");
      description.textContent = task.description || "No description";

      const date = document.createElement("p");
      date.textContent = "Due Date: " + (task.dueDate || "Not set");

      const status = document.createElement("span");
      status.className =
        "status " + (task.status === "Completed" ? "completed" : "pending");
      status.textContent = task.status;

      const actions = document.createElement("div");

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        editTask(taskId, task);
      });

      const completeButton = document.createElement("button");
      completeButton.className = "complete-btn";
      completeButton.textContent =
        task.status === "Completed" ? "Mark Pending" : "Complete";

      completeButton.addEventListener("click", () => {
        toggleTaskStatus(taskId, task.status);
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        removeTask(taskId);
      });

      actions.append(editButton, completeButton, deleteButton);
      card.append(title, description, date, status, actions);
      taskList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
    taskList.textContent = "Unable to load tasks: " + error.message;
  }
}

// Fill out the form with the selected task's data
function editTask(taskId, task) {
  editingTaskId = taskId;

  taskTitle.value = task.title || "";
  taskDescription.value = task.description || "";
  taskDate.value = task.dueDate || "";
  taskStatus.value = task.status || "Pending";

  taskForm.querySelector('button[type="submit"]').textContent = "Save Changes";
  taskForm.scrollIntoView({ behavior: "smooth" });
}

// Update a task's status in Firestore
async function toggleTaskStatus(taskId, currentStatus) {
  const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

  try {
    await updateDoc(doc(db, "tasks", taskId), {
      status: newStatus,
    });

    await loadTasks();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Unable to update task.");
  }
}

// Delete a task from the cloud database
async function removeTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    await deleteDoc(doc(db, "tasks", taskId));

    if (editingTaskId === taskId) {
      editingTaskId = null;
      taskForm.reset();
      taskForm.querySelector('button[type="submit"]').textContent = "Add Task";
    }

    await loadTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Unable to delete task.");
  }
}

// Start the application
initializeApp();
