
const API_URL = "http://localhost:8080/api/tasks";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = [];
let currentFilter = "all";

// Get tasks from backend
function getTasks() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load tasks");
            }
            return response.json();
        })
        .then(data => {
            tasks = data;
            displayTasks();
        })
        .catch(error => {
            console.error("Get tasks error:", error);
            alert("Tasks load nahi hue. Backend check karo.");
        });
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        text: text,
        completed: false
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not add task");
            }
            return response.json();
        })
        .then(data => {
            tasks.push(data);
            taskInput.value = "";
            displayTasks();
        })
        .catch(error => {
            console.error("Add task error:", error);
            alert("Task add nahi hua. Backend check karo.");
        });
}

// Edit task name
function editTask(task) {
    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const trimmedText = newText.trim();

    if (trimmedText === "") {
        alert("Task name cannot be empty.");
        return;
    }

    const updatedTask = {
        text: trimmedText,
        completed: task.completed
    };

    fetch(API_URL + "/" + task.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not edit task");
            }
            return response.json();
        })
        .then(data => {
            tasks = tasks.map(item =>
                item.id === task.id ? data : item
            );
            displayTasks();
        })
        .catch(error => {
            console.error("Edit task error:", error);
            alert("Task edit nahi hua. Backend check karo.");
            getTasks();
        });
}

// Delete task
function deleteTask(id) {
    fetch(API_URL + "/" + id, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not delete task");
            }

            tasks = tasks.filter(task => task.id !== id);
            displayTasks();
        })
        .catch(error => {
            console.error("Delete task error:", error);
            alert("Task delete nahi hua.");
        });
}

// Update task completion
function updateTask(task, isCompleted) {
    const updatedTask = {
        text: task.text,
        completed: isCompleted
    };

    fetch(API_URL + "/" + task.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not update task");
            }
            return response.json();
        })
        .then(data => {
            tasks = tasks.map(item =>
                item.id === task.id ? data : item
            );
            displayTasks();
        })
        .catch(error => {
            console.error("Update task error:", error);
            alert("Task update nahi hua. Please dobara try karo.");
            getTasks();
        });
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    totalTasks.textContent = tasks.length;

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    completedTasks.textContent = completedCount;
    pendingTasks.textContent = tasks.length - completedCount;

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchText);

        if (currentFilter === "pending") {
            return !task.completed && matchesSearch;
        }

        if (currentFilter === "completed") {
            return task.completed && matchesSearch;
        }

        return matchesSearch;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const taskLeft = document.createElement("div");
        taskLeft.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            updateTask(task, checkbox.checked);
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        taskLeft.appendChild(checkbox);
        taskLeft.appendChild(taskText);

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editTask(task);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskElement.appendChild(taskLeft);
        taskElement.appendChild(taskActions);

        taskList.appendChild(taskElement);
    });
}

// Add button
addTaskBtn.addEventListener("click", addTask);

// Enter key to add task
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Search tasks
searchInput.addEventListener("input", displayTasks);

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        displayTasks();
    });
});

// Load tasks when page opens
getTasks();
