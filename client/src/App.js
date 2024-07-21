import React from 'react';
import{BrowserRouter,Routes,Route}from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Employee from './components/Employee';
import Employee_list from './components/Employee_list';
import Update_employee from './components/Update_employee';
import Signup from './components/Signup';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/admin' element={<Admin/>} ></Route>
        <Route path='/employee' element={<Employee/>} ></Route>
        <Route path='/employee_list' element={<Employee_list />} ></Route>
        <Route path='/update_employee/:id' element={<Update_employee/>} ></Route>
        
      </Routes>
      </BrowserRouter>
    </div>
  )
   
    
  
}

export default App;
