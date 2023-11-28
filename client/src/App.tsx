import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './views/Login';
import Register from './views/Register';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AppContextProvider } from './Context/AppContext';
// import Chat from './components/Chat/Chat';
// import MessageForm from './components/MessageForm/MessageForm';


const App = () => {

    return (
        <div className="App">
            <AppContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<ProtectedRoutes/>}>
                            <Route path='/' element={<h1>HOLA</h1>} />
                        </Route>
                        <Route path='/login' element={<Login />} />
                        <Route path='/login/failed' element={<h1>Failed login</h1>} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/register/failed' element={<h1>Failed register</h1>} />
                    </Routes>
                    {/* <h1>chat</h1>
                    <MessageForm />
                    <Chat /> */}
                </BrowserRouter>
            </AppContextProvider>
        </div>
    );
}

export default App;
