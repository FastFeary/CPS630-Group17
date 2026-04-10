import { useState } from 'react';

function UpdateClass({ onClassUpdated, authToken }) {
  const [classCode, setClassCode] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    if (!authToken) {
      alert('Please login first to update classes.');
      return;
    }

    const updatedClass = {};
    if (note) {
      updatedClass.note = note;
    }

    try {
      const response = await fetch(`/api/classes/code/${classCode}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            Permission: 'admin'
        },

        body: JSON.stringify(updatedClass)
      });
      const result = await response.json();
      
      if (response.status === 200) {
        setClassCode('');
        setNote('');
        if (onClassUpdated) onClassUpdated(); // Refresh the class list
      }
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  return (
    <>
      <div id="update-book">
        <h2>Add Note (Update Class)</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Class Code to Update" 
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="New Note" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required 
          />
          <button type="submit">Update Class</button>
        </form>
      </div>
    </>
  );
}

export default UpdateClass;
