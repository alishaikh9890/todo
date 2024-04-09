import React from 'react';
import './App.css';
import Todos from './components/Todos';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div className="App">
    <Routes>
      {/* Route for the root path, rendering the Login component */}
      <Route path='/' element={<Login/>} />
    
      {/* Route for the '/todos/:todosId' path, rendering the Todos component */}
      <Route path='/todos/:todosId' element={<Todos/>} />
    </Routes>
  </div>
  
  );
}

export default App;
