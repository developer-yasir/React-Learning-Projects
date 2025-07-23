import React, { useState } from 'react';
import './App.css'; // CSS styles file

function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  function handleAddOrUpdate() {
    if (item.trim() === '') return;

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = item;
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, item]);
    }

    setItem('');
  }

  function handleEdit(index) {
    setItem(items[index]);
    setEditIndex(index);
  }

  function handleDelete(index) {
    const filtered = items.filter((_, i) => i !== index);
    setItems(filtered);
    if (editIndex === index) {
      setEditIndex(null);
      setItem('');
    }
  }

  return (
    <div className="container">
      <h2>ToDo App</h2>

      <div className="form">
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Enter item..."
        />
        <button onClick={handleAddOrUpdate}>
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="list">
        {items.map((val, index) => (
          <li key={index}>
            <span>{val}</span>
            <div className="buttons">
              <button onClick={() => handleEdit(index)}>✏️</button>
              <button onClick={() => handleDelete(index)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
