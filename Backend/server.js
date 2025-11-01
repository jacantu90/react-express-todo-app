// Import required packages
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS so React can make requests from port 5173
app.use(cors());

// In-memory todo storage
let todos = [
  { id: 1, text: "Learn React", completed: false },
  { id: 2, text: "Learn Express", completed: false },
  { id: 3, text: "Build a full stack app", completed: false },
];

// Get all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// Get single todo by ID
app.get("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === todoId);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

// Add new todo
app.post("/api/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Toggle todo completion
app.put("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === todoId);

  if (todo) {
    todo.completed = !todo.completed;
    res.json(todo);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

// Delete todo
app.delete("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter((t) => t.id !== todoId);

  if (todos.length < initialLength) {
    res.json({ message: "Todo deleted successfully" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
