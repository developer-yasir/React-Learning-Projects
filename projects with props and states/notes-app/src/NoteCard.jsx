import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function DraggableNote({ id, text, x, y, color, isPinned, tags, checklist, onDrag, onDelete, onUpdate, onColorChange, onTogglePin, onAddTag, onAddChecklistItem, onToggleChecklistItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const noteRef = useRef(null);
  const [newTag, setNewTag] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const handleMouseDown = (e) => {
    // Prevent dragging when interacting with controls
    if (e.target.closest('.note-controls') || e.target.closest('.tag-input') || e.target.closest('.checklist-input')) {
      return;
    }

    const startX = e.pageX - x;
    const startY = e.pageY - y;

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.pageX - startX;
      const newY = moveEvent.pageY - startY;
      onDrag(id, newX, newY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(id, editedText);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(id, newTag.trim());
      setNewTag("");
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      onAddChecklistItem(id, newChecklistItem.trim());
      setNewChecklistItem("");
    }
  };

  return (
    <div
      ref={noteRef}
      className={`draggable-note ${isPinned ? 'pinned' : ''}`}
      style={{ top: y, left: x, backgroundColor: color }}
      onMouseDown={handleMouseDown}
    >
      <div className="note-content">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="note-textarea"
            autoFocus
          />
        ) : (
          <ReactMarkdown>{text}</ReactMarkdown>
        )}
      </div>
      <div className="checklist">
        {checklist.map((item, index) => (
          <div key={index} className="checklist-item">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => onToggleChecklistItem(id, index)}
            />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      <div className="checklist-input">
        <input
          type="text"
          placeholder="Add a checklist item..."
          value={newChecklistItem}
          onChange={e => setNewChecklistItem(e.target.value)}
        />
        <button onClick={handleAddChecklistItem}>+</button>
      </div>
      <div className="tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <div className="tag-input">
        <input
          type="text"
          placeholder="Add a tag..."
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
        />
        <button onClick={handleAddTag}>+</button>
      </div>
      <div className="note-controls">
        <button className="pin-btn" onClick={() => onTogglePin(id)}>{isPinned ? 'Unpin' : 'Pin'}</button>
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
        )}
        <input
          type="color"
          defaultValue={color}
          onChange={(e) => onColorChange(id, e.target.value)}
          className="color-picker"
        />
        <button className="delete-btn" onClick={() => onDelete(id)}>X</button>
      </div>
    </div>
  );
}

export default DraggableNote;
