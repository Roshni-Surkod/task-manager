const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Add task button
addTaskBtn.addEventListener("click", addTask);


// Add task using Enter key
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


// Add a new task
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    // Update task counters
    totalTasks.textContent = tasks.length;

    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pendingCount = tasks.length - completedCount;

    pendingTasks.textContent = pendingCount;
    completedTasks.textContent = completedCount;


    // Search text
    const searchText = searchInput.value.toLowerCase();


    // Filter tasks
    let filteredTasks = tasks.filter(function(task) {

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


    // Show message when no task is found
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found
            </div>
        `;

        return;
    }


    // Display filtered tasks
    filteredTasks.forEach(function(task) {

        const taskElement = document.createElement("div");

        taskElement.className = "task";


        if (task.completed) {
            taskElement.classList.add("completed");
        }


        taskElement.innerHTML = `
            <div class="task-left">

                <input 
                    type="checkbox" 
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-text">${task.text}</span>

            </div>


            <div class="task-actions">

                <button 
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button 
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;


        taskList.appendChild(taskElement);
    });
}


// Mark task as completed / pending
function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });


    saveTasks();

    displayTasks();
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });


    saveTasks();

    displayTasks();
}


// Edit task
function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });


    const newText = prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    if (newText.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }


    task.text = newText.trim();

    saveTasks();

    displayTasks();
}


// Search tasks
searchInput.addEventListener("input", displayTasks);


// Filter buttons
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;


        displayTasks();
    });
});


// Display saved tasks when page loads
displayTasks();