import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Components/Signin';
import Signup from './Components/Signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="./Signup" element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
