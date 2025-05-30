import  { useState, useEffect } from 'react';
import {
  Plus,
  Trash,
  Sun,
  Moon,
  Pencil,
  Save,
} from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
    setNewTask('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className={`todo-container ${theme}`}>
      <div className="header">
        <h1 className="todo-title">📋 To-Do List</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="todo-input-section">
        <input
          type="text"
          className="todo-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="todo-add-button" onClick={handleAddTask}>
          <Plus size={16} />
        </button>
      </div>

      <div className="todo-filters">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="todo-list">
        {filteredTasks.map((task) => (
          <div
            className={`todo-item ${task.completed ? 'completed-item' : ''}`}
            key={task.id}
          >
            <div className="todo-item-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              {editingId === task.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="todo-input"
                  autoFocus
                />
              ) : (
                <span className={task.completed ? 'completed' : ''}>
                  {task.text}
                </span>
              )}
            </div>
            <div className="todo-item-actions">
              {editingId === task.id ? (
                <button className="icon-button" onClick={() => saveEdit(task.id)}>
                  <Save size={16} />
                </button>
              ) : (
                <button
                  className="icon-button"
                  onClick={() => startEditing(task.id, task.text)}
                >
                  <Pencil size={16} />
                </button>
              )}
              <button className="icon-button" onClick={() => handleDeleteTask(task.id)}>
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
