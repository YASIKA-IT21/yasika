import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming your main App component is here
import { UserProvider } from './components/Usercontext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
