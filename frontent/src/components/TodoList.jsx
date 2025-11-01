import { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    setLoading(true);
    setError(null);

    // Fetch todos from Express server
    fetch('/api/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const addTodo = () => {
    if (newTodo.trim() === '') {
      return;
    }

    // Send POST request to create new todo
    fetch('http://localhost:3001/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: newTodo })
    })
      .then(res => res.json())
      .then(todo => {
        // Add new todo to state
        setTodos([...todos, todo]);
        setNewTodo('');
      })
      .catch(err => {
        console.error('Error adding todo:', err);
      });
  };

  const toggleTodo = (id) => {
    // Send PUT request to toggle todo
    fetch(`/api/todos/${id}`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(updatedTodo => {
        // Update todo in state
        setTodos(todos.map(t =>
          t.id === id ? updatedTodo : t
        ));
      })
      .catch(err => {
        console.error('Error toggling todo:', err);
      });
  };

  const deleteTodo = (id) => {
    // Send DELETE request
    fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Remove todo from state
        setTodos(todos.filter(t => t.id !== id));
      })
      .catch(err => {
        console.error('Error deleting todo:', err);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={fetchTodos}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">
          Add Todo
        </button>
      </div>

      <div className="todos">
        {todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add one to get started!</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span
                className={todo.completed ? 'todo-text completed' : 'todo-text'}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="todo-stats">
        <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
      </div>
    </div>
  );
}

export default TodoList;
