const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
    res.send("Smart Task Manager Backend is Running!");
});

let tasks = [];

app.post("/api/tasks", (req, res) => {

    const newTask = {
        id: Date.now(),
        title: req.body.title,
        priority: req.body.priority,
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully!",
        task: newTask
    });

});

app.get("/api/tasks", (req, res) => {

    res.status(200).json({
        tasks: tasks
    });

});

app.put("/api/tasks/:id", (req, res) => {

    const taskId = Number(req.params.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Task not found!"
        });
    }

    task.title = req.body.title ?? task.title;
    task.priority = req.body.priority ?? task.priority;
    task.completed = req.body.completed ?? task.completed;

    res.json({
        message: "Task updated successfully!",
        task: task
    });

});

app.delete("/api/tasks/:id", (req, res) => {

    console.log("DELETE ROUTE REACHED!");

    const taskId = Number(req.params.id);

    tasks = tasks.filter(task => task.id !== taskId);

    res.json({
        message: "Task deleted successfully!"
    });

});
// فحص المسارات
console.log(
    app.router.stack
        .map(layer => layer.route?.path)
        .filter(Boolean)
);

app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    next();
});

app.listen(PORT, () => {
    console.log("Server is running on port 3001 - Version 2");
});