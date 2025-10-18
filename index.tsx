import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Wait for the DOM to be fully loaded before trying to render the app
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    // This case should be rare now, but it's good practice to keep it.
    console.error("Fatal Error: Root element not found.");
    document.body.innerHTML = '<div style="color: red; text-align: center; padding: 20px;"><h1>Fatal Error</h1><p>Could not find the root element to mount the application.</p></div>';
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("An error occurred during application startup:", error);
    // Display a helpful error message directly on the page
    rootElement.innerHTML = `
      <div style="font-family: sans-serif; color: #f87171; background-color: #1f2937; padding: 2rem; border-radius: 0.5rem; margin: 2rem; border: 1px solid #374151;">
        <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Application Error</h1>
        <p style="margin-bottom: 1rem;">Something went wrong while starting the application. Please check the console for more details.</p>
        <pre style="background-color: #111827; color: #e5e7eb; padding: 1rem; border-radius: 0.25rem; white-space: pre-wrap; word-wrap: break-word;">${error.message}\n\n${error.stack}</pre>
      </div>
    `;
  }
});