import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Tailwind or your CSS
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { SyncProvider } from './context/SyncContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <SearchProvider>
            <SyncProvider>
              <App />
            </SyncProvider>
          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
