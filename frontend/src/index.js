import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' instead of 'react-dom'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root container
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);