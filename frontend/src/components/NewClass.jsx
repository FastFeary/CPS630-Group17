import { useState } from 'react';

function NewClass({ onClassAdded, authToken }) {
  const [formData, setFormData] = useState({
    classCode: '',
    className: '',
    instructor: '',
    duration: '',
    frequency: '',
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authToken) {
      alert('Please login first to add classes.');
      return;
    }

    const newClass = {
      classCode: parseInt(formData.classCode),
      className: formData.className,
      instructor: formData.instructor,
      duration: parseInt(formData.duration),
      frequency: formData.frequency,
      note: formData.note
    };
    
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            Permission: 'admin'
        },
        body: JSON.stringify(newClass)
      });
      const result = await response.json();
      
      if (response.status === 201) {
        setFormData({ classCode: '', className: '', instructor: '', duration: '', frequency: '', note: '' }); // Reset form
        if (onClassAdded) onClassAdded(); // Refresh the class list
      }
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div id="new-form">
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            name="classCode" 
            placeholder="Class Code (e.g. 1001)" 
            value={formData.classCode}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="className" 
            placeholder="Class Name" 
            value={formData.className}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="instructor" 
            placeholder="Instructor" 
            value={formData.instructor}
            onChange={handleChange}
            required 
          />
          <input 
            type="number" 
            name="duration" 
            placeholder="Duration (minutes)" 
            value={formData.duration}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="frequency" 
            placeholder="Schedule (e.g. Mon/Wed Jan 6 - Apr 25 2026)" 
            value={formData.frequency}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="note" 
            placeholder="Note (optional)" 
            value={formData.note}
            onChange={handleChange}
          />
          <button type="submit">Add Class</button>
        </form>
      </div>
    </>
  );
}

export default NewClass;
