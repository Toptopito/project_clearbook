import React from 'react';
import logo from './logo.svg';
import './App.css';
import HelloWorld from './components/HelloWorld';

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
        <HelloWorld />
      </main>
    </div>
  );
}

export default App;
