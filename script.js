// Backend API URL
const API_URL = "http://localhost:3001/api/tasks";

// Get Tasks From Backend
async function getTasks() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        console.log(data.tasks);

    } catch (error) {

        console.log("Error connecting to server:", error);

    }

}
// =========================
// DOM Elements
// =========================

const addTaskBtn = document.getElementById("addTaskBtn");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const languageBtn = document.getElementById("languageBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");


// =========================
// Translations
// =========================

const translations = {

    en: {
        menu: "MENU",
        dashboard: "Dashboard",
        allTasks: "All Tasks",
        completed: "Completed",
        pending: "Pending",
        settings: "Settings",
        productivity: "Your productivity partner",
        welcome: "Manage your tasks and stay productive.",
        userRole: "User",
        totalTasks: "Total Tasks",
        allYourTasks: "All your tasks",
        successfullyDone: "Successfully completed",
        waitingTasks: "Tasks waiting for you",
        myTasks: "My Tasks",
        organize: "Organize your daily activities.",
        addTask: "Add Task",
        taskPlaceholder: "Enter task name...",
        low: "Low Priority",
        medium: "Medium Priority",
        high: "High Priority",
        saveTask: "Save Task",
        cancel: "Cancel",
        noDate: "No date",
        empty: "No tasks found!",
        markComplete: "Mark as completed",
        markPending: "Mark as pending",
        delete: "Delete task",
        footer: "All rights reserved.",
        madeWith: "Made with passion.",
        added: "Task added successfully!",
        deleted: "Task deleted successfully!",
        confirmDelete: "Are you sure you want to delete this task?"
    },

    ar: {
        menu: "القائمة",
        dashboard: "لوحة التحكم",
        allTasks: "كل المهام",
        completed: "المهام المكتملة",
        pending: "المهام المعلقة",
        settings: "الإعدادات",
        productivity: "شريكك في الإنتاجية",
        welcome: "نظم مهامك اليومية وكن أكثر إنتاجية.",
        userRole: "مستخدم",
        totalTasks: "إجمالي المهام",
        allYourTasks: "جميع مهامك",
        successfullyDone: "تم إنجازها بنجاح",
        waitingTasks: "مهام في انتظارك",
        myTasks: "مهامي",
        organize: "نظم أنشطتك اليومية.",
        addTask: "إضافة مهمة",
        taskPlaceholder: "اكتب اسم المهمة...",
        low: "أولوية منخفضة",
        medium: "أولوية متوسطة",
        high: "أولوية عالية",
        saveTask: "حفظ المهمة",
        cancel: "إلغاء",
        noDate: "بدون تاريخ",
        empty: "لا توجد مهام!",
        markComplete: "تحديد كمكتملة",
        markPending: "إعادتها لمعلقة",
        delete: "حذف المهمة",
        footer: "جميع الحقوق محفوظة.",
        madeWith: "صنع بكل شغف.",
        added: "تمت إضافة المهمة بنجاح!",
        deleted: "تم حذف المهمة بنجاح!",
        confirmDelete: "هل أنت متأكد من حذف هذه المهمة؟"
    }

};


// =========================
// Local Storage
// =========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentLanguage = localStorage.getItem("language") || "en";

let currentFilter = "all";


// =========================
// Language System
// =========================

function changeLanguage() {

    const lang = translations[currentLanguage];

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.classList.toggle(
        "rtl",
        currentLanguage === "ar"
    );

    // Translate Text

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        element.textContent = lang[key];

    });

    // Translate Placeholders

    document.querySelectorAll("[data-placeholder]").forEach(element => {

        const key = element.dataset.placeholder;

        element.placeholder = lang[key];

    });

    // Language Button

    languageBtn.textContent =
        currentLanguage === "en"
            ? "🇪🇬 العربية"
            : "🇬🇧 English";

    displayTasks();

}


// Language Button Event

languageBtn.addEventListener("click", () => {

    currentLanguage =
        currentLanguage === "en" ? "ar" : "en";

    localStorage.setItem("language", currentLanguage);

    changeLanguage();

});


// =========================
// Open & Close Task Form
// =========================

addTaskBtn.addEventListener("click", () => {

    taskForm.classList.toggle("show");

    if (taskForm.classList.contains("show")) {
        taskInput.focus();
    }

});


cancelTaskBtn.addEventListener("click", () => {

    taskForm.reset();

    taskForm.classList.remove("show");

});


// =========================
// Add New Task
// =========================

taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    const newTask = {

        id: Date.now(),

        title: title,

        priority: taskPriority.value,

        date: taskDate.value,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    taskForm.reset();

    taskForm.classList.remove("show");

    alert(translations[currentLanguage].added);

});


// =========================
// Save Tasks
// =========================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();

}


// =========================
// Display Tasks
// =========================

function displayTasks() {

    taskList.innerHTML = "";

    const lang = translations[currentLanguage];

    // Statistics

    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;


    // Filter Tasks

    let filteredTasks = tasks;

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    } else if (currentFilter === "pending") {

        filteredTasks = tasks.filter(task => !task.completed);

    }


    // Empty State

    if (filteredTasks.length === 0) {

        const emptyState = document.createElement("div");

        emptyState.className = "empty-state";

        const icon = document.createElement("i");

        icon.className = "fa-solid fa-clipboard-list";

        const message = document.createElement("p");

        message.textContent = lang.empty;

        emptyState.append(icon, message);

        taskList.appendChild(emptyState);

        return;

    }


    // Create Task Elements

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task-item ${task.completed ? "completed" : ""}`;


        // Task Information

        const taskInfo = document.createElement("div");

        taskInfo.className = "task-info";


        const title = document.createElement("h3");

        title.textContent = task.title;


        const date = document.createElement("p");

        date.textContent = task.date || lang.noDate;


        const priority = document.createElement("span");

        priority.className = `priority ${task.priority}`;

        const priorityKey = task.priority.toLowerCase();

        priority.textContent = lang[priorityKey];


        taskInfo.append(title, date, priority);


        // Task Actions

        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Complete Button

        const completeBtn = document.createElement("button");

        completeBtn.type = "button";

        completeBtn.title = task.completed
            ? lang.markPending
            : lang.markComplete;

        completeBtn.setAttribute("aria-label", completeBtn.title);

        const completeIcon = document.createElement("i");

        completeIcon.className = task.completed
            ? "fa-solid fa-rotate-left"
            : "fa-solid fa-check";

        completeBtn.appendChild(completeIcon);


        completeBtn.addEventListener("click", () => {

            toggleTask(task.id);

        });


        // Delete Button

        const deleteBtn = document.createElement("button");

        deleteBtn.type = "button";

        deleteBtn.className = "delete-btn";

        deleteBtn.title = lang.delete;

        deleteBtn.setAttribute("aria-label", lang.delete);

        const deleteIcon = document.createElement("i");

        deleteIcon.className = "fa-solid fa-trash";

        deleteBtn.appendChild(deleteIcon);


        deleteBtn.addEventListener("click", () => {

            deleteTask(task.id);

        });


        actions.append(completeBtn, deleteBtn);

        taskElement.append(taskInfo, actions);

        taskList.appendChild(taskElement);

    });

}


// =========================
// Complete / Undo Task
// =========================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

}


// =========================
// Delete Task
// =========================

function deleteTask(id) {

    const confirmMessage =
        translations[currentLanguage].confirmDelete;

    if (!confirm(confirmMessage)) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    alert(translations[currentLanguage].deleted);

}


// =========================
// Sidebar Filters
// =========================

const navLinks = document.querySelectorAll("[data-filter]");

navLinks.forEach(link => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        currentFilter = link.dataset.filter;

        navLinks.forEach(item => {

            item.classList.remove("active");

        });

        link.classList.add("active");

        displayTasks();

    });

});


// =========================
// Start Application
// =========================

changeLanguage();

getTasks();