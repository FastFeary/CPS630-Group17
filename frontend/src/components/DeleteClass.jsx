import { useState } from 'react';

function DeleteClass({ onClassDeleted, authToken }) {
  const [classCode, setClassCode] = useState('');

  console.log(classCode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authToken) {
      alert('Please login first to delete classes.');
      return;
    }

    try {
      const response = await fetch(`/api/classes/code/${classCode}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Permission: 'admin'
        }
      });
      
      if (response.status === 204) {
        setClassCode('');
        if (onClassDeleted) onClassDeleted(); // Refresh the class list
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <>
      <div id="delete-book">
        <h2>Delete Class</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Class Code to Delete" 
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            required 
          />
          <button type="submit">Delete Class</button>
        </form>
      </div>
    </>
  );
}

export default DeleteClass;
