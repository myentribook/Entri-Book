import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux'

const rootElement = document.getElementById('root') || document.body.appendChild(document.createElement('div'));

window.addEventListener('unhandledrejection', () => {
  // Prevent unhandled promise rejections from breaking app runtime
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
  <Provider store={store} >
    <App />
  </Provider>
  //  </React.StrictMode> 
);