import { useState } from 'react';
import DisplayBooks from './components/DisplayBooks';
import SearchBook from './components/SearchBook';
import NewBook from './components/NewBook';
import UpdateBook from './components/UpdateBook';
import DeleteBook from './components/DeleteBook';
import './css/App.css';

//React uses Pascal Case / Upper Camel Case for component names by convention (differentiates it from non-jsx JavaScript functions)
function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // This function will be called when a book is added, updated, or deleted
  const handleRefresh = () => {
    //often this is a counter; but I don't like the idea of an infinite counter so using a boolean toggle instead
    setRefreshTrigger(prev => !prev);
  };

  return (
    //this is a fragment - a way to return elements without adding additional divs to the DOM
    <>
      <DisplayBooks refreshTrigger={refreshTrigger} />
      <SearchBook />
      <NewBook onBookAdded={handleRefresh} />
      <UpdateBook onBookUpdated={handleRefresh} />
      <DeleteBook onBookDeleted={handleRefresh} />
    </>
  );
}

//export allows this component to be imported in other files/modules
export default App;
