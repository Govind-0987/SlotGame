import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext'; 

import SlotMachine from './components/SlotMachine'; 
import Login from './components/Login';
import Register from './components/Register';
// import Sidebar from './components/Sidebar'; 
import './App.css';

const App = () => {
  const [balance, setBalance] = useState();

  const updateBalance = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
    console.log('Balance updated by:', amount, 'New balance:', balance + amount);
  };

  return (
    <ChakraProvider>
      <UserProvider> 
        <Router>
          <div className="app">
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route 
                path="/Home" 
                element={<SlotMachine updateBalance={updateBalance} balance={balance} />} 
              />
              <Route path="/Register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
};

export default App;
