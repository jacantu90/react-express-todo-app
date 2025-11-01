import { useState } from 'react';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Full Stack Todo App</h1>
        <p>React Frontend + Express Backend</p>
      </header>

      <main>
        <TodoList />
      </main>

      <footer className="app-footer">
        <p>Connecting React to Express Demo</p>
      </footer>
    </div>
  );
}

export default App;
