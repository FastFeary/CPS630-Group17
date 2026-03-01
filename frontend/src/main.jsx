//main entry point for the React application
//strict mode is a tool for highlighting potential problems in an application
import { StrictMode } from 'react';

//createRoot is the new way to initialize the React DOM in React 18+
import { createRoot } from 'react-dom/client';
import './css/index.css';
import App from './App.jsx';

//this targets the div with id 'root' in public/index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);