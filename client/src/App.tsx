import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './views/Login';
import Register from './views/Register';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
// import Chat from './components/Chat/Chat';
// import MessageForm from './components/MessageForm/MessageForm';


function App() {
  const [isLoggedIn, setisLoggedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetch('/api/auth/user-auth')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log('isLoggedIn:', isLoggedIn);

        if (data.isAuthenticated) {
          setisLoggedIn(true);
        } else {
          setisLoggedIn(false);
        }
      })
  }, [])

  console.log('isLoggedIn:', isLoggedIn);


  return (
    <div className="App">
      <BrowserRouter>
        <ProtectedRoutes isLoggedIn={isLoggedIn}>
          <Route path='/' element={<h1>HOLA</h1>} />
        </ProtectedRoutes>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/login/failed' element={<h1>Failed login</h1>} />
          <Route path='/register' element={<Register />} />
          <Route path='/register/failed' element={<h1>Failed register</h1>} />
        </Routes>
        {/* <h1>chat</h1>
        <MessageForm />
        <Chat /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
