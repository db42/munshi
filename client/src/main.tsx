import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from 'next-themes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <App />
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>,
)