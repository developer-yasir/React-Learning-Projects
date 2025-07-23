import React, { useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setUName] = useState('');
  const [email, setEmail] = useState('');

  const addUsersHandle = () => {
    if (!name || !email) return alert('Name or Email is missing');
    const newUser = { name, email };
    setUsers([...users, newUser]);
    setUName('');
    setEmail('');
  };

  const handleDelete = (index) => {
    const filtered = users.filter((_, i) => i !== index);
    setUsers(filtered);
  };

  return (
    <div className="app-container">
      <h1 className="title">User Manager </h1>

      <div className="form">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setUName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addUsersHandle}>Add User</button>
      </div>

      <div className="users-list">
        {users.length === 0 ? (
          <p className="no-users">No users added yet.</p>
        ) : (
          users.map((user, index) => (
            <div className="user-card" key={index}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
