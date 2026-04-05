import { useState } from 'react';

function SearchClass() {
  // State variables for multiple search fields
  const [instructor, setInstructor] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classes, setClasses] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Format duration from minutes readable string
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check if at least one search field is filled
    if (!instructor.trim() && !classCode.trim()) {
      setErrorMessage('Please enter at least one search criterion (instructor or class code)');
      setClasses([]);
      setSearched(false);
      return;
    }

    try {
      // Build query parameters dynamically
      const params = new URLSearchParams();
      if (instructor.trim()) params.append('instructor', instructor);
      if (classCode.trim()) params.append('classCode', classCode);

      const response = await fetch(`/api/classes/search?${params.toString()}`);
      const result = await response.json();

      if (response.status === 200) {
        setClasses(result);
        setErrorMessage('');
      } else {
        setErrorMessage(result.error || 'No classes found');
        setClasses([]);
      }
      setSearched(true);
    } catch (error) {
      console.error('Error searching classes:', error);
      setErrorMessage(`An error occurred: ${error.message}`);
      setClasses([]);
      setSearched(true);
    }
  };

  const handleClear = () => {
    setInstructor('');
    setClassCode('');
    setClasses([]);
    setSearched(false);
    setErrorMessage('');
  };

  return (
    <>
      <div id="search-book" className="search-card">
        <h2>Search Classes</h2>
        <form onSubmit={handleSubmit}>
          <div className="search-fields">
            <div className="search-field">
              <label htmlFor="instructor">Instructor (partial match):</label>
              <input
                id="instructor"
                type="text"
                placeholder="e.g., 'Martha' or 'David'"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label htmlFor="classCode">Class Code:</label>
              <input
                id="classCode"
                type="text"
                placeholder="e.g., '1001'"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              />
            </div>
          </div>

          <div className="search-buttons">
            <button type="submit">Search</button>
            <button type="button" onClick={handleClear}>Clear</button>
          </div>
        </form>

        {errorMessage && (
          <div className="search-error">
            <p>{errorMessage}</p>
          </div>
        )}

        {searched && (
          <>
            {classes.length > 0 ? (
              <div id="search-results">
                <p className="result-count">Found {classes.length} class(es)</p>
                {classes.map(cls => {
                  const imageName = (cls.hasImage ? cls.classCode : 'PlaceholderClass') + '.jpg';
                  return (
                    <div key={cls.classCode} className="book-card">
                      <img src={`/images/classes/${imageName}`} height="120" alt={cls.className} />
                      <div className="book-info">
                        <p><strong>{cls.className}</strong></p>
                        <p>Instructor: {cls.instructor}</p>
                        <p>Code: {cls.classCode}</p>
                        <p>Duration: {formatDuration(cls.duration)}</p>
                        <p>Schedule: {cls.frequency}</p>
                        {cls.note && <p>Note: {cls.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-results">No classes found matching your search criteria.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SearchClass;
