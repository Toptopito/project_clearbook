import React from 'react';
import { Outlet } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Clearbook - Personal Health Records</h1>
        <p>
          A secure application for managing personal health records
        </p>
      </header>
      <main className="App-main">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
