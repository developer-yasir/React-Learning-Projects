import React, { useState, useEffect } from 'react';
import DraggableNote from './NoteCard';
import './App.css'

function App() {
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'))
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!note.trim()) return
    const newNote = {
      id: Date.now(),
      text: note,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
      color: '#f9f9f9',
      isPinned: false,
      tags: [],
      checklist: []
    }
    setNotes([...notes, newNote])
    setNote("")
  }

  const updatePosition = (id, x, y) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, x, y } : note))
    )
  }

  const deleteNote = id => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const updateNote = (id, newText) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, text: newText } : note))
    )
  }

  const updateColor = (id, newColor) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, color: newColor } : note))
    )
  }

  const togglePin = id => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, isPinned: !note.isPinned } : note))
    )
  }

  const addTag = (id, tag) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, tags: [...note.tags, tag] } : note))
    )
  }

  const addChecklistItem = (id, item) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, checklist: [...note.checklist, { text: item, checked: false }] }
          : note
      )
    )
  }

  const toggleChecklistItem = (id, index) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? {
              ...note,
              checklist: note.checklist.map((item, i) =>
                i === index ? { ...item, checked: !item.checked } : item
              ),
            }
          : note
      )
    )
  }

  const [selectedTag, setSelectedTag] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const filteredNotes = notes
    .filter(note =>
      note.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(note => (selectedTag ? note.tags.includes(selectedTag) : true))

  const pinnedNotes = filteredNotes.filter(note => note.isPinned)
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned)

  const allTags = [...new Set(notes.flatMap(note => note.tags))]

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>Note Taking App</h1>
        <div className="header-controls">
          <button onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="tags-container">
          <button onClick={() => setSelectedTag(null)}>All Notes</button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)}>{tag}</button>
          ))}
        </div>
      </header>
      <div className="input-area">
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write note..."
        />
        <button onClick={addNote}>Add</button>
      </div>

      <div className="notes-container">
        <h2>Pinned Notes</h2>
        <div className="notes-grid">
          {pinnedNotes.map(note => (
            <DraggableNote
              key={note.id}
              id={note.id}
              text={note.text}
              x={note.x}
              y={note.y}
              color={note.color}
              isPinned={note.isPinned}
              tags={note.tags}
              checklist={note.checklist}
              onDrag={updatePosition}
              onDelete={deleteNote}
              onUpdate={updateNote}
              onColorChange={updateColor}
              onTogglePin={togglePin}
              onAddTag={addTag}
              onAddChecklistItem={addChecklistItem}
              onToggleChecklistItem={toggleChecklistItem}
            />
          ))}
        </div>
        <h2>Other Notes</h2>
        <div className="notes-grid">
          {unpinnedNotes.map(note => (
            <DraggableNote
              key={note.id}
              id={note.id}
              text={note.text}
              x={note.x}
              y={note.y}
              color={note.color}
              isPinned={note.isPinned}
              tags={note.tags}
              checklist={note.checklist}
              onDrag={updatePosition}
              onDelete={deleteNote}
              onUpdate={updateNote}
              onColorChange={updateColor}
              onTogglePin={togglePin}
              onAddTag={addTag}
              onAddChecklistItem={addChecklistItem}
              onToggleChecklistItem={toggleChecklistItem}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App